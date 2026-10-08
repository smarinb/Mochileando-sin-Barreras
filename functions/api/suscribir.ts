/**
 * Cloudflare Pages Function: alta en la lista de correo con doble confirmación (RGPD).
 * Comprueba el captcha (Cloudflare Turnstile) y pide a Brevo que envíe el correo de confirmación;
 * el contacto solo queda en la lista cuando pulsa el enlace de ese correo.
 *
 * Variables de entorno (Pages → Settings → Variables and Secrets):
 *   TURNSTILE_SECRET        clave secreta de Turnstile (la misma que usa /api/contacto)
 *   BREVO_API_KEY           API key de Brevo (obligatoria)
 *   BREVO_LIST_ID           id numérico de la lista «Newsletter» (obligatoria)
 *   BREVO_DOI_TEMPLATE_ID   id de la plantilla de confirmación (doble opt-in) de Brevo (obligatoria)
 *   SITE_URL                (opcional) por defecto https://mochileandosinbarreras.com
 *   DRY_RUN                 (solo pruebas) si existe, no se llama a Brevo
 *
 * Atributos de contacto que deben existir en Brevo (Contactos → Ajustes → Atributos), tipo texto:
 *   INTERES  (seguros | tarjetas | esim | alquiler | general)   ORIGEN  (ruta de la página donde se apuntó)
 */
interface Env {
  TURNSTILE_SECRET?: string;
  BREVO_API_KEY?: string;
  BREVO_LIST_ID?: string;
  BREVO_DOI_TEMPLATE_ID?: string;
  SITE_URL?: string;
  DRY_RUN?: string;
}
interface Ctx {
  request: Request;
  env: Env;
}

const SITE = 'https://mochileandosinbarreras.com';
const INTERESES = ['seguros', 'tarjetas', 'esim', 'alquiler', 'general'];

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export const onRequestPost = async ({ request, env }: Ctx): Promise<Response> => {
  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return json({ success: false, reason: 'formulario' }, 400);
  }

  // Campo trampa relleno = bot: éxito simulado sin hacer nada
  if (data.get('_honey')) return json({ success: true });

  if (!env.TURNSTILE_SECRET) return json({ success: false, reason: 'sin-secreto' }, 500);
  const token = String(data.get('cf-turnstile-response') || '');
  if (!token) return json({ success: false, reason: 'sin-captcha' }, 400);

  const check = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token, remoteip: request.headers.get('CF-Connecting-IP') || '' }),
  })
    .then((r) => r.json() as Promise<{ success?: boolean; 'error-codes'?: string[] }>)
    .catch(() => ({ success: false, 'error-codes': ['red'] }));
  if (!check.success) return json({ success: false, reason: 'captcha' }, 403);

  const email = String(data.get('email') || '').trim().toLowerCase().slice(0, 200);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ success: false, reason: 'email-no-valido' }, 400);

  // El consentimiento es obligatorio y expreso (casilla sin marcar de serie)
  if (data.get('consentimiento') !== 'on') return json({ success: false, reason: 'sin-consentimiento' }, 400);

  const interesRaw = String(data.get('interes') || 'general');
  const interes = INTERESES.includes(interesRaw) ? interesRaw : 'general';
  const origen = String(data.get('origen') || '').slice(0, 200);

  if (env.DRY_RUN) return json({ success: true });
  if (!env.BREVO_API_KEY || !env.BREVO_LIST_ID || !env.BREVO_DOI_TEMPLATE_ID) return json({ success: false, reason: 'sin-configurar' }, 500);

  const site = env.SITE_URL || SITE;
  const res = await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
    method: 'POST',
    headers: { 'api-key': env.BREVO_API_KEY, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      email,
      attributes: { INTERES: interes, ORIGEN: origen },
      includeListIds: [Number(env.BREVO_LIST_ID)],
      templateId: Number(env.BREVO_DOI_TEMPLATE_ID),
      redirectionUrl: `${site}/suscripcion-confirmada`,
    }),
  }).catch(() => null);

  if (res && res.ok) return json({ success: true });
  const detail = res ? (await res.text().catch(() => '')).replace(/\s+/g, ' ').slice(0, 140) : '';
  // 200 también en fallo para conservar el motivo (Cloudflare sustituye las respuestas 5xx de una Function)
  return json({ success: false, reason: `brevo:${res ? res.status : 'red'}:${detail}` });
};

export const onRequest = async ({ request, env }: Ctx): Promise<Response> =>
  request.method === 'POST' ? onRequestPost({ request, env }) : new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
