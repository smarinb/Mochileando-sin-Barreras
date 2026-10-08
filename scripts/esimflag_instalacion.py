# -*- coding: utf-8 -*-
"""Genera las guías de eSIMFLAG: compatibilidad, instalación y solución de problemas (octubre de 2026).

Fuentes: ayuda y verificar-compatibilidad de esimflag.com (corpus local + páginas públicas). Uso: python scripts/esimflag_instalacion.py
Requiere esimflag.com/prices/compat.json (lista oficial de móviles y tablets).
"""
import json

FLAG_URL = (
    "https://clk.tradedoubler.com/click?p=383157&a=3480944&url=http%3A%2F%2Fwww.esimflag.com%2Fpartners%2Ftd%3Fdiscount%3DMOCHILEANDOSINBARRERAS"
    "%26utm_source%3Dmochileandosinbarreras%26utm_medium%3Daffiliatte%26utm_content%3Dtradedoubler_es"
)
HOY = "2026-10-08T22:00:00Z"
FECHA = "octubre de 2026"
COMPAT = json.load(open("esimflag.com/prices/compat.json", encoding="utf-8"))


def faq_fm(faqs):
    return "\n".join(f'  - q: "{q}"\n    a: "{a.replace(chr(34), chr(92) + chr(34))}"' for q, a in faqs)


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


def boton_flag(texto="Ver eSIMFLAG con 20 % de descuento"):
    return f'<BotonAfiliado\n  href="{FLAG_URL}"\n  text="{texto}"\n>\n\nEnlace de afiliado de eSIMFLAG: el 20 % se aplica solo al entrar desde aquí y a nosotros nos pagan una comisión sin coste extra para ti.\n\n</BotonAfiliado>'


# =====================================================================================
# 1. Compatibilidad
# =====================================================================================
nombres = {"Apple": "Apple (iPhone)", "Asus": "Asus", "Fairphone": "Fairphone", "Google": "Google (Pixel)", "Honor": "Honor", "Huawei": "Huawei", "Motorola": "Motorola", "Nokia": "Nokia", "OnePlus": "OnePlus", "Oppo": "Oppo", "Oukitel": "Oukitel", "Realme": "Realme", "Samsung": "Samsung (Galaxy)", "Sony": "Sony (Xperia)", "TCL": "TCL", "Vivo": "Vivo", "Xiaomi": "Xiaomi, Redmi y POCO", "ZTE": "ZTE"}
filas = [f"| **{nombres.get(b, b)}** | {len(v)} | {', '.join(v)} |" for b, v in COMPAT["Móvil"].items()]
TAB_MOVIL = "| Marca | Modelos | Modelos que eSIMFLAG indica como compatibles |\n| :--- | ---: | :--- |\n" + "\n".join(filas)
filas = [f"| **{b}** | {', '.join(v)} |" for b, v in COMPAT["Tablet"].items()]
TAB_TABLET = "| Marca | Modelos |\n| :--- | :--- |\n" + "\n".join(filas)
n_moviles = sum(len(v) for v in COMPAT["Móvil"].values())

faqs = [
    ("¿Cómo sé si mi móvil es compatible con eSIMFLAG?", "Busca tu modelo en la lista oficial de eSIMFLAG (la reproducimos en esta guía) y comprueba además que tu móvil esté liberado. Una comprobación rápida: marca *#06# y, si aparece un EID, tu móvil tiene eSIM. En iPhone, mira Ajustes > General > Información."),
    ("¿Qué iPhone son compatibles con eSIMFLAG?", "Según su lista oficial, desde el iPhone XR y XS hasta el iPhone 17 y iPhone Air, incluidos los SE de 2020 y 2022. Solo el iPhone Air (modelo A3518) puede usar eSIM en China continental."),
    ("¿Mi Samsung es compatible con eSIMFLAG?", "La lista incluye Galaxy S20+, S20 Ultra, S21 en adelante, Note 20, Z Fold y Z Flip, y algunos A. Pero el S20 FE no es compatible, y los S20/S21 dependen del chip o versión, y los modelos vendidos en EE. UU., Hong Kong o Corea pueden no soportar eSIM."),
    ("¿Los móviles comprados en China o Hong Kong sirven?", "Normalmente no. eSIMFLAG avisa de que los modelos vendidos en China, Hong Kong y otros países asiáticos suelen no ser compatibles con eSIM. Verifica tu modelo exacto."),
    ("¿Mi móvil tiene que estar liberado?", "Sí. eSIMFLAG recomienda comprobar que tu móvil esté desbloqueado y pueda usar SIM y eSIM de otros operadores."),
    ("¿Se puede usar eSIMFLAG en una tablet?", "Sí, en iPad y Galaxy Tab compatibles, pero solo en las versiones con conectividad celular (Cellular)."),
    ("¿Qué hago si mi móvil no aparece en la lista?", "Pregunta por el chat de ayuda de eSIMFLAG antes de comprar. Y recuerda que su garantía de 30 días cubre el caso de un dispositivo no compatible."),
]
cuerpo = f"""
**Antes de comprar una eSIM, comprueba que tu móvil la admite.** Es el error más caro de evitar: pagar y descubrir en el aeropuerto que tu teléfono no tiene eSIM o está bloqueado. Esta guía reproduce la **lista oficial de eSIMFLAG** ({n_moviles} móviles y {sum(len(v) for v in COMPAT['Tablet'].values())} tablets, {FECHA}) y te explica cómo comprobar el tuyo.

<CajaAviso tipo="info" titulo="En 30 segundos">

**1.** Busca tu modelo en la tabla de abajo. **2.** Comprueba que esté **liberado** (no bloqueado por tu operadora). **3.** Evita los modelos vendidos en **China, Hong Kong u otros países asiáticos** (suelen no tener eSIM). **4.** Si dudas, marca `*#06#` y mira si aparece un **EID**.

</CajaAviso>

{boton_flag()}

<Indice />

## Cómo comprobar si tu móvil tiene eSIM

- **iPhone:** Ajustes > General > Información. Si ves una línea «SIM digital» o un número **EID**, tiene eSIM.
- **Android:** marca `*#06#` en el teléfono. Si aparece un **EID**, tu móvil admite eSIM. Los menús varían según la marca (en Samsung, Ajustes > Conexiones > Administrador de SIM).
- **Liberado:** tu móvil debe poder usar SIM y eSIM de otros operadores. Si lo compraste a plazos con una operadora, confirma que no esté bloqueado.

## Móviles compatibles según eSIMFLAG

{TAB_MOVIL}

### Avisos que hace eSIMFLAG sobre modelos concretos

- **Apple:** solo el iPhone Air (modelo A3518) puede usar eSIM en China continental.
- **Google Pixel:** los Pixel vendidos en Hong Kong/Asia y las versiones de EE. UU., Australia, Japón y Taiwán (Pixel 3 y 3a) suelen **no** aceptar eSIM.
- **Samsung:** los modelos vendidos en EE. UU., Hong Kong y Corea pueden no soportar eSIM; **el S20 FE (4G/5G) no es compatible**, y los S20 y S21 dependen del chip o la versión.
- **Huawei:** no son compatibles el P40 Pro+ ni el P50 Pro.
- **Motorola:** los modelos vendidos en EE. UU. suelen estar limitados por operador.
- **Oppo:** la serie Lite no trae eSIM.
- **Oukitel:** solo versiones LTE UK/EU con soporte eSIM.

## Tablets compatibles

{TAB_TABLET}

En iPad y Galaxy Tab, solo las versiones con conectividad celular (**Cellular**) admiten eSIM.

## Lo que no encontrarás en la lista

La lista oficial no incluye los **iPhone X, 8 y 7** ni anteriores (no tienen eSIM). Y no es exhaustiva: si tu modelo no figura, pregunta antes por el chat de ayuda de eSIMFLAG. Puedes consultar siempre la [lista oficial](https://www.esimflag.com/es/verificar-compatibilidad).

## Y si no es compatible

La eSIM de eSIMFLAG tiene una **garantía de 30 días**: si el dispositivo no es compatible, te devuelven el dinero (reembolso en 5 a 10 días laborables, que se pide por WhatsApp o chat web). Lo explicamos en nuestra [reseña de eSIMFLAG](/esimflag-opiniones). Cuando tengas claro que tu móvil sirve, sigue con [cómo instalar eSIMFLAG paso a paso](/como-instalar-esimflag) y, si algo falla, con [eSIMFLAG no funciona](/esimflag-no-funciona).

{boton_flag()}
"""
post(
    "esimflag-compatibilidad",
    "¿Mi móvil es compatible con eSIMFLAG? Lista oficial 2026",
    "Lista oficial de móviles y tablets compatibles con eSIMFLAG, cómo comprobar si tu teléfono tiene eSIM y qué modelos suelen fallar.",
    "Portada con el texto «¿Mi móvil es compatible con eSIMFLAG?» sobre fondo verde azulado y el logo de Mochileando sin Barreras",
    ["esims", "esimflag", "compatibilidad"],
    faqs,
    cuerpo,
)

# =====================================================================================
# 2. Cómo instalar
# =====================================================================================
faqs = [
    ("¿Cuándo debo instalar la eSIM de eSIMFLAG?", "Su guía recomienda instalarla justo después de la compra, antes de viajar, con WiFi. La instalación y la activación son pasos distintos: el plan de datos se activa cuando llegas al destino y te conectas a la red local."),
    ("¿Cómo se instala la eSIM de eSIMFLAG en iPhone?", "Con iOS 17.4 o superior, desde tu área de cliente en «Tus eSIM» > «Instalar eSIM» > instalación automática. En versiones anteriores, con el código QR del correo o de forma manual. Después, en el avión o al llegar, elige la eSIM como línea de datos, activa su roaming y desactívalo en tu línea habitual."),
    ("¿Cómo se instala la eSIM de eSIMFLAG en Android?", "Con Android 16 o superior, desde «Tus eSIM» en tu área de cliente, pulsando «Instalar eSIM». En otras versiones, con el QR o manualmente. Después, en Ajustes > Conexiones > Administrador de SIM > Datos móviles, elige eSIMFLAG y activa el roaming de datos en Redes móviles (los menús varían según la marca)."),
    ("¿Cuándo empiezan a contar los días de mi plan?", "Según su guía, el plan de datos se activa cuando llegas a tu destino y la eSIM se conecta a la red local. Te avisan con un SMS gratuito la primera vez que te conectas y 24 horas antes de que termine."),
    ("¿Necesito conexión a internet para instalar la eSIM?", "Sí, la instalación necesita WiFi o datos. Los ajustes finales (activar el roaming de la eSIM y desactivarlo en tu línea habitual) no la necesitan y se pueden hacer en el avión."),
    ("¿Cuántas eSIM puedo tener activas?", "En iPhone, eSIMFLAG indica un máximo de 2 líneas activas por dispositivo: si tienes más, tendrás que elegir cuáles dejar activas."),
    ("¿Qué hago si no consigo escanear el QR?", "Prueba la instalación manual o la automática desde tu área de cliente si tu sistema es compatible, y si sigue sin funcionar escribe a su soporte por WhatsApp o chat web («Ya soy cliente» > «Cómo empiezo a usar la eSIM»)."),
]
cuerpo = f"""
**Instalar la eSIM de eSIMFLAG lleva unos minutos**, pero conviene hacerlo bien y **antes de salir de casa**. Esta guía sigue los pasos oficiales de su web ({FECHA}) para **iPhone y Android**, con la instalación automática, el código QR y el método manual, y te cuenta los ajustes finales que evitan quedarte sin datos al aterrizar.

<CajaAviso tipo="info" titulo="Los 5 pasos, en corto">

**1.** Comprueba que tu móvil es [compatible](/esimflag-compatibilidad) y está liberado. **2.** Compra el plan y **instala la eSIM justo después, con WiFi**. **3.** En el avión o al llegar, **elige la eSIM como línea de datos**. **4.** **Activa el roaming de datos** en la eSIM y **desactívalo en tu línea habitual**. **5.** Al conectarte, eSIMFLAG te envía un **SMS gratuito** de confirmación.

</CajaAviso>

{boton_flag()}

<Indice />

## Antes de instalar

- **Móvil compatible y liberado.** Consulta la [lista oficial de modelos](/esimflag-compatibilidad).
- **Conexión WiFi** para la instalación.
- **Tu correo de compra y la cuenta de cliente** de eSIMFLAG, donde está el QR y el botón de instalación automática.
- **Una eSIM por persona**: cada viajero necesita la suya.

## Opción 1: instalación automática (la más fácil)

Solo en **iPhone con iOS 17.4 o superior** y **Android 16 o superior**. Hay que iniciar sesión en tu área de cliente.

1. **Inicia sesión** en la web de eSIMFLAG.
2. Ve a **«Tus eSIM»** y pulsa **«Instalar eSIM»**.
3. En la pestaña de instalación automática, **pulsa el botón** y continúa.
4. **En iPhone**, selecciona un máximo de **2 líneas activas** por dispositivo y ponle una etiqueta a la eSIM (por ejemplo, «eSIMFLAG viaje»).
5. En **Android**, la eSIM aparecerá en Ajustes y en «Tus eSIM». Sus instrucciones están basadas en un Samsung y pueden variar según la marca.

Los datos ilimitados **se ponen en marcha cuando llegas al destino**: la instalación no gasta días.

## Opción 2: código QR

Es el método clásico: escanea el **QR que te llega por correo** desde otra pantalla (ordenador o tablet). Estos son los pasos generales del sistema, que pueden variar según la versión o la marca; eSIMFLAG los detalla en su ayuda:

- **iPhone:** Ajustes > Datos móviles > Añadir eSIM > Usar código QR.
- **Android (Samsung):** Ajustes > Conexiones > Administrador de SIM > Añadir eSIM > Escanear código QR.

Si **no puedes escanear el QR**, usa la instalación manual o la automática, o pídele ayuda a su soporte.

## Opción 3: instalación manual

Si el QR no funciona, eSIMFLAG permite instalar la eSIM de forma manual, con los datos de activación que te facilitan (consulta tu correo de compra o su ayuda). Según su web, es «un poco más largo, pero igual de sencillo».

## Ajustes finales: en el avión o al llegar

Es el paso que más gente olvida. Según su guía, hazlo **cuando ya saliste de tu país, pero antes de llegar** (por ejemplo, en el avión). **No necesitas conexión a internet** para esto:

1. **Ajustes > Datos móviles:** selecciona **eSIMFLAG como línea de datos**.
2. **Activa la itinerancia de datos** de la eSIM (Android, Samsung: Ajustes > Conexiones > Redes móviles).
3. **Desactiva la itinerancia de datos** en tu línea habitual, para no pagar roaming.

Después, la eSIM se activa sola al llegar y se conecta a la red local.

## Cómo saber que está funcionando

- Recibirás un **SMS gratuito la primera vez que te conectes**, con la confirmación del plan.
- Recibirás **otro SMS sin coste cuando te queden 24 horas** para que termine.
- Si **10 minutos después de llegar** no tienes conexión, reinicia el móvil, actualiza el sistema y revisa el APN. Tienes los pasos en [eSIMFLAG no funciona](/esimflag-no-funciona).

## Consejos nuestros

- **No improvises en el aeropuerto:** instálala en casa con WiFi.
- **No borres la eSIM del móvil por error** una vez instalada: puede dar problemas para volver a usarla.
- **Anota el soporte:** WhatsApp o chat web, las 24 horas. Es un canal escrito, muy cómodo para viajeros sordos o con hipoacusia.
- Para conocer qué red usa en tu destino, mira [eSIMFLAG Movistar](/esimflag-movistar); y para decidir entre marcas, [eSIMFLAG vs Holafly](/esimflag-vs-holafly).

{boton_flag()}
"""
post(
    "como-instalar-esimflag",
    "Cómo instalar y activar eSIMFLAG en iPhone y Android",
    "Cómo instalar y activar eSIMFLAG paso a paso en iPhone y Android: instalación automática, QR, manual y los ajustes finales para conectar al llegar.",
    "Portada con el texto «Cómo instalar y activar eSIMFLAG» sobre fondo verde azulado y el logo de Mochileando sin Barreras",
    ["esims", "esimflag", "instalacion"],
    faqs,
    cuerpo,
)

# =====================================================================================
# 3. No funciona
# =====================================================================================
faqs = [
    ("¿Por qué eSIMFLAG no funciona al llegar?", "Las causas más habituales son que la eSIM no esté seleccionada como línea de datos, que falte activar el roaming de datos en ella, que el móvil no detecte el APN o que no haya cobertura del operador local. Su guía recomienda esperar 10 minutos, reiniciar, actualizar el sistema y configurar el APN."),
    ("¿Cuál es el APN de eSIMFLAG?", "Según su guía oficial: Nombre «esimflag» y APN «esimflag». Se añade en Ajustes > Conexiones > Redes móviles > Nombre de los puntos de acceso (en Android; los menús varían según la marca)."),
    ("¿Qué hago si no tengo datos pero la eSIM está instalada?", "Comprueba que la eSIM es la línea de datos, que tiene el roaming de datos activado y que el roaming de tu línea habitual está desactivado. Activa y desactiva el modo avión y reinicia. Si pasan más de 10 minutos, configura el APN."),
    ("¿Cómo contacto con el soporte de eSIMFLAG?", "Por WhatsApp o por el chat de su web, las 24 horas. Elige «Ya soy cliente» y después la opción que corresponda (por ejemplo, «Cómo empiezo a usar la eSIM»). Necesitarán tu correo y el número de pedido."),
    ("¿Me devuelven el dinero si no funciona?", "Su web anuncia una garantía de 30 días si no puedes disfrutar del servicio por un problema técnico, y una compensación automática si hay una interrupción de más de 6 horas. La devolución se pide por WhatsApp o chat web y llega en 5 a 10 días laborables."),
    ("¿Y si mi móvil no es compatible?", "Si tu dispositivo no es compatible, también cubre la garantía de devolución. Comprueba antes tu modelo en nuestra guía de compatibilidad."),
    ("¿Cuándo es un fallo de la red y no de la eSIM?", "Cuando estás en una zona sin cobertura del operador local (por ejemplo, tramos rurales de la Patagonia o la Carretera Austral). Ninguna eSIM que use ese operador te dará datos allí. Mira qué red usa eSIMFLAG en tu destino."),
]
cuerpo = f"""
**Aterrizas, enciendes el móvil y no hay internet.** Le ha pasado a casi todo el que usa eSIM, y casi siempre se arregla con unos ajustes. Esta guía recoge los **pasos oficiales de eSIMFLAG** ({FECHA}) para cuando no conecta, en orden, y te cuenta cuándo el problema no es tu móvil sino la red del país.

<CajaAviso tipo="info" titulo="Lo primero, en 2 minutos">

**1.** **Espera 10 minutos** tras aterrizar. **2.** **Reinicia el móvil** y actualiza el sistema. **3.** Comprueba que la eSIM es tu **línea de datos** y que tiene el **roaming de datos activado** (y desactivado en tu línea habitual). **4.** Si sigue igual, configura el **APN `esimflag`**. **5.** Si nada funciona, escribe a su **soporte por WhatsApp**.

</CajaAviso>

{boton_flag("Ver eSIMFLAG con 20 % de descuento")}

<Indice />

## Paso 1: espera y reinicia

Según su guía, la eSIM puede tardar un poco en engancharse a la red local. **Si 10 minutos después de llegar** sigues sin conexión:

- **Reinicia el móvil.**
- Asegúrate de tener **la última actualización del sistema operativo**.
- Activa y desactiva el **modo avión** para forzar una nueva conexión (consejo habitual; no figura en su guía).

## Paso 2: revisa los ajustes de la eSIM

La causa más frecuente. Comprueba:

1. **La eSIM está activa** (iPhone: Ajustes > Datos móviles; Android Samsung: Ajustes > Conexiones > Administrador de SIM).
2. **Está seleccionada como línea de datos móviles**, no tu línea habitual.
3. **Tiene la itinerancia de datos activada** (Ajustes > Datos móviles > Opciones, en iPhone; Ajustes > Conexiones > Redes móviles, en Android).
4. **Tu línea habitual tiene la itinerancia de datos desactivada**, para no pagar roaming ni que el móvil cambie solo de línea.

## Paso 3: configura el APN

Si tu móvil no detecta el APN automáticamente, añádelo a mano. La guía de eSIMFLAG indica estos pasos (en Android; los menús varían según la marca):

1. **Ajustes > Conexiones > Redes móviles > Nombre de los puntos de acceso.**
2. Pulsa el símbolo **«+»** para añadir un punto de acceso nuevo.
3. En **Nombre**, escribe **esimflag**.
4. En **APN**, escribe **esimflag**.
5. Guarda y selecciona ese punto de acceso.

## Paso 4: descarta que sea la red, no la eSIM

Una eSIM de viaje se conecta al **operador local** del país. Si estás en una zona sin cobertura de ese operador, **no habrá datos con ninguna eSIM que use esa red**. Es lo que nos pasó en tramos de la Patagonia y la Carretera Austral. Mira qué red usa eSIMFLAG en tu destino en [eSIMFLAG Movistar](/esimflag-movistar).

## Paso 5: contacta con su soporte

- **WhatsApp o chat web, las 24 horas.** Elige **«Ya soy cliente»** y la opción que corresponda (por ejemplo, **«Cómo empiezo a usar la eSIM»**) y tu sistema operativo.
- Si hace falta, te asignan **una persona** que te ayuda paso a paso. Al ser un canal escrito, es cómodo si eres sordo o tienes hipoacusia.
- Ten a mano **tu correo de compra y el número de pedido**.

## Si no se arregla: tus derechos

Según su web y sus condiciones generales:

- **Garantía de 30 días:** te devuelven el dinero si no puedes disfrutar del servicio por un problema técnico (o si tu móvil no era compatible). La devolución se pide en «Ya soy cliente» > «Solicitar una devolución» y llega en **5 a 10 días laborables**.
- **Compensación automática por cortes:** si el servicio se interrumpe más de 6 horas en horario de 8 a 22 (hora local), tienes derecho a una compensación. Hay que reclamarla **en los 10 días siguientes**.
- No garantizan la calidad de la red del operador ni la cobertura fuera de las zonas indicadas.

Más detalles en nuestra [reseña de eSIMFLAG](/esimflag-opiniones). Y si todavía no la has instalado, mira [cómo instalar eSIMFLAG](/como-instalar-esimflag) y la [lista de móviles compatibles](/esimflag-compatibilidad).

{boton_flag()}
"""
post(
    "esimflag-no-funciona",
    "eSIMFLAG no funciona: soluciones paso a paso (2026)",
    "Si eSIMFLAG no funciona al llegar: espera, reinicia, activa el roaming de la eSIM, configura el APN esimflag y qué hacer si no hay cobertura.",
    "Portada con el texto «eSIMFLAG no funciona: soluciones paso a paso» sobre fondo verde azulado y el logo de Mochileando sin Barreras",
    ["esims", "esimflag", "problemas"],
    faqs,
    cuerpo,
)
