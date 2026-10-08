# -*- coding: utf-8 -*-
"""Genera los posts nuevos de eSIMFLAG/Holafly (octubre de 2026) a partir de los datos rascados de las fichas oficiales.

Uso (desde la raíz del repo): python scripts/esimflag_posts.py
Requiere esim.holafly.com/prices/destinos.json y esimflag.com/prices/destinos.json (ver scripts/*-scrape.py).
"""
import json

HOLAFLY_URL = "https://holafly.sjv.io/oN4rme"
FLAG_URL = (
    "https://clk.tradedoubler.com/click?p=383157&a=3480944&url=http%3A%2F%2Fwww.esimflag.com%2Fpartners%2Ftd%3Fdiscount%3DMOCHILEANDOSINBARRERAS"
    "%26utm_source%3Dmochileandosinbarreras%26utm_medium%3Daffiliatte%26utm_content%3Dtradedoubler_es"
)
HOY = "2026-10-08T21:00:00Z"
FECHA = "octubre de 2026"

H = {r["slug"].replace("esim-", ""): r for r in json.load(open("esim.holafly.com/prices/destinos.json", encoding="utf-8"))}
E = {r["slug"].replace("esim-", ""): r for r in json.load(open("esimflag.com/prices/destinos.json", encoding="utf-8"))}


def eur(x):
    return ("%.2f" % x).replace(".", ",") + " €"


def tabla(r):
    return {x["dias"]: x["eur"] for x in r["tabla_precios"]}


def hp(slug, dias):
    return tabla(H[slug])[dias]


def ep(slug, dias):
    return tabla(E[slug])[dias]


def red_e(slug):
    r = E[slug]["red"]
    return r if r else "No indicada"


def red_h(slug):
    r = H[slug]["redes"]
    return r if r else "No indicada"


def faq_fm(faqs):
    out = ""
    for q, a in faqs:
        out += f'  - q: "{q}"\n    a: "{a.replace(chr(34), chr(92) + chr(34))}"\n'
    return out.rstrip("\n")


def faq_body(faqs):
    return "".join(f"### {q}\n\n{a}\n\n" for q, a in faqs).rstrip("\n")


def post(slug, title, excerpt, alt, tags, faqs, cuerpo):
    fm = f"""---
publishDate: {HOY}
title: "{title}"
excerpt: "{excerpt}"
image: ~/assets/images/{slug}.webp
imageAlt: "{alt}"
category: eSIM para viajar
tags:
{chr(10).join('  - ' + t for t in tags)}
metadata:
  title: "{title}"
faqs:
{faq_fm(faqs)}
---

import BotonAfiliado from '~/components/mdx/BotonAfiliado.astro';
import CajaAviso from '~/components/mdx/CajaAviso.astro';
import Indice from '~/components/mdx/Indice.astro';

"""
    texto = fm + cuerpo.strip("\n") + "\n\n## Preguntas frecuentes\n\n" + faq_body(faqs) + "\n"
    open(f"src/data/post/{slug}.mdx", "w", encoding="utf-8", newline="").write(texto)
    print(slug, len(texto.split()), "palabras")


def boton_flag(texto="Ver mi descuento del 20 % en eSIMFLAG"):
    return f'<BotonAfiliado\n  href="{FLAG_URL}"\n  text="{texto}"\n>\n\nEnlace de afiliado de eSIMFLAG: el 20 % se aplica solo al entrar desde aquí y a nosotros nos pagan una comisión sin coste extra para ti.\n\n</BotonAfiliado>'


def boton_hola(texto="Ver planes de Holafly →"):
    return f'<BotonAfiliado\n  href="{HOLAFLY_URL}"\n  text="{texto}"\n>\n\nEnlace de afiliado de Holafly: pega el código **MOCHILEANDO** en el carrito para un 5 % de descuento. Nos pagan una comisión sin coste extra para ti.\n\n</BotonAfiliado>'


# =====================================================================================
# 1. eSIMFLAG vs Holafly
# =====================================================================================
DEST = [
    ("argentina", "argentina", "Argentina"), ("chile", "chile", "Chile"), ("peru", "peru", "Perú"), ("colombia", "colombia", "Colombia"),
    ("mexico", "mexico", "México"), ("brazil", "brasil", "Brasil"), ("united-states-of-america", "usa", "Estados Unidos"),
    ("europe", "europa", "Europa"), ("spain", "espana", "España"), ("turkey", "turquia", "Turquía"), ("thailand", "tailandia", "Tailandia"),
    ("japan", "japon", "Japón"), ("india", "india", "India"), ("kazakhstan", "kazajistan", "Kazajistán"), ("uzbekistan", "uzbekistan", "Uzbekistán"),
]
filas = []
gana_e7 = gana_h7 = gana_e15 = gana_h15 = 0
for se, sh, nombre in DEST:
    e7, h7 = ep(se, 7), hp(sh, 7)
    e15, h15 = ep(se, 15), hp(sh, 15)
    e7d, h7d = round(e7 * 0.8, 2), round(h7 * 0.95, 2)
    e15d, h15d = round(e15 * 0.8, 2), round(h15 * 0.95, 2)
    w7 = "eSIMFLAG" if e7d < h7d else ("Holafly" if h7d < e7d else "Empate")
    w15 = "eSIMFLAG" if e15d < h15d else ("Holafly" if h15d < e15d else "Empate")
    gana_e7 += w7 == "eSIMFLAG"
    gana_h7 += w7 == "Holafly"
    gana_e15 += w15 == "eSIMFLAG"
    gana_h15 += w15 == "Holafly"
    filas.append(f"| {nombre} | {eur(e7)} | {eur(h7)} | **{eur(e7d)}** | **{eur(h7d)}** | {w7} | {eur(e15d)} | {eur(h15d)} | {w15} |")
TAB_VS = (
    "| Destino | eSIMFLAG 7 d | Holafly 7 d | eSIMFLAG 7 d con 20 % | Holafly 7 d con 5 % | Más barata (7 d) | eSIMFLAG 15 d con 20 % | Holafly 15 d con 5 % | Más barata (15 d) |\n"
    "| :--- | ---: | ---: | ---: | ---: | :--- | ---: | ---: | :--- |\n" + "\n".join(filas)
)
n = len(DEST)

faqs = [
    ("¿Qué es mejor, eSIMFLAG o Holafly?", "Depende del destino y de los días. Con los precios de octubre de 2026 y nuestros descuentos (20 % en eSIMFLAG, 5 % con el código MOCHILEANDO en Holafly), eSIMFLAG sale más barata en casi todos los destinos a 7 y a 15 días; sin descuentos, Holafly es más barata a 15 días en muchos destinos fuera de Europa. En Argentina, Chile y Colombia las dos usan la red de Telefónica/Movistar, así que la cobertura es la misma."),
    ("¿Holafly o eSIMFLAG: cuál es más barata?", f"De los {n} destinos que comparamos, con descuentos eSIMFLAG es más barata en {gana_e7} a 7 días y Holafly en {gana_h7}; a 15 días, eSIMFLAG en {gana_e15} y Holafly en {gana_h15}. La tabla de esta guía muestra cada caso."),
    ("¿Usan la misma red eSIMFLAG y Holafly?", "A veces. En Argentina, Chile y Colombia ambas se conectan a la red de Telefónica/Movistar, de modo que donde esa red no llega, ninguna de las dos funcionará. En otros países cada una trabaja con operadores distintos (por ejemplo, en EE. UU. eSIMFLAG usa Verizon y Holafly, AT&T y T-Mobile)."),
    ("¿Cuál de las dos tiene mejor reembolso?", "eSIMFLAG anuncia una garantía de 30 días y compensación automática si el servicio se interrumpe más de 6 horas. Holafly permite pedir el reembolso en las eSIM por días hasta 6 meses después de la compra, total o parcial según el uso. Las dos lo tramitan en 5-10 días hábiles."),
    ("¿Se puede compartir datos con eSIMFLAG y con Holafly?", "Sí con las dos. eSIMFLAG indica «Compartir datos incluido» en sus fichas sin publicar un límite; Holafly publica 1 GB al día para compartir en las fichas de destino."),
    ("¿Qué extras tiene cada una?", "Holafly añade Always On (1 GB gratis al mes cuando el plan termina), telemedicina con Meeting Doctors en las eSIM por días compradas desde el 6 de octubre de 2026, AirHelp opcional y suscripción (Holafly Plans). eSIMFLAG destaca por su compensación automática por cortes y por el respaldo de Telefónica."),
]

cuerpo = f"""
**eSIMFLAG o Holafly** es la comparación que más nos piden entre las eSIM con datos ilimitados. Hemos comparado los **precios oficiales de las dos** (publicados en sus webs en {FECHA}), con nuestros descuentos, las redes que usan en cada país y lo que ofrece cada una si algo sale mal.

<CajaAviso tipo="info" titulo="La respuesta corta">

Con los descuentos de nuestros enlaces (20 % en eSIMFLAG, 5 % con el código MOCHILEANDO en Holafly), **eSIMFLAG sale más barata en {gana_e7} de {n} destinos a 7 días y en {gana_e15} a 15 días**, y destaca por su compensación por cortes y su garantía de 30 días. **Sin descuentos, Holafly es más barata a 15 días en casi todos los destinos fuera de Europa** y gana en extras (Always On, telemedicina, suscripción). **En Argentina, Chile y Colombia usan la misma red (Telefónica/Movistar)**: ahí cambia el precio, no la cobertura.

</CajaAviso>

{boton_flag()}

{boton_hola()}

<Indice />

## Comparativa de precios oficiales ({FECHA})

Precios de **lista** de cada web, con datos ilimitados, y precios **con descuento**: **20 % en eSIMFLAG** (se aplica solo desde nuestro enlace) y **5 % en Holafly** (código MOCHILEANDO en el carrito). La última columna indica cuál es más barata en cada destino.

{TAB_VS}

Lo que dice la tabla, en {n} destinos:

- **A 7 días, con descuentos, eSIMFLAG es más barata en {gana_e7} destinos y Holafly en {gana_h7}.**
- **A 15 días, eSIMFLAG gana en {gana_e15} y Holafly en {gana_h15}** (México, India y Uzbekistán). Los planes largos de Holafly bajan más de precio por día: **sin descuentos, Holafly sería más barata a 15 días en casi todos los destinos fuera de Europa**, y es el 20 % de eSIMFLAG el que le devuelve la ventaja.
- **En Europa y España eSIMFLAG es claramente más barata** (y su landing anuncia «desde 1,60 € al día» en 34 países con el plan más largo).
- **Las dos suben mucho en India, Uzbekistán o Japón**: ahí conviene mirar si compensa una SIM local.

Los precios cambian: confirma siempre el total en el carrito. Hemos recogido los datos de las fichas públicas de cada destino el 8 de octubre de 2026.

## Redes: ¿cambia la cobertura?

La cobertura no la pone la marca de la eSIM, la pone el operador local al que se conecta. Estas son las redes que cada web indica en su ficha:

| Destino | eSIMFLAG | Holafly |
| :--- | :--- | :--- |
""" + "\n".join(f"| {nombre} | {red_e(se)} | {red_h(sh)} |" for se, sh, nombre in DEST if se not in ("europe",)) + f"""

Dos conclusiones útiles para viajar por Sudamérica:

- **En Argentina, Chile y Colombia las dos se conectan a Telefónica/Movistar.** Si sabes que en un tramo de la Patagonia o de la Carretera Austral no hay señal de Movistar, **ni una ni otra te darán datos** (lo comprobamos nosotros en ruta). No es un fallo de la eSIM: es la red.
- **eSIMFLAG es «by Movistar», pero solo usa la red de Movistar en 7 de las más de 150 fichas de destino.** Lo explicamos en [eSIMFLAG Movistar](/esimflag-movistar).

## Qué te da cada una si algo sale mal

| | eSIMFLAG | Holafly |
| :--- | :--- | :--- |
| **Reembolso** | Garantía de 30 días: no activada, cambio de idea, móvil no compatible o problema técnico | Hasta 6 meses desde la compra (eSIM por días), total o parcial según el uso |
| **Plazo** | 5 a 10 días laborables | 5 a 10 días hábiles |
| **Cortes de servicio** | Compensación automática por interrupciones de más de 6 horas (condiciones generales) | Reembolso parcial o total si la red falla (política de reembolso) |
| **Compartir datos** | Incluido en todas las fichas | 1 GB al día para compartir |
| **Llamadas y SMS** | Solo datos | Solo datos en las eSIM por días; los Plans Unlimited incluyen número de EE. UU., Reino Unido o Canadá |
| **Extras** | Respaldo de Telefónica | Always On (1 GB gratis al mes al terminar), telemedicina (desde el 6 de octubre de 2026), AirHelp opcional |
| **Destinos** | Más de 170 | Más de 200 (más de 160 en Plans) |
| **Soporte** | 24/7 por WhatsApp y chat | 24/7 por chat, WhatsApp y correo |

## Cuál elegir según tu viaje

- **Viaje corto por Europa o España, o escapada de 7 días a casi cualquier destino:** **eSIMFLAG**, por precio y por su garantía.
- **Viaje de 15 días o más fuera de Europa:** con nuestros descuentos sigue ganando **eSIMFLAG** en casi todos los destinos; **Holafly** compensa en México, India y Uzbekistán y si valoras sus extras.
- **Quieres telemedicina incluida o un plan en suscripción:** **Holafly**. Para viajeros sordos, el chat escrito de medicina general es un extra muy útil (lo contamos en la [reseña de Holafly](/esim-holafly-opiniones)).
- **Priorizas una compensación clara por cortes de servicio:** **eSIMFLAG**.
- **Viajas por Argentina, Chile o Colombia:** da igual la marca en cobertura; decide por precio y extras.

## Instalación y activación en las dos

En las dos conviene **instalar la eSIM antes de viajar, con WiFi, y activarla al llegar** (con roaming de datos activado en la línea de la eSIM y desactivado en tu SIM habitual). En iPhone, Holafly avisa de que con iOS 16.4 o superior puede activarse sola al instalarla. Guías detalladas: [eSIMFLAG](/esimflag-opiniones) y [Holafly](/esim-holafly-opiniones). Si dudas con otras marcas, mira la [mejor eSIM para viajar](/mejor-esim-para-viajar).

## Nuestra recomendación

No hay una ganadora para todos los viajes. **Compara el precio de tu destino y tus días en la tabla**, tenlo en cuenta con los descuentos, y decide por los extras que te importen. Si viajas por Sudamérica en ruta larga, recuerda lo principal: **la cobertura la marca el operador local**, y las dos usan el mismo en varios países.

{boton_flag("Ver eSIMFLAG con 20 % de descuento")}

{boton_hola("Ver Holafly (código MOCHILEANDO)")}
"""
post(
    "esimflag-vs-holafly",
    "eSIMFLAG vs Holafly 2026: precios, red y cuál elegir",
    "eSIMFLAG vs Holafly con precios oficiales de octubre de 2026 en 15 destinos, con descuentos, redes por país y qué te da cada una si algo falla.",
    "Portada con el texto «eSIMFLAG vs Holafly: precios, red y cuál elegir» sobre fondo verde azulado y el logo de Mochileando sin Barreras",
    ["esims", "holafly", "esimflag"],
    faqs,
    cuerpo,
)

# =====================================================================================
# 2. eSIMFLAG Movistar
# =====================================================================================
REG = [
    ("Sudamérica y Latinoamérica", [("argentina", "Argentina"), ("bolivia", "Bolivia"), ("brazil", "Brasil"), ("chile", "Chile"), ("colombia", "Colombia"), ("ecuador", "Ecuador"), ("mexico", "México"), ("paraguay", "Paraguay"), ("peru", "Perú"), ("uruguay", "Uruguay"), ("venezuela", "Venezuela"), ("costa-rica", "Costa Rica"), ("panama", "Panamá"), ("guatemala", "Guatemala")]),
    ("Norteamérica", [("united-states-of-america", "Estados Unidos"), ("canada", "Canadá")]),
    ("Europa", [("spain", "España"), ("italy", "Italia"), ("france", "Francia"), ("germany", "Alemania"), ("portugal", "Portugal"), ("united-kingdom", "Reino Unido"), ("greece", "Grecia"), ("turkey", "Turquía"), ("slovenia", "Eslovenia")]),
    ("África, Asia y Oceanía", [("morocco", "Marruecos"), ("egypt", "Egipto"), ("south-africa", "Sudáfrica"), ("thailand", "Tailandia"), ("vietnam", "Vietnam"), ("indonesia", "Indonesia"), ("japan", "Japón"), ("india", "India"), ("kazakhstan", "Kazajistán"), ("uzbekistan", "Uzbekistán"), ("australia", "Australia"), ("new-zealand", "Nueva Zelanda")]),
]
bloques = ""
for reg, items in REG:
    filas = [f"| {nombre} | {red_e(s)} | {eur(ep(s, 7))} |" for s, nombre in items if s in E]
    bloques += f"### {reg}\n\n| Destino | Red indicada por eSIMFLAG | 7 días (precio de lista) |\n| :--- | :--- | ---: |\n" + "\n".join(filas) + "\n\n"
n_mov = sum(1 for r in E.values() if r["red"] and "movistar" in r["red"].lower())
n_fichas = len(E)
n_sin = sum(1 for r in E.values() if not r['red'])

faqs2 = [
    ("¿eSIMFLAG es de Movistar?", "Sí, es la marca de eSIM de viaje del grupo Telefónica (eSIMFLAG by Movistar) y no necesitas ser cliente de Movistar para usarla. Pero la red a la que se conecta depende del país: solo en 7 de las más de 150 fichas de destino revisadas es Movistar."),
    ("¿eSIMFLAG usa la red de Movistar en todos los países?", "No. Según las fichas de su web, solo usa Movistar en Argentina, Chile, Colombia, España, México, Perú y Venezuela. En EE. UU. usa Verizon, en Japón KDDI, en Tailandia AIS, en Turquía Turk Telekom, en la India Reliance Jio y en Marruecos Orange."),
    ("¿Necesito ser cliente de Movistar para usar eSIMFLAG?", "No. Es una eSIM de datos abierta a cualquier persona con un móvil compatible y liberado, de cualquier operadora."),
    ("¿Es mejor eSIMFLAG que el roaming de Movistar?", "Depende del destino. Dentro de la UE y Reino Unido, el roaming de tu tarifa suele bastar. Fuera de esa zona, una eSIM con precio cerrado evita sorpresas: en EE. UU., 7 días cuestan 24,50 € con eSIMFLAG frente a unos 42,35 € si activas la tarifa diaria de 6,05 € de Movistar cada día."),
    ("¿Cuánto cuesta eSIMFLAG con Movistar?", "No hay una tarifa «Movistar» aparte: el precio depende del destino y los días. 7 días con datos ilimitados cuestan 24,50 € en Argentina, Chile, México, Perú, Colombia o EE. UU. y 18,20 € en España, antes del 20 % de descuento de nuestro enlace."),
]
cuerpo2 = f"""
Si buscas **eSIMFLAG Movistar**, probablemente quieres saber una cosa: **¿usa la red de Movistar o no?** La respuesta corta: **es la marca de eSIM de viaje de Telefónica (eSIMFLAG by Movistar), pero se conecta al operador local de cada país, y solo en 7 destinos es Movistar.** Aquí tienes la red que indica su web para cada destino, con precios oficiales de {FECHA}.

<CajaAviso tipo="info" titulo="En 30 segundos">

**Marca:** eSIMFLAG by Movistar (Telefónica). **Red:** la del operador local; **Movistar solo en Argentina, Chile, Colombia, España, México, Perú y Venezuela**. **No necesitas ser cliente de Movistar.** **Descuento:** 20 % desde nuestro enlace.

</CajaAviso>

{boton_flag()}

<Indice />

## ¿eSIMFLAG es de Movistar?

Sí en cuanto a marca. Su web se presenta como «eSIMFLAG by Movistar», habla de «la red oficial de nuestra selección» y su blog dice que **Movistar recomienda este servicio de Telefónica desde su propia página de roaming**. Tienes el análisis completo en nuestra [reseña de eSIMFLAG](/esimflag-opiniones).

Ahora bien, **que sea de Telefónica no significa que use siempre la red de Movistar**. Una eSIM de viaje se conecta a los operadores locales con los que tiene acuerdos, y eso es lo que cambia en cada país.

## Qué red usa eSIMFLAG en cada país

De las {n_fichas} fichas de destino que publica su web, **{n_mov} indican Movistar como red**. En otras {n_sin} (Europa, Brasil, Asia, Global y algunas regiones) no se indica un operador concreto, y en el resto se nombra otro operador local. Estas son las redes que indica la web para los destinos más buscados:

{bloques}Los precios son de lista (sin el 20 % de descuento) y pueden cambiar.

## Consecuencias prácticas

- **En Argentina, Chile, Colombia y Perú usarás la red de Movistar**, la misma de Telefónica que usan otras eSIM como Holafly en Argentina, Chile y Colombia. Donde Movistar no cubre, no hay datos, sea cual sea la eSIM. Más en [eSIMFLAG vs Holafly](/esimflag-vs-holafly).
- **En EE. UU. se conecta a Verizon**, una de las mayores redes del país, y la web indica que permite compartir datos.
- **En Japón, KDDI; en Tailandia, AIS; en Turquía, Turk Telekom**: operadores locales importantes, no de Movistar.
- **Si tu destino no indica red** (Europa, Brasil, Asia, Global), eSIMFLAG elige el operador según la zona: confirma con su soporte si te preocupa una región concreta.

## eSIMFLAG o roaming de Movistar

Si eres cliente de Movistar, también puedes usar tu propia línea en el extranjero. **Dentro de la UE y Reino Unido** suele bastar el roaming de tu tarifa. **Fuera de esa zona**, según lo que publican Movistar y eSIMFLAG:

- **EE. UU. y Suiza:** 500 MB por 6,05 € al día (solo pagas los días que usas datos); si pasas de 500 MB, se cobra otro bloque.
- **Andorra:** 3 GB diarios por 9 €.
- **Zonas 2 y 3 en general:** tarifa por MB de 12,10 €.

Con eso, **7 días en EE. UU. son 42,35 € si usas datos cada día** con el roaming de Movistar, frente a **24,50 € con eSIMFLAG** (19,60 € con el 20 % de descuento). Las tarifas de Movistar pueden variar según tu línea (contrato o prepago) y cambian con el tiempo: **comprueba tu caso en Mi Movistar**. Lo desarrollamos en [roaming de Movistar: precios y cuándo compensa una eSIM](/roaming-movistar).

## Cómo funciona con tu línea de Movistar

La eSIM de eSIMFLAG es **solo de datos**: sin llamadas ni SMS tradicionales. Lo habitual es conservar tu SIM de Movistar para llamadas y SMS (con el roaming de datos desactivado) y usar la eSIM para datos. Instálala antes de viajar con WiFi y actívala al llegar; si no conecta, su guía indica probar el APN **esimflag**.

{boton_flag("Ver eSIMFLAG con 20 % de descuento")}
"""
post(
    "esimflag-movistar",
    "eSIMFLAG Movistar: qué red usa en cada país (2026)",
    "eSIMFLAG es de Movistar, pero solo usa su red en 7 destinos. Redes por país, precios oficiales y comparación con el roaming de Movistar.",
    "Portada con el texto «eSIMFLAG Movistar: qué red usa en cada país» sobre fondo verde azulado y el logo de Mochileando sin Barreras",
    ["esims", "esimflag", "movistar"],
    faqs2,
    cuerpo2,
)

# =====================================================================================
# 3. Código descuento eSIMFLAG
# =====================================================================================
CD = [("argentina", "Argentina"), ("chile", "Chile"), ("peru", "Perú"), ("mexico", "México"), ("united-states-of-america", "Estados Unidos"), ("canada", "Canadá"), ("europe", "Europa"), ("spain", "España"), ("turkey", "Turquía"), ("thailand", "Tailandia"), ("japan", "Japón"), ("india", "India"), ("global", "Global")]
filas = []
for s, nombre in CD:
    a, b, c = ep(s, 7), ep(s, 15), ep(s, 20)
    filas.append(f"| {nombre} | {eur(a)} → **{eur(round(a * 0.8, 2))}** | {eur(b)} → **{eur(round(b * 0.8, 2))}** | {eur(c)} → **{eur(round(c * 0.8, 2))}** |")
TAB_CD = "| Destino | 7 días | 15 días | 20 días |\n| :--- | :--- | :--- | :--- |\n" + "\n".join(filas)

faqs3 = [
    ("¿Hay código descuento de eSIMFLAG?", "Sí: MOCHILEANDOSINBARRERAS da un 20 % de descuento. No hace falta escribirlo: se aplica solo al entrar desde nuestro enlace de afiliado, sin mínimo de días (comprobado el 8 de octubre de 2026)."),
    ("¿Cómo se aplica el código de eSIMFLAG?", "Entra desde el botón de esta guía, elige destino y días y comprueba que el carrito ya muestra el 20 % de descuento antes de pagar. No tienes que copiar ni pegar nada."),
    ("¿El descuento de eSIMFLAG funciona en todos los destinos?", "Lo hemos comprobado en el carrito, pero eSIMFLAG puede cambiar o limitar la oferta. Mira siempre el total antes de pagar."),
    ("¿Por qué no veo el descuento?", "Entra desde el botón sin cupones de otras webs ni extensiones que alteren el enlace, y desde una ventana nueva. Si sigue sin aparecer, escríbenos a equipo@mochileandosinbarreras.com."),
    ("¿Puedo usar otro código promocional de eSIMFLAG?", "No tenemos constancia de otros códigos vigentes. El 20 % de MOCHILEANDOSINBARRERAS es el que hemos comprobado."),
]
cuerpo3 = f"""
**Sí, hay código de descuento de eSIMFLAG: MOCHILEANDOSINBARRERAS, un 20 %.** Y es de los cómodos, porque **no tienes que escribirlo**: se aplica solo cuando entras desde nuestro enlace. Lo comprobamos en el carrito el 8 de octubre de 2026. Aquí tienes cómo usarlo y **cuánto cuesta cada eSIM con el descuento aplicado**.

{boton_flag()}

<Indice />

## Cómo conseguir el 20 % de descuento en eSIMFLAG

1. **Pulsa el botón** de esta guía (es nuestro enlace de afiliado).
2. **Elige destino y días** en la web de eSIMFLAG.
3. **Comprueba el carrito:** el total debe llevar ya el 20 % de descuento, sin que escribas nada.
4. **Paga** como siempre.

Sin días mínimos y sin código que copiar. Si no ves el descuento, vuelve a entrar desde el botón en una ventana nueva y sin otras extensiones de cupones activas.

## Cuánto cuesta eSIMFLAG con el 20 % de descuento

Precios de lista oficiales del {FECHA} → precio con el 20 % de descuento, con datos ilimitados:

{TAB_CD}

Confirma siempre el total en el carrito: eSIMFLAG puede cambiar tarifas y ofertas. Si quieres ver cómo salen frente a otra marca, mira [eSIMFLAG vs Holafly](/esimflag-vs-holafly).

## ¿Merece la pena?

El descuento es real y los precios ya eran competitivos: **a 7 días, eSIMFLAG es de las más baratas con datos ilimitados**, y en Europa y España destaca. Tienes el análisis completo, con instalación, red por país y garantía, en nuestra [reseña de eSIMFLAG](/esimflag-opiniones) y en [eSIMFLAG Movistar](/esimflag-movistar). Si buscas alternativas, tenemos la [mejor eSIM para viajar](/mejor-esim-para-viajar).

## Condiciones que conviene conocer

- **Garantía de 30 días:** si no puedes usar la eSIM, te devuelven el dinero según su web (más en la reseña).
- **Solo datos:** no incluye llamadas ni SMS tradicionales.
- **Instalación:** antes del viaje, con WiFi; se activa al llegar al destino.
- **Es un enlace de afiliado:** si compras desde él, nos pagan una comisión sin coste extra para ti. Lo declaramos porque es la única forma de mantener el blog sin publicidad intrusiva.

{boton_flag("Aplicar el 20 % en eSIMFLAG")}
"""
post(
    "codigo-descuento-esimflag",
    "Código descuento eSIMFLAG: 20 % (MOCHILEANDOSINBARRERAS)",
    "Código descuento eSIMFLAG: 20 % con MOCHILEANDOSINBARRERAS, que se aplica solo desde nuestro enlace. Precios oficiales con el descuento ya calculado.",
    "Portada con el texto «Código descuento eSIMFLAG: 20 %» sobre fondo verde azulado y el logo de Mochileando sin Barreras",
    ["esims", "esimflag", "descuentos"],
    faqs3,
    cuerpo3,
)

# =====================================================================================
# 4. Roaming Movistar
# =====================================================================================
faqs4 = [
    ("¿Cuánto cuesta el roaming de Movistar en Estados Unidos?", "Según lo que publican Movistar y eSIMFLAG, en EE. UU. y Suiza puedes contratar 500 MB por 6,05 € al día (solo pagas los días que usas datos). Si pasas de 500 MB, se cobra otro bloque. Las condiciones pueden variar según tu línea; compruébalas en Mi Movistar."),
    ("¿Es gratis el roaming de Movistar en Europa?", "Dentro de la UE y Reino Unido puedes usar tu tarifa casi como en España, con la franquicia de datos de tu línea. Fuera de esa zona se aplican otras condiciones: comprueba el país en el buscador oficial de Movistar."),
    ("¿Cuánto cuesta el roaming de Movistar por MB?", "Para las zonas 2 y 3 sin condición especial, la tarifa estándar publicada es de 12,10 € por MB, según eSIMFLAG citando a Movistar. Conviene comprobarlo en tu línea."),
    ("¿Compensa más una eSIM o el roaming de Movistar?", "Dentro de la UE y Reino Unido, normalmente el roaming. Fuera de esa zona, una eSIM con precio cerrado suele ser más barata y previsible: en EE. UU., 7 días con eSIMFLAG cuestan 24,50 € frente a unos 42,35 € con la tarifa diaria de Movistar usada cada día."),
    ("¿Puedo usar mi SIM de Movistar y una eSIM a la vez?", "Sí, en un móvil compatible y liberado. Lo habitual es dejar la SIM de Movistar para llamadas y SMS, con el roaming de datos desactivado, y usar la eSIM para los datos."),
]
cuerpo4 = f"""
**El roaming de Movistar** te permite usar tu línea en el extranjero, pero el precio cambia mucho al cruzar una frontera: **casi gratis en la UE y Reino Unido, y por días o por MB fuera de ella.** Aquí tienes cuánto cuesta según lo que publican Movistar y eSIMFLAG, **cuándo compensa una eSIM** y cómo evitar facturas sorpresa. Datos de {FECHA}.

<CajaAviso tipo="alerta" titulo="Compruébalo en tu línea">

Las tarifas de roaming dependen de tu contrato (contrato o prepago) y cambian con el tiempo. Los importes de esta guía los publican Movistar (a través de su comunidad) y eSIMFLAG en su blog. **Confirma tu caso en Mi Movistar > Gestiones de línea > Roaming** antes de viajar.

</CajaAviso>

{boton_flag("Ver eSIMFLAG con 20 % de descuento")}

<Indice />

## ¿Cuándo compensa el roaming de Movistar y cuándo una eSIM?

| Destino | Opción recomendada | Por qué |
| :--- | :--- | :--- |
| **Unión Europea y Reino Unido** | Roaming de Movistar | Puedes usar llamadas, SMS y la franquicia de datos de tu tarifa nacional |
| **Estados Unidos** | eSIM | 7 días con eSIMFLAG cuestan 24,50 €, frente a unos 42,35 € con la tarifa diaria de Movistar (7 × 6,05 €) |
| **Suiza** | eSIM | 7 días con eSIMFLAG cuestan 27,30 €, frente a unos 42,35 € con la tarifa diaria |
| **Andorra** | eSIM | 7 días con eSIMFLAG cuestan 22,40 € (eSIM de Europa; la de solo Andorra, 18,20 €) frente a unos 63 € con 3 GB diarios por 9 € |
| **Turquía o Marruecos** | eSIM | Movistar cobra el tráfico por MB en su tarifa estándar |
| **Viaje con apenas internet** | Roaming | Puede bastar si mantienes los datos desactivados y solo recibes SMS |

Con el 20 % de descuento de nuestro enlace, los 24,50 € de EE. UU. quedan en **19,60 €**. Los precios de eSIMFLAG son los de sus fichas del 8 de octubre de 2026.

## Cuánto cuesta el roaming de Movistar

Movistar divide los destinos en zonas. Según lo publicado:

- **Zona 1 (UE y Reino Unido):** se aplica la franquicia de tu tarifa nacional.
- **Estados Unidos y Suiza:** 500 MB por 6,05 € al día. Solo se cobra el día en que se usan datos; si superas los 500 MB, se cobra otro bloque.
- **Andorra:** 3 GB diarios por 9 €.
- **Zonas 2 y 3 (resto del mundo):** tarifa estándar de **12,10 € por MB** salvo condición especial. A ese precio, una conexión mínima puede costar mucho.
- **Datos marítimos (barcos):** Movistar publica una tarifa de 36,30 € por MB.

| Qué haces en un día | Consumo orientativo | Coste con la tarifa de 6,05 € |
| :--- | :--- | :--- |
| Google Maps 30 minutos | 5-30 MB | Activa la cuota de 6,05 € |
| WhatsApp y correo | 20-100 MB | 6,05 € |
| Videollamada de WhatsApp de 20 minutos | 100-250 MB | 6,05 € si no pasas de 500 MB |
| Una hora de Netflix | 300 MB - 3 GB | Puede agotar o superar el bono diario |

## Cómo evitar facturas sorpresa

- **Consulta el país** en el buscador oficial de Movistar y activa el roaming solo donde lo necesites.
- **Descarga mapas, música y vídeos con WiFi** y desactiva las actualizaciones automáticas.
- **Fuera de la zona de tarifa incluida,** desactiva los datos de tu SIM de Movistar y deja la eSIM como línea de datos.
- **Cuidado en fronteras y barcos:** el móvil puede engancharse a una red extranjera o marítima sin que lo notes. Selecciona la red a mano o desactiva la itinerancia.

## La alternativa: una eSIM de viaje

Una eSIM de datos como eSIMFLAG se instala con un QR **antes de viajar**, se conecta a una red local al llegar y te deja **conservar tu SIM de Movistar** para llamadas y SMS. Tiene precio cerrado por días, datos ilimitados y compartir datos incluido, y su web anuncia una garantía de 30 días. **No incluye llamadas ni SMS tradicionales.** Para saber qué red usa en cada país, mira [eSIMFLAG Movistar](/esimflag-movistar); para comparar con otras, [la mejor eSIM para viajar](/mejor-esim-para-viajar).

{boton_flag()}
"""
post(
    "roaming-movistar",
    "Roaming Movistar 2026: precios y cuándo compensa una eSIM",
    "Roaming de Movistar: cuánto cuesta en EE. UU., Suiza, Andorra y el resto del mundo, cómo evitar sorpresas y cuándo compensa una eSIM de viaje.",
    "Portada con el texto «Roaming Movistar: precios y cuándo compensa una eSIM» sobre fondo verde azulado y el logo de Mochileando sin Barreras",
    ["esims", "movistar", "roaming"],
    faqs4,
    cuerpo4,
)

# =====================================================================================
# 5. eSIM para Latinoamérica
# =====================================================================================
LAT = [
    ("argentina", "argentina", "Argentina"), ("chile", "chile", "Chile"), ("uruguay", "uruguay", "Uruguay"), ("bolivia", "bolivia", "Bolivia"),
    ("peru", "peru", "Perú"), ("ecuador", "ecuador", "Ecuador"), ("colombia", "colombia", "Colombia"), ("brazil", "brasil", "Brasil"),
    ("paraguay", "paraguay", "Paraguay"), ("mexico", "mexico", "México"), ("costa-rica", "costa-rica", "Costa Rica"), ("panama", "panama", "Panamá"),
    ("guatemala", "guatemala", "Guatemala"),
]
filas = []
for se, sh, nombre in LAT:
    filas.append(f"| {nombre} | {red_e(se)} | {red_h(sh)} | {eur(ep(se, 7))} | {eur(hp(sh, 7))} | {eur(ep(se, 15))} | {eur(hp(sh, 15))} |")
TAB_LAT = "| País | Red eSIMFLAG | Red Holafly | eSIMFLAG 7 d | Holafly 7 d | eSIMFLAG 15 d | Holafly 15 d |\n| :--- | :--- | :--- | ---: | ---: | ---: | ---: |\n" + "\n".join(filas)
reg = {"eSIMFLAG": ep("latinamerica", 7), "Holafly": hp("america-latina", 7)}

faqs5 = [
    ("¿Qué eSIM es mejor para viajar por Latinoamérica?", "Depende de los países y los días. En Argentina, Chile y Colombia, eSIMFLAG y Holafly usan la red de Telefónica/Movistar: la cobertura es la misma y cambia el precio. Compara cada país en la tabla de esta guía; a 7 días eSIMFLAG es más barata en casi todos y a 15 días, a precio de lista, Holafly lo es en 8 de 13 países; con nuestros descuentos, eSIMFLAG gana en 11 de 13."),
    ("¿Hay una eSIM para toda Latinoamérica?", f"Sí. eSIMFLAG tiene una eSIM de «Latinoamérica» (7 días: {eur(reg['eSIMFLAG'])}) y Holafly una de «América Latina» (7 días: {eur(reg['Holafly'])}). Compensan si cruzas varios países en pocos días; si te quedas semanas en cada uno, mira las eSIM por país."),
    ("¿Funciona la eSIM en la Patagonia y la Carretera Austral?", "La eSIM usa la red del operador local. Donde no llega la señal de Movistar u otro operador, no habrá datos con ninguna eSIM. En nuestra ruta nos quedamos sin cobertura en tramos de la Patagonia y la Carretera Austral, y ninguna alternativa llegaba tampoco."),
    ("¿Puedo usar la eSIM para compartir datos con otros dispositivos?", "Sí con eSIMFLAG (compartir datos incluido en sus fichas) y con Holafly (1 GB al día para compartir según sus fichas de destino)."),
    ("¿Compensa una SIM local en lugar de una eSIM?", "En viajes largos en un solo país, normalmente una SIM local sale más barata. Para los primeros días tras cruzar una frontera o escapadas cortas, una eSIM evita buscar tienda y trámites."),
]
cuerpo5 = f"""
Llevamos meses viajando de Ushuaia hacia Alaska en furgoneta y hemos probado qué pasa con los datos en cada frontera. Esta guía resume **qué eSIM te conviene en Latinoamérica**, con los **precios oficiales de eSIMFLAG y Holafly en {FECHA}** y, sobre todo, **qué red usa cada una en cada país**, porque ahí está la cobertura real.

<CajaAviso tipo="info" titulo="La clave: la cobertura la pone el operador, no la marca">

**En Argentina, Chile y Colombia, eSIMFLAG y Holafly usan la misma red (Telefónica/Movistar).** Donde esa red no llega (Patagonia, Carretera Austral, zonas rurales), ninguna de las dos te dará datos. Elige por **precio y extras**, no por cobertura.

</CajaAviso>

{boton_flag()}

{boton_hola()}

<Indice />

## Precios y redes por país (7 y 15 días)

Precios de lista oficiales de cada web, con datos ilimitados, antes de aplicar descuentos (20 % en eSIMFLAG desde nuestro enlace; 5 % en Holafly con el código MOCHILEANDO).

{TAB_LAT}

Qué vemos:

- **A 7 días, a precio de lista, eSIMFLAG es más barata** en 11 de 13 países (Argentina, Perú, Chile, Colombia, Brasil, Uruguay…); en México y Panamá, **Holafly es más barata**.
- **A 15 días y a precio de lista, la balanza se inclina hacia Holafly** en 8 de 13 países, porque sus planes largos bajan más de precio por día.
- **Con nuestros descuentos (20 % y 5 %), eSIMFLAG gana a 7 días en los 13 países y a 15 días en 11**; Holafly solo en México y Panamá.
- **Hay países donde cambia la red:** en Perú, eSIMFLAG indica Movistar y Holafly, «Movistar Peru / Claro Peru»; en Ecuador, Otecel (operador de Movistar en Ecuador) frente a Movistar Ecuador.

Precios y redes de las fichas públicas del 8 de octubre de 2026; confirma siempre el total en el carrito.

## ¿eSIM regional o eSIM por país?

Si cruzas **tres o más países en pocas semanas**, una eSIM regional evita comprar una por frontera: eSIMFLAG tiene «Latinoamérica» ({eur(reg['eSIMFLAG'])} por 7 días) y Holafly «América Latina» ({eur(reg['Holafly'])}). Si te quedas **semanas en cada país**, sale mejor una eSIM por país o una SIM local. Nosotros, en ruta larga, usamos una eSIM los primeros días tras cruzar la frontera y SIM local después (lo contamos en la [reseña de Holafly](/esim-holafly-opiniones)).

## Cobertura real: qué esperar

- **Ciudades y rutas principales:** buena en las dos.
- **Zonas remotas:** donde no hay red del operador, no hay datos. Nos pasó en la Patagonia y la Carretera Austral.
- **Islas y rincones concretos:** Holafly indica en su ficha de México zonas sin cobertura (por ejemplo, Isla Holbox). Revisa la ficha de tu destino antes de comprar.

## Cuál elegir

- **Escapada de una semana a Argentina, Perú, Chile o Colombia:** **eSIMFLAG**, por precio.
- **Más de 15 días en un mismo país:** **Holafly**, o una SIM local si vas a estar meses.
- **Quieres telemedicina o suscripción:** **Holafly** (para viajeros sordos, el chat de medicina general es un extra útil).
- **Quieres una garantía de 30 días y compensación por cortes:** **eSIMFLAG**.

Para elegir con más detalle: [eSIMFLAG vs Holafly](/esimflag-vs-holafly), la [reseña de eSIMFLAG](/esimflag-opiniones), la de [Holafly](/esim-holafly-opiniones) y la [mejor eSIM para viajar](/mejor-esim-para-viajar). Para pagar sin comisiones en la ruta: [tarjeta para viajar por Latinoamérica](/tarjeta-para-viajar-por-latinoamerica).

{boton_flag("Ver eSIMFLAG con 20 % de descuento")}

{boton_hola("Ver Holafly (código MOCHILEANDO)")}
"""
post(
    "esim-latinoamerica",
    "eSIM para Latinoamérica 2026: precios y red por país",
    "eSIM para Latinoamérica: precios oficiales de eSIMFLAG y Holafly en 13 países, qué red usa cada una y por qué la cobertura es la misma en varios.",
    "Portada con el texto «eSIM para Latinoamérica: precios y red por país» sobre fondo verde azulado y el logo de Mochileando sin Barreras",
    ["esims", "latinoamerica", "esimflag", "holafly"],
    faqs5,
    cuerpo5,
)
