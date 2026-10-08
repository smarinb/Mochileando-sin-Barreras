# Estrategia de leads: lista de correo (Brevo)

_Decidida el 8 de octubre de 2026. Estado: **activado** (`NEWSLETTER_ENABLED = true`) con Brevo: lista id 3, plantilla de doble opt-in id 1. Política de privacidad y aviso legal actualizados. Pendiente: autenticar el dominio en Brevo y hacer la prueba real de punta a punta (sección 2, pasos 1 y 9)._

## 1. Decisiones

| Decisión | Elección | Por qué |
| --- | --- | --- |
| Servicio de correo | **Brevo** | Empresa europea (RGPD), formularios y automatizaciones, plan gratuito con límite diario de envíos (comprobar condiciones vigentes en su web). |
| Alta | **Doble confirmación** (doble opt-in) obligatoria | Exigencia práctica del RGPD y mejor entregabilidad. El contacto solo entra en la lista al pulsar el enlace del correo. |
| Gancho 1 | **Avisos de descuento reales** (Heymondo: Semana Santa, verano y Black Friday; IATI: Orange Friday y otras campañas) | Alta intención de compra, honesto y fácil de cumplir. Los datos salen de nuestras guías de descuento. |
| Gancho 2 | **Kit de comunicación para emergencias en el extranjero** (PDF, 5 páginas) | Único, alineado con la marca (viajera sorda) y útil aunque no compres nada. Se entrega al confirmar el correo. |
| Segmentación | Atributo `INTERES` (seguros, tarjetas, esim, alquiler, general) y `ORIGEN` (ruta de la página) | Mandar a cada persona lo que pidió. |
| Dónde | Al final de los posts de los 4 clústeres comerciales y en sus 4 páginas pilar | Es donde está la intención. **Sin popups ni exit-intent** (rendimiento y accesibilidad). |
| Captcha | Cloudflare Turnstile (ya usado en `/contacto`), cargado solo al interactuar con el formulario | Sin coste de rendimiento para quien no se suscribe. |

## 2. Pasos para activarlo

1. **Cuenta en Brevo** (con el correo corporativo) y verificar el dominio `mochileandosinbarreras.com` (registros SPF y DKIM en Cloudflare DNS; añadir DMARC).
2. **Remitente:** `Mochileando sin Barreras <hola@mochileandosinbarreras.com>` (o el que se prefiera).
3. En Brevo → Contactos:
   - Crear la **lista** «Newsletter» y anotar su id numérico.
   - Crear los **atributos** de contacto (tipo texto): `INTERES` y `ORIGEN`.
4. En Brevo → plantillas: crear una **plantilla de confirmación (doble opt-in)** en español, con el botón de confirmación que ofrece el editor, y anotar su id.
5. **API key** de Brevo (SMTP y API → Claves API).
6. En **Cloudflare Pages → Settings → Variables and Secrets** añadir:
   - `BREVO_API_KEY` (como secreto), `BREVO_LIST_ID`, `BREVO_DOI_TEMPLATE_ID`.
   - `TURNSTILE_SECRET` ya existe (lo usa `/api/contacto`).
7. **Completar la política de privacidad** (ver sección 6): quedan dos campos «RELLENAR» (domicilio y proveedor de correo) y hay que añadir el apartado del boletín.
8. En Brevo → Automatizaciones: crear la **secuencia de bienvenida** (sección 3), con disparador «contacto añadido a la lista».
9. Poner `NEWSLETTER_ENABLED = true`, construir, desplegar y **probar de punta a punta** con un correo propio: formulario → correo de confirmación → página `/suscripcion-confirmada` → descarga del kit → correo 1.
10. Comprobar en Brevo que el contacto aparece en la lista con `INTERES` y `ORIGEN` rellenos.

> Nota técnica: la función `/api/suscribir` llama a la API de Brevo de doble confirmación. Se ha probado con peticiones simuladas (validación, captcha, consentimiento, trampa antispam, atributos), pero **no contra Brevo real**: el paso 9 es imprescindible.

## 3. Secuencia de bienvenida (borradores)

Tono: cercano, honesto y sin urgencia falsa. Todos los correos llevan **baja en un clic** y, cuando haya enlaces de afiliado, **aviso de afiliación**. Asuntos orientativos.

**Correo 1 · inmediato (tras confirmar).** Asunto: «Tu kit de comunicación para emergencias»
- Bienvenida de Cris y Sergio en 3 líneas (quiénes somos, viajamos en camper, ella es sorda).
- Enlace al kit: `/descargas/kit-comunicacion-emergencias.pdf`. Cómo usarlo (guardarlo en el móvil, imprimir la ficha).
- Qué recibirá de nosotros y con qué frecuencia. Invitación a responder con su próximo destino.

**Correo 2 · día 2.** Asunto: «Lo que casi nadie mira antes de contratar un seguro de viaje»
- Tres errores reales: capital médico según destino, preexistentes, deportes. Enlace a [seguro de viaje barato](/seguro-de-viaje-barato) y [seguro de viaje para sordos](/seguro-de-viaje-para-sordos).

**Correo 3 · día 5.** Asunto: «Cómo comparamos Heymondo e IATI con precios reales»
- Resumen de las 31 simulaciones y del escalón de los 31 días. Enlace a [Heymondo o IATI](/heymondo-o-iati). Aviso de afiliación.

**Correo 4 · día 8.** Asunto: «El descuento que se aplica solo (y el que no existe)»
- Explicar que no hay códigos, el 5 % del enlace y las campañas. Enlaces a [descuento Heymondo](/descuento-heymondo) y [descuento IATI](/descuento-iati). Aviso de afiliación.
- Promesa concreta: «te escribiremos cuando haya una campaña real».

**Correo 5 · día 12.** Asunto: «¿A dónde viajas?»
- Pregunta abierta con enlaces de segmentación (Latinoamérica, Asia, Europa, camper, viaje largo). Los clics actualizan el atributo/etiqueta del contacto. Cierra con tarjetas y eSIM según `INTERES`.

## 4. Campañas recurrentes

| Cuándo | Qué | Para quién |
| --- | --- | --- |
| Campañas reales de descuento (Semana Santa, verano, Black Friday, Orange Friday) | Aviso con fechas **verificadas** el mismo día y enlace a la guía de descuento | `INTERES` = seguros |
| Cambio de comisiones o condiciones oficiales (N26, Revolut, Wise, imagin) | Resumen de qué cambia y a quién afecta | `INTERES` = tarjetas |
| 1 al mes | Un contenido útil (guía nueva, error frecuente, ruta) | Todos |

Reglas: no inventar descuentos ni urgencia, verificar cada campaña en la web oficial antes de enviar, y no mandar más de 1-2 correos al mes fuera de las campañas.

## 5. Métricas (revisar a las 4-6 semanas)

- Tasa de suscripción por página (`ORIGEN`) y por clúster (`INTERES`).
- Tasa de confirmación (doble opt-in): si baja del 50-60 %, revisar el asunto del correo de confirmación y su entregabilidad.
- Apertura, clics y bajas de la secuencia de bienvenida.
- Clics a enlaces de afiliado y conversiones por campaña.

## 6. Requisitos legales (revisar con asesor)

**Antes de activar:** la política de privacidad actual afirma que el sitio «no dispone de comentarios, boletín ni tienda propia» y tiene dos campos pendientes (domicilio y proveedor de correo). Hay que rellenarlos y aplicar este texto.

*En el apartado 2 (qué datos tratamos):*
> **Boletín por correo electrónico.** Si te suscribes, tratamos tu correo electrónico, el interés que elijas (seguros, tarjetas, eSIM, alquiler o general) y la página desde la que te apuntas, para enviarte avisos y contenidos sobre seguros, tarjetas, eSIM y viajes accesibles. La base jurídica es tu consentimiento (art. 6.1.a RGPD), que confirmas con un correo de doble confirmación y que puedes retirar en cualquier momento con el enlace de baja de cada correo. El formulario usa Cloudflare Turnstile para evitar el spam.

*Sustituir la frase «no dispone de comentarios, boletín ni tienda propia» por «no dispone de comentarios ni tienda propia».*

*En el apartado 3 (conservación):*
> Los datos del boletín se conservan hasta que te des de baja. Después, solo guardamos lo mínimo para acreditar el consentimiento durante los plazos legales.

*En el apartado 4 (encargados):*
> **Envío de correos del boletín:** Brevo (Sendinblue SAS, Francia).

Otros puntos:
- Los correos con enlaces de afiliado deben **declararlo**, igual que en la web.
- Revisar los **términos de cada programa de afiliados** (Heymondo, IATI, N26, etc.): algunos exigen aprobación o condiciones para promocionar por correo.
- No importar contactos de otras fuentes ni comprar listas.
- Registrar la fecha y el origen del consentimiento (Brevo guarda la confirmación del doble opt-in).

## 7. Archivos del proyecto

| Archivo | Función |
| --- | --- |
| `src/data/newsletter.ts` | Interruptor `NEWSLETTER_ENABLED`, textos por interés y mapa clúster → interés. |
| `src/components/common/Suscripcion.astro` | Formulario accesible (consentimiento sin marcar, trampa antispam, Turnstile diferido, mensajes `aria-live`). |
| `functions/api/suscribir.ts` | Función de Cloudflare Pages: valida captcha y consentimiento y pide a Brevo la doble confirmación. |
| `src/pages/suscripcion-confirmada.astro` | Destino de la confirmación: entrega el kit. `noindex` y fuera del sitemap. |
| `public/descargas/kit-comunicacion-emergencias.pdf` | El kit. Se genera con `docs/leads/generar-kit.py` + impresión a PDF con Edge. |
| `docs/leads/` | Fuente del kit (HTML y script). |
