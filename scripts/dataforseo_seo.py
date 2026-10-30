#!/usr/bin/env python3
"""Inteligencia SEO con DataForSEO para el clúster Heymondo / «Mondo» / IATI (Google España).

Qué hace (cada paso se guarda en seo/dataforseo/ y es reanudable):
  keywords  Expande las semillas (heymondo, hey mondo, mondo, iati...) con volúmenes EXACTOS de España,
            CPC, dificultad, intención y estacionalidad (sustituye a los cubos del Planificador de Google).
  serp      Foto real de la SERP de las keywords con más valor: quién rankea, preguntas «La gente también
            pregunta», fragmentos destacados, AI Overview y qué URLs nuestras aparecen (canibalización).
  ranked    Keywords en las que ya rankeamos nosotros y en las que rankean los competidores (se detectan
            solos desde la SERP, o se fijan con --peers).
  report    Cruza todo con tus posts (src/data/post) y escribe docs/seo-dataforseo/informe-AAAA-MM-DD.md
            + CSV: victorias rápidas, huecos frente a competidores, canibalización, FAQ y estacionalidad.
  brief     Ficha de contenido para una keyword: H2 y extensión de los 5 primeros resultados.
  all       keywords -> serp -> ranked -> report.

Credenciales: DATAFORSEO_LOGIN y DATAFORSEO_PASSWORD (la contraseña de API, no la de la cuenta) en el entorno
o en .env (ignorado por git). Nunca van al repositorio.

Coste: la API devuelve el coste de cada llamada; el script lo suma, cachea todo en disco (no paga dos veces
lo mismo) y se detiene al llegar a --max-cost (por defecto 3 USD).

Uso:  python scripts/dataforseo_seo.py all [--max-cost 3]
      python scripts/dataforseo_seo.py brief "descuento heymondo"
"""
from __future__ import annotations

import argparse
import base64
import csv
import hashlib
import json
import os
import re
import sys
import time
import unicodedata
import urllib.error
import urllib.request
from collections import Counter, defaultdict
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "seo" / "dataforseo"
CACHE = OUT / "cache"
REPORTS = ROOT / "docs" / "seo-dataforseo"
POSTS = ROOT / "src" / "data" / "post"
PAGES = ROOT / "src" / "pages"

API = "https://api.dataforseo.com/v3"
LOCATION, LANGUAGE = 2724, "es"  # España, español
OUR_DOMAIN = "mochileandosinbarreras.com"

# Semillas: marca + sinónimos reales de búsqueda («mondo» es la marca anterior de Heymondo).
SEEDS = [
    "heymondo", "hey mondo", "mondo seguros", "mondo seguro de viaje",
    "iati", "iati seguros", "seguro iati", "iati seguro de viaje",
    "heymondo o iati", "mondo o iati", "iati vs heymondo",
]
# Modificadores que pegamos a cada marca para forzar cola larga transaccional.
MODIFIERS = [
    "descuento", "codigo descuento", "cupon", "opiniones", "es fiable", "precio", "cuanto cuesta",
    "telefono", "reclamar", "cancelacion", "mochilero", "familia", "anual", "camper", "estados unidos",
    "black friday", "app", "coberturas", "deportes aventura", "larga estancia",
]
BRANDS = ["heymondo", "hey mondo", "mondo", "iati"]

BRAND_RE = re.compile(r"mondo|iati", re.I)
GENERIC_RE = re.compile(r"seguro.*viaj|viaj.*seguro|asistencia.*viaj", re.I)

# Dominios que no son competidores editoriales (las propias marcas, agregadores, foros, buscadores).
NOT_PEERS = re.compile(
    r"heymondo|iatiseguros|intermundial|chapka|mapfre|axa\.|allianz|ocu\.org|rastreator|acierto|"
    r"youtube|reddit|quora|wikipedia|facebook|instagram|tiktok|trustpilot|google|amazon|"
    r"mochileandosinbarreras|iatiglobal|holafly", re.I)

INTENTS = [  # (nombre, regex), el primero que coincide gana
    ("descuento / cupón", r"descuent|cupon|cupón|codigo|código|promo|oferta|black friday|rebaja"),
    ("opiniones / fiabilidad", r"opinion|opinión|fiable|estafa|reseña|valoracion|valoración|merece|segur[oa]s? .*(bueno|malo)|trustpilot"),
    ("comparativa", r" vs | versus |compar| o iati| iati o | o (hey ?)?mondo | (hey ?)?mondo o | o heymondo |diferencia"),
    ("contacto / siniestros", r"telefono|teléfono|contacto|whatsapp|reclam|siniestro|parte|devoluc|atencion|atención|email"),
    ("precio", r"precio|cuanto cuesta|cuánto cuesta|tarifa|barato|cotiz|presupuesto|simul"),
    ("coberturas / producto", r"cobertura|cubre|incluye|anulacion|anulación|cancelacion|cancelación|anual|larga estancia|multiviaje|camper|deport|aventura|mochiler|familia|premium|top |esencial|escapada"),
    ("destino", r"estados unidos|eeuu|usa|nueva york|japon|japón|tailandia|india|mexico|méxico|cuba|peru|perú|argentina|chile|europa|schengen|visado|canada|canadá|australia|asia|marruecos|egipto|bali|indonesia"),
]

STOP = set("vs de del la el los las un una y o en para por con sin a al que se es su mi tu seguro seguros viaje viajes viajar".split())

# CTR orgánico medio por posición (curva conservadora de la industria; sirve para ordenar, no para prometer).
CTR = {1: .28, 2: .15, 3: .10, 4: .07, 5: .05, 6: .04, 7: .03, 8: .025, 9: .02, 10: .017}


def ctr(pos: float | None) -> float:
    if not pos:
        return .001
    p = int(round(pos))
    if p in CTR:
        return CTR[p]
    return .008 if p <= 20 else .002


def norm(s: str) -> str:
    s = unicodedata.normalize("NFD", s.lower())
    return "".join(c for c in s if unicodedata.category(c) != "Mn")


def tokens(s: str) -> set[str]:
    t = re.sub(r"[^a-z0-9 ]", " ", norm(s))
    t = " " + t + " "
    for alias in (" hey mondo ", " mondo "):
        t = t.replace(alias, " heymondo ")
    return {w for w in t.split() if w not in STOP and len(w) > 1}


NAV = "navegacional (solo marca)"


def intent_of(kw: str) -> str:
    if tokens(kw) <= {"heymondo", "iati"}:
        return NAV
    k = " " + norm(kw) + " "
    for name, rx in INTENTS:
        if re.search(norm(rx), k):
            return name
    return "otras"


def canon(kw: str) -> tuple:
    """Clave que Google trata como la misma búsqueda: ignora orden, plurales y artículos."""
    w = re.sub(r"[^a-z0-9 ]", " ", " " + norm(kw) + " ").replace(" hey mondo ", " heymondo ").split()
    w = [x[:-1] if x.endswith("s") and len(x) > 3 else x for x in w]
    return tuple(sorted(x for x in w if x not in {"de", "del", "la", "el", "los", "las", "para", "en"}))


def brands_of(kw: str) -> set[str]:
    t = tokens(kw)
    return {b for b in ("iati", "heymondo") if b in t}


# --------------------------------------------------------------------------- cliente


def load_env() -> None:
    f = ROOT / ".env"
    if f.exists():
        for line in f.read_text(encoding="utf-8").splitlines():
            if "=" in line and not line.lstrip().startswith("#"):
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


class Client:
    def __init__(self, max_cost: float):
        login, pwd = os.environ.get("DATAFORSEO_LOGIN"), os.environ.get("DATAFORSEO_PASSWORD")
        if not login or not pwd:
            sys.exit("Faltan DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD (entorno o .env). "
                     "Es la pareja de API de https://app.dataforseo.com/api-access, no tu contraseña de la cuenta.")
        self.auth = "Basic " + base64.b64encode(f"{login}:{pwd}".encode()).decode()
        self.max_cost, self.spent, self.calls, self.hits = max_cost, 0.0, 0, 0
        CACHE.mkdir(parents=True, exist_ok=True)

    def post(self, path: str, task: dict) -> dict:
        body = json.dumps([task], sort_keys=True)
        key = CACHE / (hashlib.sha1((path + body).encode()).hexdigest() + ".json")
        if key.exists():
            self.hits += 1
            return json.loads(key.read_text(encoding="utf-8"))
        if self.spent >= self.max_cost:
            sys.exit(f"Tope de coste alcanzado ({self.spent:.3f} USD >= {self.max_cost}). "
                     "Sube --max-cost si quieres seguir; lo ya descargado está en caché.")
        req = urllib.request.Request(f"{API}/{path}", data=body.encode(), method="POST",
                                     headers={"Authorization": self.auth, "Content-Type": "application/json"})
        for intento in range(4):
            try:
                with urllib.request.urlopen(req, timeout=120) as r:
                    data = json.loads(r.read().decode("utf-8"))
                break
            except urllib.error.HTTPError as e:
                if e.code in (429, 500, 502, 503) and intento < 3:
                    time.sleep(2 ** (intento + 1))
                    continue
                sys.exit(f"HTTP {e.code} en {path}: {e.read()[:300]!r}")
            except urllib.error.URLError as e:
                if intento < 3:
                    time.sleep(2 ** (intento + 1))
                    continue
                sys.exit(f"Red: {e}")
        t = (data.get("tasks") or [{}])[0]
        if data.get("status_code") != 20000 or t.get("status_code") != 20000:
            sys.exit(f"DataForSEO rechazó {path}: {t.get('status_code')} {t.get('status_message') or data.get('status_message')}")
        self.spent += float(data.get("cost") or 0)
        self.calls += 1
        key.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
        return data

    @staticmethod
    def result(data: dict) -> dict:
        return (((data.get("tasks") or [{}])[0].get("result")) or [{}])[0] or {}


def save(name: str, obj) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / name).write_text(json.dumps(obj, ensure_ascii=False, indent=1), encoding="utf-8")


def load(name: str, default=None):
    f = OUT / name
    return json.loads(f.read_text(encoding="utf-8")) if f.exists() else default


def rec_from(kd: dict) -> dict:
    """Normaliza el bloque keyword_info/properties/intent de Labs."""
    ki, kp, si = kd.get("keyword_info") or {}, kd.get("keyword_properties") or {}, kd.get("search_intent_info") or {}
    meses = ki.get("monthly_searches") or []
    return {
        "keyword": kd.get("keyword"),
        "volume": ki.get("search_volume") or 0,
        "cpc": ki.get("cpc") or 0.0,
        "competition": ki.get("competition_level"),
        "kd": kp.get("keyword_difficulty"),
        "intent_google": si.get("main_intent"),
        "monthly": [(m.get("year"), m.get("month"), m.get("search_volume") or 0) for m in meses][:12],
    }


# --------------------------------------------------------------------------- pasos


def cmd_keywords(c: Client, a) -> None:
    seeds = list(SEEDS) + [f"{b} {m}" for b in ("heymondo", "iati") for m in MODIFIERS]
    kws: dict[str, dict] = load("keywords.json", {})
    for i, seed in enumerate(seeds, 1):
        d = c.post("dataforseo_labs/google/keyword_suggestions/live", {
            "keyword": seed, "location_code": LOCATION, "language_code": LANGUAGE,
            "limit": a.limit, "include_seed_keyword": True, "include_serp_info": False,
        })
        for it in Client.result(d).get("items") or []:
            r = rec_from(it)
            if r["keyword"] and (BRAND_RE.search(r["keyword"]) or GENERIC_RE.search(r["keyword"])):
                kws.setdefault(r["keyword"], r)
        print(f"[keywords] {i}/{len(seeds)} «{seed}» -> {len(kws)} únicas | gastado {c.spent:.3f} USD")
    save("keywords.json", kws)


def cmd_serp(c: Client, a) -> None:
    kws = load("keywords.json") or sys.exit("Ejecuta antes: keywords")
    brand = [r for r in kws.values() if BRAND_RE.search(r["keyword"]) and r["volume"] >= a.min_volume]
    brand.sort(key=lambda r: (r["volume"] * max(r["cpc"], .2)), reverse=True)
    objetivo = brand[: a.top]
    serps = load("serp.json", {})
    for i, r in enumerate(objetivo, 1):
        d = c.post("serp/google/organic/live/advanced", {
            "keyword": r["keyword"], "location_code": LOCATION, "language_code": LANGUAGE,
            "device": "desktop", "depth": 20,
        })
        res, organic, paa, feats = Client.result(d), [], [], set()
        for it in res.get("items") or []:
            t = it.get("type")
            feats.add(t)
            if t == "organic":
                organic.append({"pos": it.get("rank_group"), "domain": it.get("domain"), "url": it.get("url"),
                                "title": it.get("title")})
            elif t == "people_also_ask":
                paa += [q.get("title") for q in it.get("items") or [] if q.get("title")]
        serps[r["keyword"]] = {"organic": organic, "paa": paa, "features": sorted(f for f in feats if f)}
        print(f"[serp] {i}/{len(objetivo)} «{r['keyword']}» | gastado {c.spent:.3f} USD")
    save("serp.json", serps)


def discover_peers(serps: dict, n: int = 5) -> list[str]:
    cnt: Counter[str] = Counter()
    for s in serps.values():
        for o in s["organic"]:
            dom = (o["domain"] or "").removeprefix("www.")
            if dom and not NOT_PEERS.search(dom) and (o["pos"] or 99) <= 10:
                cnt[dom] += 1
    return [d for d, _ in cnt.most_common(n)]


def cmd_ranked(c: Client, a) -> None:
    serps = load("serp.json", {})
    peers = a.peers.split(",") if a.peers else discover_peers(serps, a.n_peers)
    print(f"[ranked] competidores editoriales: {', '.join(peers) or '(ninguno: ejecuta serp antes)'}")
    out = load("ranked.json", {})
    flt = [["keyword_data.keyword", "like", "%mondo%"], "or", ["keyword_data.keyword", "like", "%iati%"],
           "or", ["keyword_data.keyword", "like", "%seguro%viaje%"]]
    for dom in [OUR_DOMAIN, *peers]:
        d = c.post("dataforseo_labs/google/ranked_keywords/live", {
            "target": dom, "location_code": LOCATION, "language_code": LANGUAGE, "limit": a.limit,
            "filters": flt, "order_by": ["keyword_data.keyword_info.search_volume,desc"],
        })
        rows = []
        for it in Client.result(d).get("items") or []:
            kd, se = it.get("keyword_data") or {}, (it.get("ranked_serp_element") or {}).get("serp_item") or {}
            r = rec_from(kd)
            r.update(pos=se.get("rank_group"), url=se.get("url"))
            rows.append(r)
        out[dom] = rows
        print(f"[ranked] {dom}: {len(rows)} keywords | gastado {c.spent:.3f} USD")
    save("ranked.json", out)


# --------------------------------------------------------------------------- informe


def local_pages() -> list[dict]:
    pages = []
    for f in sorted(POSTS.glob("*.mdx")):
        head = f.read_text(encoding="utf-8")[:2500]
        m = re.search(r"^\s*title:\s*[\"']?(.+?)[\"']?\s*$", head, re.M)
        pages.append({"slug": f.stem, "title": m.group(1) if m else f.stem, "kind": "post"})
    for f in sorted(PAGES.glob("*.astro")):
        if f.stem not in {"index", "404", "[...blog]"} and not f.stem.startswith("["):
            pages.append({"slug": f.stem, "title": f.stem, "kind": "página"})
    for p in pages:
        p["tok"] = tokens(p["slug"].replace("-", " ") + " " + p["title"])
    return pages


def best_page(kw: str, pages: list[dict]) -> tuple[dict | None, float]:
    kt, bs = tokens(kw), brands_of(kw)
    if not kt:
        return None, 0.0
    best, score = None, 0.0
    for p in pages:
        if not bs <= p["tok"]:
            continue
        s = len(kt & p["tok"]) / len(kt)
        if s > score:
            best, score = p, s
    return best, score


def our_position(kw: str, ranked_us: dict[str, dict], serps: dict) -> tuple[float | None, str | None]:
    r = ranked_us.get(kw)
    if r and r.get("pos"):
        return r["pos"], r.get("url")
    for o in (serps.get(kw) or {}).get("organic", []):
        if OUR_DOMAIN in (o["domain"] or ""):
            return o["pos"], o["url"]
    return None, None


def cmd_report(c: Client | None, a) -> None:
    kws = load("keywords.json") or sys.exit("Ejecuta antes: keywords")
    serps, ranked = load("serp.json", {}), load("ranked.json", {})
    ours = {r["keyword"]: r for r in ranked.get(OUR_DOMAIN, [])}
    peers = {d: {r["keyword"]: r for r in rows} for d, rows in ranked.items() if d != OUR_DOMAIN and not NOT_PEERS.search(d)}
    pages = local_pages()
    grupos: dict[tuple, dict] = {}
    for r in sorted((r for r in kws.values() if BRAND_RE.search(r["keyword"])), key=lambda r: -r["volume"]):
        g = grupos.setdefault(canon(r["keyword"]), r)
        g["variantes"] = g.get("variantes", 0) + (g is not r)
    cluster = list(grupos.values())
    for r in cluster:
        r["intent"] = intent_of(r["keyword"])
        r["pos"], r["url"] = our_position(r["keyword"], ours, serps)
        r["peers"] = {d: m[r["keyword"]]["pos"] for d, m in peers.items() if r["keyword"] in m}
        page, sc = best_page(r["keyword"], pages)
        r["page"], r["match"] = (page["slug"] if page else None), round(sc, 2)
        pos = r["pos"] or 99
        r["gain"] = r["volume"] * (ctr(3) - ctr(pos)) if pos > 3 else 0
        r["score"] = r["gain"] * max(r["cpc"], .2) / (1 + (r["kd"] or 30) / 60)

    L: list[str] = []
    hoy = date.today().isoformat()
    vol_total = sum(r["volume"] for r in cluster)
    L += [f"# Informe SEO DataForSEO: Heymondo / Mondo / IATI (España) — {hoy}", "",
          f"_{len(cluster)} búsquedas distintas (agrupadas variantes de orden/plural: Google las trata como una) con volumen mensual exacto en España; "
          f"suma {vol_total:,} búsquedas/mes. ".replace(",", ".") +
          f"SERP analizadas: {len(serps)}. Competidores: {', '.join(peers) or 'n/d'}._", ""]

    L += ["## 1. Demanda por intención y cuánto capturamos", "",
          "| Intención | Keywords | Búsquedas/mes | Posición media nuestra* | Sin rankear |", "|---|---:|---:|---:|---:|"]
    por: dict[str, list[dict]] = defaultdict(list)
    for r in cluster:
        por[r["intent"]].append(r)
    for it, rows in sorted(por.items(), key=lambda x: -sum(r["volume"] for r in x[1])):
        con = [r["pos"] for r in rows if r["pos"] and r["volume"] >= 20]
        med = f"{sum(con) / len(con):.1f}" if con else "—"
        sin = sum(1 for r in rows if not r["pos"] and r["volume"] >= 20)
        L.append(f"| {it} | {len(rows)} | {sum(r['volume'] for r in rows):,} | {med} | {sin} |".replace(",", "."))
    L += ["", "_*Solo keywords con ≥20 búsquedas/mes en las que ya aparecemos en el top 20._", ""]

    L += ["## 2. Victorias rápidas (ya rankeamos entre 4 y 20)", "",
          "Orden = clics potenciales al subir al top 3 × valor comercial (CPC) ÷ dificultad. Aquí está el dinero más barato.", "",
          "| Keyword | Vol. | Pos. | CPC € | KD | URL que rankea | Acción |", "|---|---:|---:|---:|---:|---|---|"]
    qw = [r for r in cluster if r["pos"] and 3 < r["pos"] <= 20 and r["volume"] >= 30]
    for r in sorted(qw, key=lambda r: -r["score"])[: a.rows]:
        u = (r["url"] or "").replace("https://", "").replace(OUR_DOMAIN, "")
        slug = u.strip("/")
        mal = r["page"] and r["match"] >= .6 and slug != r["page"]
        acc = (f"**Google elige otra página**: debería ser `/{r['page']}`; enlázala con ese anchor y pon la frase en título/H2"
               if mal else "Título/H2/FAQ con la frase exacta; enlaces internos con ese anchor")
        L.append(f"| {r['keyword']} (+{r.get('variantes', 0)}) | {r['volume']} | {r['pos']} | {r['cpc']:.2f} | {r['kd'] or '—'} | `{u}` | {acc} |")
    if not qw:
        L.append("| _(sin datos: ejecuta ranked)_ | | | | | | |")

    L += ["", "## 3. Huecos: demanda donde no estamos en el top 20", "",
          "`Acción`: **reforzar** si ya hay un post que encaja (≥60 % de coincidencia de términos), **crear** si no.", "",
          "| Keyword | Vol. | CPC € | KD | Intención | Competidores (pos.) | Acción |", "|---|---:|---:|---:|---|---|---|"]
    gaps = [r for r in cluster if (not r["pos"] or r["pos"] > 20) and r["volume"] >= 30 and r["intent"] != NAV]
    for r in sorted(gaps, key=lambda r: -r["score"])[: a.rows]:
        pe = ", ".join(f"{d.split('.')[0]} {p}" for d, p in r["peers"].items() if p and p <= 20) or "nadie del grupo"
        act = f"**reforzar** `/{r['page']}`" if r["match"] >= .6 else f"**crear** (mejor encaje: `/{r['page']}` {int(r['match'] * 100)} %)" if r["page"] else "**crear**"
        L.append(f"| {r['keyword']} (+{r.get('variantes', 0)}) | {r['volume']} | {r['cpc']:.2f} | {r['kd'] or '—'} | {r['intent']} | {pe} | {act} |")

    L += ["", "## 4. Canibalización (varias URLs nuestras en la misma SERP)", ""]
    can = []
    for kw, s in serps.items():
        urls = sorted({(o["url"], o["pos"]) for o in s["organic"] if OUR_DOMAIN in (o["domain"] or "")}, key=lambda x: x[1])
        if len(urls) > 1:
            can.append((kws.get(kw, {}).get("volume", 0), kw, urls))
    for v, kw, urls in sorted(can, reverse=True):
        L.append(f"- **{kw}** ({v}/mes): " + " · ".join(f"`{u.replace('https://' + OUR_DOMAIN, '')}` pos. {p}" for u, p in urls)
                 + " → elige una URL principal y enlaza las demás hacia ella.")
    if not can:
        L.append("_Ninguna detectada en las SERP analizadas._")

    L += ["", "## 5. Preguntas reales de Google (para FAQ y H2)", "",
          "Aparecen en «La gente también pregunta» de varias SERP de marca. Úsalas literales en `faqs:` del frontmatter (FAQPage).", ""]
    paa = Counter(q for s in serps.values() for q in s["paa"])
    for q, n in paa.most_common(a.rows):
        L.append(f"- {q} _(en {n} SERP)_")
    if not paa:
        L.append("_Sin datos: ejecuta serp._")

    L += ["", "## 6. Qué hay en las SERP (formato que Google premia)", ""]
    ft: Counter[str] = Counter(f for s in serps.values() for f in s["features"])
    L.append("| Elemento | SERP donde aparece |\n|---|---:|")
    for f, n in ft.most_common():
        L.append(f"| {f} | {n} de {len(serps)} |")
    L.append("")
    L.append("Dominios que más ocupan el top 10 en estas SERP (excluidas las marcas):")
    dom = Counter((o["domain"] or "").removeprefix("www.") for s in serps.values() for o in s["organic"] if (o["pos"] or 99) <= 10)
    L += [f"- {d}: {n}" for d, n in dom.most_common(12) if not NOT_PEERS.search(d)]

    L += ["", "## 7. Estacionalidad (cuándo publicar/actualizar)", "",
          "| Keyword | Vol. medio | Mes pico | Mes valle |", "|---|---:|---|---|"]
    for r in sorted(cluster, key=lambda r: -r["volume"])[:15]:
        m = [x for x in r["monthly"] if x[0]]
        if len(m) >= 6:
            pk, vl = max(m, key=lambda x: x[2]), min(m, key=lambda x: x[2])
            L.append(f"| {r['keyword']} | {r['volume']} | {pk[1]:02d}/{pk[0]} ({pk[2]}) | {vl[1]:02d}/{vl[0]} ({vl[2]}) |")

    REPORTS.mkdir(parents=True, exist_ok=True)
    md = REPORTS / f"informe-{hoy}.md"
    md.write_text("\n".join(L) + "\n", encoding="utf-8")
    with open(REPORTS / f"keywords-{hoy}.csv", "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f, delimiter=";")
        w.writerow(["keyword", "volumen", "cpc", "kd", "intencion", "nuestra_pos", "nuestra_url", "post_encaje", "encaje", "score"])
        for r in sorted(cluster, key=lambda r: -r["volume"]):
            w.writerow([r["keyword"], r["volume"], r["cpc"], r["kd"], r["intent"], r["pos"], r["url"], r["page"], r["match"], round(r["score"], 2)])
    print(f"[report] {md}")


def cmd_brief(c: Client, a) -> None:
    d = c.post("serp/google/organic/live/advanced", {
        "keyword": a.keyword, "location_code": LOCATION, "language_code": LANGUAGE, "device": "desktop", "depth": 10})
    orgs = [i for i in Client.result(d).get("items") or [] if i.get("type") == "organic"]
    peers = [o for o in orgs if not NOT_PEERS.search(o.get("domain") or "")][:5]
    L = [f"# Ficha de contenido: «{a.keyword}»", ""]
    kw = (load("keywords.json") or {}).get(a.keyword)
    if kw:
        L.append(f"Volumen {kw['volume']}/mes · CPC {kw['cpc']:.2f} € · KD {kw['kd']} · intención {intent_of(a.keyword)}\n")
    page, sc = best_page(a.keyword, local_pages())
    L.append(f"Mejor post nuestro: `/{page['slug']}` ({int(sc * 100)} % de encaje)\n" if page else "No hay post nuestro que encaje.\n")
    for o in peers:
        p = c.post("on_page/content_parsing/live", {"url": o["url"], "markdown_view": False})
        items = (Client.result(p).get("items") or [{}])[0] or {}
        pc = items.get("page_content") or {}
        h2, palabras = [], 0
        for t in pc.get("main_topic") or []:
            if t.get("h_title"):
                h2.append(("  " * max((t.get("level") or 2) - 2, 0)) + t["h_title"])
            palabras += sum(len((x.get("text") or "").split()) for x in t.get("primary_content") or [])
        L += [f"## {o['domain']} — pos. {o['rank_group']} — ≈{palabras} palabras", f"{o['title']}", f"<{o['url']}>", ""]
        L += [f"- {h}" for h in h2[:40]] or ["- (no se pudo extraer la estructura)"]
        L.append("")
    L += ["## Cómo ganarles", "",
          "1. Cubre todos los H2 que repiten ≥3 competidores (suelo, no ventaja).",
          "2. Añade lo que ninguno tiene: simulaciones reales con precio, capturas, fecha de actualización y experiencia propia.",
          "3. Responde en `faqs:` las preguntas de «La gente también pregunta» (informe sección 5).",
          "4. Enlaza desde el pilar y 2 posts laterales con anchors distintos; sin barra final.", ""]
    REPORTS.mkdir(parents=True, exist_ok=True)
    f = REPORTS / f"ficha-{re.sub(r'[^a-z0-9]+', '-', norm(a.keyword)).strip('-')}.md"
    f.write_text("\n".join(L), encoding="utf-8")
    print(f"[brief] {f} | gastado {c.spent:.3f} USD")


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("cmd", choices=["keywords", "serp", "ranked", "report", "brief", "all"])
    ap.add_argument("keyword", nargs="?", help="solo para brief")
    ap.add_argument("--max-cost", type=float, default=3.0, help="tope de gasto en USD (def. 3)")
    ap.add_argument("--limit", type=int, default=None, help="filas por consulta (keywords: 700, ranked: 1000)")
    ap.add_argument("--top", type=int, default=60, help="serp: nº de keywords a fotografiar")
    ap.add_argument("--min-volume", type=int, default=20)
    ap.add_argument("--peers", help="dominios competidores separados por comas (si no, se descubren en la SERP)")
    ap.add_argument("--n-peers", type=int, default=5)
    ap.add_argument("--rows", type=int, default=40, help="filas por tabla del informe")
    a = ap.parse_args()
    if a.cmd == "brief" and not a.keyword:
        ap.error("brief necesita una keyword")
    load_env()
    c = None if a.cmd == "report" else Client(a.max_cost)
    steps = {"keywords": cmd_keywords, "serp": cmd_serp, "ranked": cmd_ranked, "report": cmd_report, "brief": cmd_brief}
    pedido = a.limit
    for name in (["keywords", "serp", "ranked", "report"] if a.cmd == "all" else [a.cmd]):
        a.limit = pedido or (700 if name == "keywords" else 1000)
        steps[name](c, a)
    if c:
        print(f"Coste de esta ejecución: {c.spent:.3f} USD ({c.calls} llamadas, {c.hits} desde caché)")


if __name__ == "__main__":
    main()
