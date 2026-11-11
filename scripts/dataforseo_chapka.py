#!/usr/bin/env python3
"""Inteligencia SEO con DataForSEO para el clúster Chapka (Google España).

Reutiliza el cliente de scripts/dataforseo_seo.py (caché en disco + tope de coste).
Pasos (reanudables; salida en seo/dataforseo/chapka/):
  keywords  Expande semillas de marca, productos Cap* y temas adyacentes (working holiday, trotamundos...).
  serp      SERP real de las keywords con más valor: quién rankea, PAA, URLs nuestras (canibalización).
  report    Agrupa por intención y escribe docs/seo-dataforseo/chapka-keywords.csv

Uso: python scripts/dataforseo_chapka.py keywords [--max-cost 2]
     python scripts/dataforseo_chapka.py serp --top 40
     python scripts/dataforseo_chapka.py report
"""
from __future__ import annotations

import argparse
import csv
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import dataforseo_seo as base  # noqa: E402
from dataforseo_seo import Client, rec_from, norm  # noqa: E402

OUT = base.ROOT / "seo" / "dataforseo" / "chapka"
REP = base.ROOT / "docs" / "seo-dataforseo"
OUT.mkdir(parents=True, exist_ok=True)

BRAND_SEEDS = ["chapka", "chapka seguros", "chapka direct", "chapkadirect", "seguro chapka", "seguros chapka"]
PRODUCTS = ["cap trip", "cap trotamundos", "cap cancelacion", "cap working holiday", "cap student",
            "cap schengen", "cap europa", "cap voluntariado", "cap tempo expat", "cap multi trip",
            "cap aventura", "cap trip plus"]
MODS = ["opiniones", "es fiable", "descuento", "codigo descuento", "precio", "telefono", "reclamar",
        "cancelacion", "preexistentes", "larga estancia", "working holiday", "estudiantes", "mochilero"]
# Temas adyacentes (sin marca) donde Chapka es una respuesta natural.
ADJ = ["seguro working holiday", "seguro vuelta al mundo", "seguro trotamundos", "seguro viaje larga estancia",
       "seguro de viaje enfermedad preexistente", "seguro estudiantes extranjero", "seguro voluntariado",
       "seguro de viaje schengen", "seguro viaje multiviaje anual", "seguro cancelacion viaje cualquier causa",
       "seguro expatriados", "seguro viaje sabatico", "seguro año sabatico", "seguro nomada digital"]

BRAND_RE = re.compile(r"chapka|\bcap (trip|trotamundos|cancelaci|working|student|schengen|europa|voluntari|tempo|multi|aventura)", re.I)
INTENTS = [
    ("descuento / cupón", r"descuent|cupon|codigo|promo|oferta|black friday"),
    ("opiniones / fiabilidad", r"opinion|fiable|estafa|resena|valoracion|trustpilot|merece"),
    ("comparativa", r" vs | versus |compar|diferencia| o (iati|heymondo|intermundial|mondo)"),
    ("contacto / siniestros", r"telefono|contacto|whatsapp|reclam|siniestro|parte|devoluc|atencion|email|area cliente"),
    ("precio", r"precio|cuanto cuesta|tarifa|barato|cotiz|presupuesto"),
    ("producto: working holiday / estudiante / expat", r"working|student|estudi|expat|voluntari|trotamundos|aventura|larga|sabatic|nomada"),
    ("producto: cancelación", r"cancelaci|anulaci"),
    ("producto: coberturas", r"cobertura|cubre|incluye|preexist|deporte|multi|anual|schengen|europa"),
]


def intent(kw: str) -> str:
    k = " " + norm(kw) + " "
    if re.sub(r"[^a-z ]", "", k).strip() in {"chapka", "chapka seguros", "chapka direct", "seguro chapka", "seguros chapka", "chapkadirect"}:
        return "navegacional (solo marca)"
    for name, rx in INTENTS:
        if re.search(rx, k):
            return name
    return "otras"


def save(name, obj):
    (OUT / name).write_text(json.dumps(obj, ensure_ascii=False, indent=1), encoding="utf-8")


def load(name, default=None):
    f = OUT / name
    return json.loads(f.read_text(encoding="utf-8")) if f.exists() else default


def cmd_keywords(c: Client, a):
    seeds = BRAND_SEEDS + PRODUCTS + [f"chapka {m}" for m in MODS] + ADJ
    kws = load("keywords.json", {})
    for i, seed in enumerate(seeds, 1):
        d = c.post("dataforseo_labs/google/keyword_suggestions/live", {
            "keyword": seed, "location_code": base.LOCATION, "language_code": base.LANGUAGE,
            "limit": a.limit, "include_seed_keyword": True, "include_serp_info": False})
        adj = seed in ADJ
        for it in Client.result(d).get("items") or []:
            r = rec_from(it)
            if not r["keyword"]:
                continue
            r["adjacent"] = not BRAND_RE.search(r["keyword"])
            if BRAND_RE.search(r["keyword"]) or (adj and re.search(r"seguro", r["keyword"])):
                r["seed"] = seed
                kws.setdefault(r["keyword"], r)
        print(f"[keywords] {i}/{len(seeds)} «{seed}» -> {len(kws)} | {c.spent:.3f} USD")
    save("keywords.json", kws)


def cmd_serp(c: Client, a):
    kws = load("keywords.json") or sys.exit("Ejecuta antes: keywords")
    cand = [r for r in kws.values() if r["volume"] >= a.min_volume]
    cand.sort(key=lambda r: r["volume"] * max(r["cpc"], .2), reverse=True)
    serps = load("serp.json", {})
    for i, r in enumerate(cand[: a.top], 1):
        d = c.post("serp/google/organic/live/advanced", {
            "keyword": r["keyword"], "location_code": base.LOCATION, "language_code": base.LANGUAGE,
            "device": "desktop", "depth": 20})
        res, org, paa, feats = Client.result(d), [], [], set()
        for it in res.get("items") or []:
            t = it.get("type"); feats.add(t)
            if t == "organic":
                org.append({"pos": it.get("rank_group"), "domain": it.get("domain"), "url": it.get("url"), "title": it.get("title")})
            elif t == "people_also_ask":
                paa += [q.get("title") for q in it.get("items") or [] if q.get("title")]
        serps[r["keyword"]] = {"organic": org, "paa": paa, "features": sorted(f for f in feats if f)}
        print(f"[serp] {i}/{min(a.top, len(cand))} «{r['keyword']}» | {c.spent:.3f} USD")
    save("serp.json", serps)


def cmd_report(c, a):
    kws = load("keywords.json") or sys.exit("Ejecuta antes: keywords")
    serps = load("serp.json", {})
    rows = []
    for r in kws.values():
        s = serps.get(r["keyword"], {})
        ours = [o for o in s.get("organic", []) if base.OUR_DOMAIN in (o["domain"] or "")]
        rows.append({"keyword": r["keyword"], "volumen": r["volume"], "cpc": round(r["cpc"], 2), "kd": r["kd"],
                     "intencion": intent(r["keyword"]), "adyacente": r["adjacent"],
                     "nuestra_pos": ours[0]["pos"] if ours else "", "nuestra_url": ours[0]["url"] if ours else "",
                     "n_nuestras_urls": len(ours)})
    rows.sort(key=lambda x: -x["volumen"])
    f = REP / "chapka-keywords.csv"
    with f.open("w", newline="", encoding="utf-8-sig") as fh:
        w = csv.DictWriter(fh, fieldnames=list(rows[0]))
        w.writeheader(); w.writerows(rows)
    print(f"{len(rows)} keywords -> {f}")


def main():
    base.load_env()
    ap = argparse.ArgumentParser()
    ap.add_argument("cmd", choices=["keywords", "serp", "report"])
    ap.add_argument("--max-cost", type=float, default=2.0)
    ap.add_argument("--limit", type=int, default=300)
    ap.add_argument("--top", type=int, default=40)
    ap.add_argument("--min-volume", type=int, default=20)
    a = ap.parse_args()
    c = Client(a.max_cost) if a.cmd != "report" else None
    {"keywords": cmd_keywords, "serp": cmd_serp, "report": cmd_report}[a.cmd](c, a)
    if c:
        print(f"Coste: {c.spent:.3f} USD en {c.calls} llamadas ({c.hits} desde caché)")


if __name__ == "__main__":
    main()
