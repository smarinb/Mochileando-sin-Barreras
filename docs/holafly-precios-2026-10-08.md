# Precios y datos de destino de Holafly (8 de octubre de 2026)

Extraídos de las fichas públicas `esim.holafly.com/es/esim-*` con `scripts/holafly-scrape.py` (una petición cada 1,5 s, respetando su robots.txt). Los datos en bruto están en `esim.holafly.com/prices/` (carpeta ignorada por git): `destinos.json`, `destinos.csv` y el HTML comprimido de cada ficha.

- **415 fichas de producto**: países, ciudades, regiones y cruceros. Es el origen de la cifra «415» que circulaba en nuestros contenidos; **Holafly publica «más de 200 destinos»**.
- 402 fichas con tabla de precios (3, 5, 7, 10, 15 y 30 días) y 13 sin tabla. Precio de 1 día en `precio_desde_eur`.
- 392 fichas con operador de red; 411 con datos ilimitados; todas con «Always On» y la mayoría con telemedicina y «1 GB al día para compartir».

## Escalones de precio más frecuentes (EUR, datos ilimitados)

| 1 día | 3 días | 7 días | 15 días | 30 días | Fichas | Ejemplos |
| ---: | ---: | ---: | ---: | ---: | ---: | :--- |
| 3,90 | 11,42 | 25,50 | 47,90 | 70,90 | 88 | asia, australia, brisbane, melbourne-ciudad, perth |
| 3,79 | 11,37 | 25,50 | 46,90 | 68,90 | 80 | belgica, bruselas, bosnia-y-herzegovina, chipre, larnaca |
| 5,90 | 12,50 | 25,90 | 46,90 | 68,90 | 22 | islas-aland, andorra, camboya, guam, hong-kong |
| 8,90 | 19,50 | 37,90 | 60,50 | 108,50 | 21 | benin, bolivia, botsuana, republica-centroafricana, suazilandia |
| 8,90 | 18,90 | 36,90 | 58,90 | 103,90 | 20 | argelia, armenia, erevan, azerbaiyan, baku |
| 10,90 | 19,50 | 34,50 | 64,50 | 107,90 | 14 | antigua-y-barbuda, bahamas, barbados, bermudas, islas-virgenes-britanicas |
| 6,90 | 18,90 | 33,90 | 46,90 | 90,50 | 13 | canada, alberta, columbia-britanica, montreal, ottawa |
| 3,90 | 11,42 | 22,90 | 42,50 | 61,90 | 13 | espana, alicante, islas-baleares-ciudad, barcelona-ciudad, benidorm |
| 5,90 | 12,50 | 26,50 | 47,90 | 90,90 | 11 | brasil, boa-vista, florianopolis, rio-de-janeiro, sao-paulo |
| 5,90 | 11,90 | 25,50 | 46,90 | 68,90 | 11 | israel, jerusalen, kazajistan, almaty, rusia |
| 4,90 | 10,90 | 22,90 | 41,90 | 61,90 | 9 | mexico, cancun-ciudad, guadalajara, ciudad-de-mexico, monterrey |
| 3,79 | 11,37 | 22,50 | 41,50 | 59,90 | 7 | italia, bari, cagliari, milan-ciudad, roma-ciudad |

## Cómo usar estos datos
- Citar siempre la fecha («octubre de 2026») y recordar que Holafly cambia precios y ofertas: **confirmar en el carrito**.
- No hay precios de Holafly Plans ni de AirHelp en las fichas (se cargan al contratar).
- Para volver a descargar: `python scripts/holafly-scrape.py` (usa la caché) o borrar `esim.holafly.com/prices/html/` para refrescar.
