# -*- coding: utf-8 -*-
"""Añade eSIMFLAG a las comparativas de Japón y EE. UU. y crea la guía de eSIM para viajeros sordos (octubre de 2026)."""
import json

FLAG_URL = (
    "https://clk.tradedoubler.com/click?p=383157&a=3480944&url=http%3A%2F%2Fwww.esimflag.com%2Fpartners%2Ftd%3Fdiscount%3DMOCHILEANDOSINBARRERAS"
    "%26utm_source%3Dmochileandosinbarreras%26utm_medium%3Daffiliatte%26utm_content%3Dtradedoubler_es"
)
HOLAFLY_URL = "https://holafly.sjv.io/oN4rme"
H = {r["slug"].replace("esim-", ""): r for r in json.load(open("esim.holafly.com/prices/destinos.json", encoding="utf-8"))}
E = {r["slug"].replace("esim-", ""): r for r in json.load(open("esimflag.com/prices/destinos.json", encoding="utf-8"))}


def rd(p):
    return open(p, encoding="utf-8", newline="").read()


def wr(p, s):
    open(p, "w", encoding="utf-8", newline="").write(s)


def eur(x):
    return ("%.2f" % x).replace(".", ",") + " €"


def t(r):
    return {x["dias"]: x["eur"] for x in r["tabla_precios"]}


def boton_flag(texto):
    return f'<BotonAfiliado\n  href="{FLAG_URL}"\n  text="{texto}"\n>\n\nEnlace de afiliado de eSIMFLAG: el 20 % se aplica solo al entrar desde aquí. Nos pagan una comisión sin coste extra para ti.\n\n</BotonAfiliado>'


def comparativa(slug, e_slug, h_slug, pais_texto, fila_antes, red_h, nota_red):
    p = f"src/data/post/{slug}.mdx"
    s = rd(p)
    e7, e15 = t(E[e_slug])[7], t(E[e_slug])[15]
    h7, h15 = t(H[h_slug])[7], t(H[h_slug])[15]
    red_e = E[e_slug]["red"]
    fila_nueva = f"| **eSIMFLAG** | {eur(e15)} ({eur(round(e15 * 0.8, 2))} con el 20 %) | Ilimitados | {red_e} | Descuento del 20 % desde nuestro enlace |"
    assert fila_antes in s, (slug, fila_antes[:50])
    s = s.replace(fila_antes, fila_antes + "\n" + fila_nueva, 1)
    ancla = "👉 Como ves,"
    assert ancla in s, slug
    bloque = f"""<CajaAviso tipo="info" titulo="Precios oficiales de eSIMFLAG y Holafly en {pais_texto} (8 de octubre de 2026)">

**7 días:** eSIMFLAG {eur(e7)} ({eur(round(e7 * 0.8, 2))} con su 20 %) y Holafly {eur(h7)} ({eur(round(h7 * 0.95, 2))} con el código MOCHILEANDO, 5 %). **15 días:** eSIMFLAG {eur(e15)} ({eur(round(e15 * 0.8, 2))}) y Holafly {eur(h15)} ({eur(round(h15 * 0.95, 2))}). {nota_red} Precios de lista de sus fichas públicas; confirma el total en el carrito. Comparativa completa en [eSIMFLAG vs Holafly](/esimflag-vs-holafly).

</CajaAviso>

{boton_flag('Ver eSIMFLAG con 20 % de descuento')}

"""
    s = s.replace(ancla, bloque + ancla, 1)
    wr(p, s)
    print(slug, "ok")


comparativa(
    "esim-japon", "japan", "japon", "Japón",
    "| **Holafly** | 46,90 € | Ilimitados | KDDI / Softbank (4G / 5G) | Viajar sin preocuparte por los datos |",
    "KDDI / Softbank",
    "eSIMFLAG usa la red de **KDDI** y Holafly, **KDDI y Softbank**: en Japón ninguna de las dos usa la red de Movistar.",
)
comparativa(
    "esim-eeuu", "united-states-of-america", "usa", "EE. UU.",
    "| **Holafly** | 46,90 € | Ilimitados | AT&T / T-Mobile | Viajar sin preocuparte por los datos |",
    "AT&T / T-Mobile",
    "eSIMFLAG usa la red de **Verizon** y Holafly, la de **AT&T y T-Mobile**; las dos permiten compartir datos.",
)

# =====================================================================================
# eSIM para viajeros sordos
# =====================================================================================
faqs = [
    ("¿Qué eSIM es mejor para un viajero sordo o con hipoacusia?", "La que te dé datos estables y un soporte por escrito. Tanto eSIMFLAG (WhatsApp y chat web, 24 horas) como Holafly (chat, WhatsApp y correo, 24 horas) atienden por canales escritos, sin necesidad de llamar. Holafly añade chat de medicina general 24/7 incluido en sus eSIM por días compradas desde el 6 de octubre de 2026 en una lista de destinos."),
    ("¿Necesito datos ilimitados si soy sordo?", "Nosotros lo recomendamos: videollamadas en lengua de signos, apps de transcripción en directo y traductores consumen datos y no quieres quedarte sin ellos en una frontera o en un trámite. Las dos eSIM que analizamos son de datos ilimitados, sujetas a la política de uso razonable del operador."),
    ("¿Puedo contactar con el soporte de la eSIM sin llamar por teléfono?", "Sí. eSIMFLAG atiende por WhatsApp y chat web; Holafly, por chat en su web y app, WhatsApp y correo. Ninguna de las dos requiere una llamada de voz para gestionar una incidencia o un reembolso."),
    ("¿La telemedicina de Holafly sirve para una persona sorda?", "El chat de medicina general es en tiempo real, funciona 24/7 y está disponible en español e inglés, así que no requiere oír. La videollamada es solo en español. No es un servicio de urgencias ni un seguro: ante una emergencia, llama al número local de emergencias o acude a urgencias."),
    ("¿La eSIM me sirve para pedir ayuda en una emergencia?", "Te da datos para escribir, usar un traductor o contactar con tu aseguradora por chat, pero no sustituye al seguro ni al número de emergencias. Descarga tu póliza y guarda el canal escrito de asistencia antes de salir."),
    ("¿Y si no hay cobertura?", "Una eSIM usa la red del operador local: donde no llega, no hay datos con ninguna marca. Lleva mapas y traductor sin conexión, y pensa en ello al elegir ruta."),
]


def faq_fm(f):
    return "\n".join(f'  - q: "{q}"\n    a: "{a.replace(chr(34), chr(92) + chr(34))}"' for q, a in f)


cuerpo = f"""
Cuando no oyes bien, **los datos del móvil son tu forma de comunicarte con el mundo**: videollamadas en lengua de signos, apps de transcripción en directo, traductores y poder escribir en lugar de hablar. Por eso una eSIM, para un viajero sordo o con hipoacúsia, no es un lujo: es **autonomía**. Esta guía lo cuenta desde dentro (Cris es hipoacúsica) y con los datos oficiales de **eSIMFLAG y Holafly** de octubre de 2026.

<CajaAviso tipo="info" titulo="Lo que importa en una eSIM si eres sordo o hipoacúsico">

**1.** Datos estables (mejor ilimitados). **2.** **Soporte escrito 24/7**, sin llamar. **3.** Reembolso y garantías que se gestionan por escrito. **4.** Saber qué **red** usa en tu destino. **5.** Un plan B sin conexión (mapas y traductor descargados).

</CajaAviso>

{boton_flag('Ver eSIMFLAG con 20 % de descuento')}

<BotonAfiliado
  href="{HOLAFLY_URL}"
  text="Ver planes de Holafly →"
>

Enlace de afiliado de Holafly: pega el código **MOCHILEANDO** en el carrito para un 5 % de descuento. Nos pagan una comisión sin coste extra para ti.

</BotonAfiliado>

## Por qué los datos pesan más cuando eres sordo

Para una persona oyente, quedarse sin datos es una molestia. Para una persona sorda puede ser quedarse **incomunicada de verdad**. Con una eSIM que funciona, Cris puede:

- **Hacer videollamadas en lengua de signos** estés donde estés, sin depender de un WiFi que no aparece.
- **Usar apps de transcripción en directo** para «leer» lo que dice la gente en una conversación, una frontera o un trámite.
- **Tirar de traductores** cuando ni el idioma ni la lengua de signos coinciden.
- **Escribir en lugar de hablar** cuando la situación lo pide, sin quedarse aislada porque «no hay cobertura».

Nuestro consejo: **prioriza una conexión estable y de datos ilimitados por encima del precio**.

## eSIMFLAG y Holafly: lo que nos importa a los viajeros sordos

| | eSIMFLAG | Holafly |
| :--- | :--- | :--- |
| **Soporte** | WhatsApp y chat web, 24 horas | Chat (web y app), WhatsApp y correo, 24 horas |
| **¿Hace falta llamar?** | No: todo por escrito | No: todo por escrito |
| **Reembolso por escrito** | Garantía de 30 días: «Ya soy cliente» > «Solicitar una devolución» | Hasta 6 meses (eSIM por días): correo, WhatsApp o chat |
| **Telemedicina** | No publican ninguna | Chat de medicina general 24/7 (español e inglés) y pediatría, ginecología y veterinaria por chat, en las eSIM por días compradas desde el 6 de octubre de 2026 en una lista de destinos |
| **Datos ilimitados** | Sí | Sí |
| **Compartir datos** | Incluido | 1 GB al día |
| **Llamadas y SMS** | Solo datos (llamadas por apps) | Solo datos (los Plans Unlimited incluyen número EE. UU./Reino Unido/Canadá para SMS y VoIP) |

Datos de sus webs oficiales de {"octubre de 2026"}. No hemos verificado certificaciones de accesibilidad de ninguna de las dos: lo que contamos es lo que publican y lo que vivimos nosotros. Más detalle en [eSIMFLAG](/esimflag-opiniones), [Holafly](/esim-holafly-opiniones) y [eSIMFLAG vs Holafly](/esimflag-vs-holafly).

## La telemedicina por chat de Holafly, vista desde la sordera

Holafly incluye **Meeting Doctors** en las eSIM por días compradas **desde el 6 de octubre de 2026** en una lista de destinos de América, Europa y otros. Para nosotros lo importante es el **formato escrito**:

- **Chat de medicina general en tiempo real, 24/7**, con respuesta en menos de 2 minutos, en español e inglés. No necesitas oír.
- La **videollamada** es solo en español, así que no es el canal para ti.
- Pueden emitir **informes médicos digitales** que puedes presentar a tu seguro y, según el país, recetas electrónicas.

**Es orientación médica, no un seguro:** no cubre hospitalizaciones, ambulancias ni repatriaciones, y ante una emergencia hay que acudir a urgencias o llamar al número local. Para el seguro, mira [seguro de viaje para personas sordas](/seguro-de-viaje-para-sordos) y [Heymondo sin llamar por teléfono](/heymondo-sin-llamar-por-telefono).

## Consejos prácticos

- **Instala la eSIM antes de viajar, con WiFi**, y actívala al llegar (guía de [eSIMFLAG](/como-instalar-esimflag)). En iPhone, Holafly avisa de que puede activarse sola al instalarla.
- **Guarda el canal escrito de soporte** (WhatsApp o chat) y tu número de pedido en una captura.
- **Descarga mapas, traductor y subtítulos sin conexión** por si no hay red.
- **Mira qué red usa tu eSIM** en cada país ([eSIMFLAG Movistar](/esimflag-movistar)): donde no llega el operador, no hay datos con ninguna marca.
- **Si algo no conecta**, sigue los pasos de [eSIMFLAG no funciona](/esimflag-no-funciona).
- **Prepárate para una emergencia:** nuestro Kit de comunicación para emergencias en el extranjero (frases en 6 idiomas, ficha médica y pasos) lo recibes gratis al suscribirte al formulario de abajo.

## Nuestra recomendación

Para un viajero sordo, **el soporte por escrito y los datos estables importan más que el precio**. Las dos marcas cumplen en eso. **Holafly suma el chat médico incluido**; **eSIMFLAG suma precio, garantía de 30 días y compensación por cortes**. Elige según tu destino y lo que priorices, y no olvides tu seguro.

{boton_flag('Ver eSIMFLAG con 20 % de descuento')}

<BotonAfiliado
  href="{HOLAFLY_URL}"
  text="Ver planes de Holafly →"
>

Enlace de afiliado de Holafly: pega el código **MOCHILEANDO** en el carrito para un 5 % de descuento.

</BotonAfiliado>

## Preguntas frecuentes

{chr(10).join(f"### {q}{chr(10)}{chr(10)}{a}{chr(10)}" for q, a in faqs)}
"""
cuerpo = cuerpo.replace("hipoacúsia", "hipoacusia").replace("pensa en ello", "piensa en ello")
fm = f"""---
publishDate: 2026-10-08T23:00:00Z
title: "eSIM para viajeros sordos: datos, soporte escrito y consejos"
excerpt: "Qué eSIM elegir si eres sordo o hipoacúsico: datos estables, soporte por escrito 24/7, telemedicina por chat y consejos de quienes viajamos así."
image: ~/assets/images/esim-para-viajeros-sordos.webp
imageAlt: "Portada con el texto «eSIM para viajeros sordos: datos y soporte escrito» sobre fondo verde azulado y el logo de Mochileando sin Barreras"
category: eSIM para viajar
tags:
  - esims
  - viajar siendo sordo
  - accesibilidad
metadata:
  title: "eSIM para viajeros sordos: datos, soporte escrito y consejos"
faqs:
{faq_fm(faqs)}
---

import BotonAfiliado from '~/components/mdx/BotonAfiliado.astro';
import CajaAviso from '~/components/mdx/CajaAviso.astro';

"""
wr("src/data/post/esim-para-viajeros-sordos.mdx", fm + cuerpo.strip("\n") + "\n")
print("esim-para-viajeros-sordos", len((fm + cuerpo).split()), "palabras")
