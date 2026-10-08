#!/usr/bin/env python3
"""Recoge precios y datos públicos de las fichas de destino de eSIMFLAG (www.esimflag.com/es/configurador/*) y sus páginas de blog.

- Usa el sitemap público (sitemaps/sitemap-es.xml) y respeta su robots.txt (no toca carrito, checkout ni área privada).
- Una petición cada 1,5 s y con caché en disco.
- Guarda el HTML comprimido y un JSON/CSV resumen en esimflag.com/prices/ (carpeta ignorada por git).

Uso:  python scripts/esimflag-scrape.py [--limit N] [--reparse]
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

BASE = "https://www.esimflag.com"
SITEMAP = f"{BASE}/sitemaps/sitemap-es.xml"
OUT = Path("esimflag.com/prices")
UA = "Mozilla/5.0 (compatible; MSB-price-research/1.0; +https://mochileandosinbarreras.com)"
DELAY = 1.5


def get(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "es"})
    with urllib.request.urlopen(req, timeout=40) as r:
        return r.read().decode("utf-8", errors="ignore")


def texto(h: str) -> str:
    t = re.sub(r"<script.*?</script>|<style.*?</style>|<svg.*?</svg>", "", h, flags=re.S)
    t = re.sub(r"<[^>]+>", " | ", t)
    t = re.sub(r"(\s*\|\s*)+", " | ", t)
    return html.unescape(re.sub(r"\s+", " ", t))


def num(s: str) -> float:
    return float(s.replace(".", "").replace(",", ".")) if "," in s else float(s)


def parsear(url: str, h: str) -> dict:
    t = texto(h)
    slug = url.rstrip("/").rsplit("/", 1)[-1]
    title = html.unescape((re.findall(r"<title>(.*?)</title>", h, re.S) or [""])[0]).strip()
    filas = []
    for dias_html, precio in re.findall(r'c-price-table__table--days">(.*?)</td><td class="c-price-table__table--price">([\d.,]+)\s*€', h, re.S):
        d = re.sub(r"<svg.*?</svg>|<[^>]+>", " ", dias_html, flags=re.S)
        m = re.search(r"(\d+)\s*d", html.unescape(d))
        if m:
            filas.append({"dias": int(m.group(1)), "eur": num(precio)})
    red = None
    m = re.search(r"Red: ([^|]+?) \|", t)
    if m:
        red = m.group(1).strip()
    rating = None
    m = re.search(r'"ratingValue"\s*:\s*"?([\d.,]+)', h)
    if m:
        rating = m.group(1)
    return {
        "slug": slug,
        "url": url,
        "titulo": title,
        "red": red,
        "tabla_precios": filas,
        "ilimitado": "Conexión ilimitada" in t,
        "compartir_datos": "Compartir datos incluido" in t,
        "llamadas_sms": "No incluidas" in t,
        "rating": rating,
    }


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--reparse", action="store_true")
    a = ap.parse_args()
    (OUT / "html").mkdir(parents=True, exist_ok=True)
    if a.reparse:
        urls = [json.loads(x)["url"] for x in (OUT / "urls.jsonl").read_text(encoding="utf-8").splitlines()]
    else:
        sm = get(SITEMAP)
        urls = list(dict.fromkeys(re.findall(r"<loc>([^<]+)</loc>", sm)))
        urls = [u for u in urls if "/es/configurador/" in u or "/es/blog/" in u or "/es/landing/" in u]
        (OUT / "urls.jsonl").write_text("\n".join(json.dumps({"url": u}) for u in urls), encoding="utf-8")
    if a.limit:
        urls = urls[: a.limit]
    print(f"{len(urls)} páginas", flush=True)
    filas = []
    for i, u in enumerate(urls, 1):
        key = re.sub(r"[^a-z0-9]+", "-", u.replace(BASE, "").lower()).strip("-")
        f = OUT / "html" / f"{key}.html.gz"
        if f.exists():
            h = gzip.decompress(f.read_bytes()).decode("utf-8", errors="ignore")
        elif a.reparse:
            continue
        else:
            try:
                h = get(u)
            except Exception as e:
                print(f"  ! {u}: {e}", file=sys.stderr, flush=True)
                time.sleep(DELAY)
                continue
            f.write_bytes(gzip.compress(h.encode("utf-8")))
            time.sleep(DELAY)
        if "/configurador/" in u:
            filas.append(parsear(u, h))
        if i % 25 == 0:
            print(f"  {i}/{len(urls)}", flush=True)
    (OUT / "destinos.json").write_text(json.dumps(filas, ensure_ascii=False, indent=1), encoding="utf-8")
    with (OUT / "destinos.csv").open("w", encoding="utf-8-sig", newline="") as fh:
        w = csv.writer(fh)
        w.writerow(["slug", "titulo", "red", "dias_precio", "ilimitado", "compartir_datos", "url"])
        for r in filas:
            w.writerow([r["slug"], r["titulo"], r["red"] or "", "; ".join(f"{x['dias']}d={x['eur']}" for x in r["tabla_precios"]), r["ilimitado"], r["compartir_datos"], r["url"]])
    print(f"listo: {len(filas)} destinos en {OUT}", flush=True)


if __name__ == "__main__":
    main()
