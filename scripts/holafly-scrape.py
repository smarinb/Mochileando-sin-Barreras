#!/usr/bin/env python3
"""Recoge los precios y datos públicos de las fichas de destino de Holafly (esim.holafly.com/es/esim-*).

- Usa el sitemap público (product-sitemap.xml) y respeta el robots.txt del sitio (solo páginas públicas, sin parámetros).
- Una petición cada 1,5 s y con caché en disco: no vuelve a descargar lo que ya tiene.
- Guarda el HTML comprimido y un JSON/CSV resumen en esim.holafly.com/prices/ (carpeta ignorada por git).

Uso:  python scripts/holafly-scrape.py [--limit N] [--reparse]
"""
from __future__ import annotations

import argparse
import csv
import gzip
import html
import json
import re
import sys
import time
import urllib.request
from pathlib import Path

BASE = "https://esim.holafly.com"
SITEMAP = f"{BASE}/es/product-sitemap.xml"
OUT = Path("esim.holafly.com/prices")
UA = "Mozilla/5.0 (compatible; MSB-price-research/1.0; +https://mochileandosinbarreras.com)"
DELAY = 1.5


def get(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "es"})
    with urllib.request.urlopen(req, timeout=40) as r:
        return r.read().decode("utf-8", errors="ignore")


def texto(h: str) -> str:
    t = re.sub(r"<script.*?</script>|<style.*?</style>", "", h, flags=re.S)
    t = re.sub(r"<[^>]+>", " | ", t)
    t = re.sub(r"(\s*\|\s*)+", " | ", t)
    return html.unescape(re.sub(r"\s+", " ", t))


def euros(s: str) -> float | None:
    m = re.search(r"(\d+(?:[.,]\d+)?)", s)
    return float(m.group(1).replace(",", ".")) if m else None


def parsear(url: str, h: str) -> dict:
    t = texto(h)
    slug = url.rstrip("/").rsplit("/", 1)[-1]
    title = (re.findall(r"<title>(.*?)</title>", h, re.S) or [""])[0].strip()
    h1 = html.unescape((re.findall(r"<h1[^>]*>(.*?)</h1>", h, re.S) or [""])[0])
    h1 = re.sub(r"<[^>]+>", "", h1).strip()
    # Tabla de precios: «N días | 10,90 € | EUR»
    tabla = [(int(d), euros(p)) for d, p in re.findall(r"(\d+) días? \| ([\d.,]+) € \| EUR", t)]
    desde = None
    m = re.search(r'data-qa="productPriceLabel">\s*([\d.,]+)\s*€', h)
    if m:
        desde = euros(m.group(1))
    redes = None
    m = re.search(r"Redes: \| (.+?) \|", t)
    if m:
        redes = m.group(1).strip()
    sin_cobertura = None
    m = re.search(r"((?:Nuestra|La) eSIM [^|]{0,80}no ofrece cobertura[^|]{0,260})", t)
    if m:
        sin_cobertura = m.group(1).strip()
    hotspot = None
    m = re.search(r"Comparte tus datos con familiares y amigos \| ([^|]{0,260})", t)
    if m:
        hotspot = m.group(1).strip()
    return {
        "slug": slug,
        "url": url,
        "titulo": title,
        "h1": h1,
        "precio_desde_eur": desde,
        "tabla_precios": [{"dias": d, "eur": p} for d, p in tabla],
        "redes": redes,
        "sin_cobertura": sin_cobertura,
        "hotspot": hotspot,
        "ilimitado": "Datos ilimitados" in t,
        "always_on": "Always On" in t,
        "telemedicina": "Telemedicina" in t,
        "g5": "5G" in t,
        "es_crucero": "crucero" in slug,
    }


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--reparse", action="store_true", help="no descarga: solo reprocesa el HTML guardado")
    a = ap.parse_args()
    (OUT / "html").mkdir(parents=True, exist_ok=True)

    if a.reparse:
        urls = [json.loads(line)["url"] for line in (OUT / "urls.jsonl").read_text(encoding="utf-8").splitlines()]
    else:
        sm = get(SITEMAP)
        urls = [u for u in re.findall(r"<loc>([^<]+)</loc>", sm) if "/es/esim-" in u]
        (OUT / "urls.jsonl").write_text("\n".join(json.dumps({"url": u}) for u in urls), encoding="utf-8")
    if a.limit:
        urls = urls[: a.limit]
    print(f"{len(urls)} fichas", flush=True)

    filas = []
    for i, u in enumerate(urls, 1):
        slug = u.rstrip("/").rsplit("/", 1)[-1]
        f = OUT / "html" / f"{slug}.html.gz"
        if f.exists():
            h = gzip.decompress(f.read_bytes()).decode("utf-8", errors="ignore")
        elif a.reparse:
            continue
        else:
            try:
                h = get(u)
            except Exception as e:  # sigue con el resto
                print(f"  ! {slug}: {e}", file=sys.stderr, flush=True)
                time.sleep(DELAY)
                continue
            f.write_bytes(gzip.compress(h.encode("utf-8")))
            time.sleep(DELAY)
        filas.append(parsear(u, h))
        if i % 25 == 0:
            print(f"  {i}/{len(urls)}", flush=True)

    (OUT / "destinos.json").write_text(json.dumps(filas, ensure_ascii=False, indent=1), encoding="utf-8")
    with (OUT / "destinos.csv").open("w", encoding="utf-8-sig", newline="") as fh:
        w = csv.writer(fh)
        w.writerow(["slug", "titulo", "desde_eur", "3d", "5d", "7d", "10d", "15d", "20d", "30d", "ilimitado", "redes", "url"])
        for r in filas:
            p = {x["dias"]: x["eur"] for x in r["tabla_precios"]}
            w.writerow([r["slug"], r["titulo"], r["precio_desde_eur"], *[p.get(d, "") for d in (3, 5, 7, 10, 15, 20, 30)], r["ilimitado"], r["redes"] or "", r["url"]])
    print(f"listo: {len(filas)} destinos en {OUT}", flush=True)


if __name__ == "__main__":
    main()
