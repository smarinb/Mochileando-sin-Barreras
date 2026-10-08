# Plan de contenidos Holafly (curación + contenido nuevo)

_8 de octubre de 2026. Fuentes: corpus oficial `esim.holafly.com/` (172 páginas, 106.000 palabras, rastreado el 8 de octubre), Search Console (export del 6 de octubre) y nuestros posts publicados. El corpus se ignora en git (ver `.gitignore`)._

## 1. Diagnóstico con datos de Search Console

Consultas con «holafly»: **52 consultas, 8.194 impresiones, 510 clics** en el periodo del export.

| Intención | Impresiones | Clics | Lectura |
| --- | ---: | ---: | --- |
| **eSIMFLAG vs / o Holafly** (10 variantes) | 2.799 | 297 | **No tenemos página propia.** Se posiciona 2-4 y capta clics con otras páginas. |
| **Saily vs / o Holafly** | 1.621 | 49 | `/saily-vs-holafly`: posición 4-9, CTR bajo (2-3 %). |
| **Roamic vs / o Holafly** | 1.093 | 149 | `/roamic-vs-holafly` funciona (CTR 11-19 %). |
| **Holafly opiniones / reseñas** | 1.098 | 4 | `/esim-holafly-opiniones` está en posición 12-15: **casi sin clics**. |
| **Airalo vs / o Holafly** | 900 | 2 | `/holafly-vs-airalo`: posición 7-15, **casi sin clics**. |
| Otras comparativas (Yesim, Truphone, Dent, Flexiroam, viajaresim) y «Holafly Movistar» | 436 | 4 | Sin cobertura. |
| **Alternativas a Holafly** | 84 | 1 | Sin cobertura. |

Páginas: `esim-holafly-opiniones` 3.023 impresiones, posición 10,4 y 18 clics; `holafly-vs-airalo` 2.779 impresiones, posición 8,8 y 11 clics. **La marca Holafly es lo que menos clics nos da de toda la categoría eSIM**, pese a ser lo que más se busca.

## 2. Datos oficiales verificados (octubre 2026)

| Tema | Dato oficial |
| --- | --- |
| Cobertura | **Más de 200 destinos** en eSIM por días; Holafly Plans y Always On, más de 160. |
| Productos | **eSIM por días** (prepago, de 1 a 90 días, sin renovación) y **Holafly Plans** (suscripción de 30 días, trimestral o anual: **Unlimited** o **Light de 25 GB**). |
| Precio | No hay tarifas en el corpus (se cargan dinámicamente). Ejemplo oficial: eSIM de Europa con datos ilimitados de 10 días, 34 €. |
| Activación | Se instala antes de viajar y se activa al llegar; **los días empiezan a contar al activarla en destino**. En iPhone con iOS 16.4 o superior puede activarse sola al instalarla: Holafly recomienda instalarla ya en destino o desactivar eSIM y roaming. |
| Llamadas y SMS | Las eSIM por días son **solo datos** (llamadas solo por VoIP). Los Plans **Unlimited comprados desde el 4 de noviembre de 2025** incluyen número de EE. UU., Reino Unido o Canadá para recibir SMS y llamar por VoIP. |
| Hotspot | Disponible en la mayoría de destinos, con un límite diario de datos que se ve en la ficha de cada destino. |
| Datos ilimitados | Política de uso justo del operador local: la reducción de velocidad dura como máximo un día. |
| Recargas | **No se puede recargar.** Para más tiempo hay que comprar otra eSIM (24 h antes de que caduque la actual). |
| Reembolso | eSIM por días: **hasta 6 meses desde la compra**, total o parcial según uso, 5-10 días hábiles. Plans: 14 días si no se ha usado (con excepciones). |
| Always On | **1 GB cada 30 días gratis** tras terminar el plan, en más de 160 destinos. Planes mensuales desde el 4 de noviembre de 2025 y eSIM por días desde el **16 de febrero de 2026**. |
| Telemedicina | **Novedad:** las eSIM por días compradas desde el **6 de octubre de 2026** incluyen **Meeting Doctors** (medicina general por chat 24/7 y videollamada, pediatría y otros chats) en destinos de América, Europa y otros (Argentina, Chile, México, Perú, EE. UU., España, Turquía, Uzbekistán…). Chat en español e inglés; videollamada en español. |
| AirHelp | Complemento de pago en eSIM por días: conservas el 100 % de la indemnización, hasta 600 € por pasajero, equipaje hasta 1.900 €. |
| HolaCoins y referidos | 10 % de lo que pagas se devuelve en HolaCoins; el amigo referido recibe un 10 % de descuento y quien refiere gana 500 HolaCoins (5 €). No se generan con Plans. |
| Estudiantes | Plan Unlimited con precio especial, pausable, y 1 GB extra al mes de por vida. |
| Cruceros | eSIM de Europa (16 países), Mediterráneo (7), Caribe (9) y Alaska (2). |
| Soporte | 24/7 por chat, WhatsApp y correo, en español. |

## 3. Errores y puntos débiles que hemos encontrado en nuestros contenidos

**Corregidos hoy**
- **Enlaces de afiliado:** los 30 enlaces (`holafly.sjv.io/xLR7K5`) pasan a **`https://holafly.sjv.io/oN4rme`**, el que indicaste. No quedan otros enlaces a Holafly en el sitio. El pilar de eSIM **no tenía ningún botón de Holafly**: añadido.
- **Pilar `/mejor-esim-para-viajar`:** decía «415 destinos» y «más del doble que eSIMFLAG». Holafly publica «más de 200». Corregido. También decía que Holafly funciona con «paquetes cerrados» y que un viaje de 11 días acaba en un plan de 15: **es falso**, se eligen de 1 a 90 días. Y el precio «~5 €/día» no tenía fuente: se sustituye por el ejemplo oficial (34 € por 10 días en Europa).
- **`/esim-holafly-opiniones`:** la FAQ de llamadas decía que no se puede llamar y omitía el número de EE. UU./Reino Unido/Canadá de los Plans.

**Pendientes (ver oleada 1)**
- `/esim-holafly-opiniones` y las tres comparativas dicen que el descuento por nuestro enlace es del **5 % automático**. **No hay fuente oficial de ese dato** y el enlace es nuevo: hay que confirmar con la plataforma de afiliados qué ventaja da `oN4rme` antes de afirmarlo.
- La **nota de Trustpilot (4,6 / 5)** no figura en el corpus oficial: verificarla antes de publicarla.
- Las comparativas (`holafly-vs-airalo`, `roamic-vs-holafly`, `saily-vs-holafly`) son genéricas («suele ser…»), no citan fuentes y no cubren lo que más cambia: activación, recargas, Always On, telemedicina, reembolso.
- `/esim-holafly-opiniones` no habla de **Holafly Plans**, **Always On**, **AirHelp**, **telemedicina** ni de la **política de reembolso** (6 meses).
- `/esim-japon` y `/esim-eeuu` mencionan Holafly sin ficha oficial del destino (el corpus no trae precios ni coberturas por país).

## 4. Contenido nuevo propuesto (por prioridad)

| # | Página | Intención y evidencia | Notas |
| --- | --- | --- | --- |
| 1 | **`/esimflag-vs-holafly`** | 2.799 impresiones, 297 clics, sin página. Posición 2-4 con otros contenidos. | Mayor retorno. Enlazar desde `/esimflag-opiniones` y `/esim-holafly-opiniones`. |
| 2 | **`/holafly-plans-suscripcion`** | Producto nuevo: Unlimited vs Light 25 GB, 30 días, cancelar 7 días antes, Always On, número de EE. UU./Reino Unido/Canadá. | Ninguna reseña lo cubre bien. |
| 3 | **`/holafly-consulta-medica-online`** | **Novedad del 6 de octubre de 2026.** Telemedicina por chat y videollamada en español: relevante para viajeros sordos (chat escrito). | Enlazar con `/seguro-de-viaje-para-sordos` y las guías de seguros. Verificar destinos al redactar. |
| 4 | **`/holafly-reembolso`** | Alta intención («holafly reembolso», «cómo pedirlo»): 6 meses, total o parcial, canales, plazos. | Complementa la comparativa de eSIM con garantía real. |
| 5 | **`/holafly-no-funciona`** | Solución de problemas: iPhone que se activa sola, roaming, APN, QR perdido, error de instalación. | Mucho material oficial (más de 20 páginas). |
| 6 | **`/alternativas-a-holafly`** | 84 impresiones y creciendo; intención comercial. | Eje: ilimitados (eSIMFLAG, Roamic), precio (Airalo), seguridad (Saily). |
| 7 | **`/holafly-moviles-compatibles`** | Larga cola: iPhone, Samsung, Pixel, Xiaomi, Huawei, Motorola… (el corpus tiene ~25 fichas). | Con tabla y aviso de bloqueo por operador. |
| 8 | **`/como-instalar-holafly`** | Guía paso a paso con la app (iOS 17.4 o superior) o con QR; cuándo instalar. | Capturas propias si es posible. |
| 9 | **`/holafly-airhelp`** | Complemento de pago frente a IATI AirHelp (ya tenemos `/iati-airhelp`). | Comparar con datos oficiales de ambos. |
| 10 | **`/holafly-llamadas-sms`** y **`/holafly-compartir-datos`** | FAQ muy buscadas: llamadas por VoIP, número de Plans, hotspot y sus límites. | Pueden ir como secciones de otras páginas. |
| 11 | **`/esim-estudiantes-erasmus`** | Plan Students de Holafly. | Enlazar con `/revolut-para-estudiantes` y `/n26-estudiantes-erasmus`. |
| 12 | **eSIM por destino** (Turquía, Tailandia, México, Europa, Latinoamérica) | «holafly esim japon», «holafly turquía opiniones». | **Falta el dato por país**: precio y cobertura; verificar en la web antes. |
| 13 | **`/holafly-es-seguro`** | Fiabilidad, privacidad, enrutamiento de tráfico. | Útil como FAQ de la reseña. |

## 5. Plan por oleadas

**Oleada 1 – Curación (poco coste, ya hay tráfico)**
1. Reescribir `/esim-holafly-opiniones` con datos oficiales: Plans, Always On, AirHelp, telemedicina, reembolso, activación en iPhone, FAQ nuevas. **Objetivo:** subir de la posición 10-15 y mejorar el CTR. Cambiar el título SEO.
2. Reescribir `/holafly-vs-airalo`, `/saily-vs-holafly` y `/roamic-vs-holafly`: tablas con datos verificados, sin «suele ser».
3. Confirmar el descuento real del enlace y la nota de Trustpilot.
4. Revisar `/esim-japon`, `/esim-eeuu` y el resto de menciones a Holafly.

**Oleada 2 – Nuevo con más retorno:** páginas 1, 2, 3 y 4.

**Oleada 3 – Soporte y larga cola:** páginas 5, 6, 7, 8 y 9.

**Oleada 4 – Segmentos:** páginas 10, 11, 12 y 13.

## 6. Reglas de contenido para esta oleada

- **Datos solo oficiales.** Si un dato no está en el corpus (precios por destino, Trustpilot, descuento del enlace), se dice «consulta el precio actual» o se verifica en la web.
- **Enlace único de afiliado:** `https://holafly.sjv.io/oN4rme`, con `rel="nofollow sponsored"` (lo aplica el sitio). Nada de enlaces «de invitación» propios de HolaCoins en las reseñas.
- **Interlinking mínimo:** pilar `/mejor-esim-para-viajar` (automático), 2 enlaces laterales entre comparativas y un puente comercial a seguro de viaje (telemedicina, AirHelp) o a tarjeta (pagar sin comisiones en la compra).
- **Transparencia:** declarar la afiliación cerca de cada botón y no prometer descuentos sin verificar.
- **Categoría exacta:** `category: eSIM para viajar`.
- **Fecha:** indicar «octubre de 2026» en todo dato que cambie (planes, Always On, telemedicina).

## 7. Estado: oleada 1 hecha (8 de octubre de 2026)

- **Datos de destino:** `docs/holafly-precios-2026-10-08.md` (415 fichas, escalones de precio, operadores de red).
- **Trustpilot:** la nota real es **4,7 / 5 con más de 114.000 reseñas** (comprobada por el titular). Actualizada en la reseña y en las comparativas.
- **`/esim-holafly-opiniones`:** nuevo título SEO y excerpt; instalación y activación con la guía oficial (incluido el aviso de iPhone); tabla de precios por 18 destinos; secciones de Holafly Plans, Always On, telemedicina, AirHelp, reembolso y compartir datos; descuento sin cifras no verificables, con HolaCoins y referidos oficiales; 7 FAQ nuevas.
- **Comparativas** (`holafly-vs-airalo`, `roamic-vs-holafly`, `saily-vs-holafly`): cobertura (+200 y +160), hotspot (1 GB al día), recargas, valoración y extras corregidos; caja con lo que ha cambiado en octubre de 2026.
- **`/esim-japon` y `/esim-eeuu`:** precio de Holafly a 15 días corregido (46,90 €) y sin el «5 % automático».
- **Descuento (confirmado por el titular el 8 de octubre de 2026):** el enlace de afiliado `oN4rme` **no aplica descuento solo**; el código **`MOCHILEANDO` da un 5 %** al pegarlo en «Código de descuento» en el carrito. Reflejado en la reseña, `/esim-japon`, `/esim-eeuu` y las tres comparativas, sin afirmar compatibilidad con otras ofertas.

