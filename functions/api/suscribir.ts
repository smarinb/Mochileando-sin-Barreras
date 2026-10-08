/**
 * Cloudflare Pages Function: paso 1 del alta en la lista (doble confirmación, RGPD).
 * Comprueba el captcha (Cloudflare Turnstile) y el consentimiento y envía un correo de confirmación con un enlace
 * firmado (HMAC). Hasta que la persona pulsa ese enlace NO se guarda nada: el contacto solo entra en Brevo en
 * /api/confirmar. El correo de confirmación se envía con Resend (el mismo servicio que usa /api/contacto).
 *
 * Variables de entorno (Pages → Settings → Variables and Secrets):
 *   TURNSTILE_SECRET   clave secreta de Turnstile (la misma que usa /api/contacto)
 *   RESEND_API_KEY     API key de Resend (la misma que usa /api/contacto)
 *   CONFIRM_SECRET     cadena aleatoria larga (≥ 32 caracteres) para firmar los enlaces de confirmación
 *   NEWSLETTER_FROM    (opcional) remitente; por defecto «Mochileando sin Barreras <contacto@mochileandosinbarreras.com>»
 *   SITE_URL           (opcional) por defecto https://mochileandosinbarreras.com
 *   DRY_RUN            (solo pruebas) si existe, no se envía nada
 */
interface Env {
  TURNSTILE_SECRET?: string;
  RESEND_API_KEY?: string;
  CONFIRM_SECRET?: string;
  NEWSLETTER_FROM?: string;
  SITE_URL?: string;
  DRY_RUN?: string;
}
interface Ctx {
  request: Request;
  env: Env;
}

const SITE = 'https://mochileandosinbarreras.com';
const FROM = 'Mochileando sin Barreras <contacto@mochileandosinbarreras.com>';
const INTERESES = ['seguros', 'tarjetas', 'esim', 'alquiler', 'general'];
const VALIDEZ_MS = 7 * 24 * 60 * 60 * 1000;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

const b64url = (bytes: ArrayBuffer | Uint8Array) => {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = '';
  for (const b of arr) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const firmar = async (secret: string, payload: string) => {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64url(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload)));
};

const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

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
  const faltan = [
    !env.RESEND_API_KEY && 'RESEND_API_KEY',
    !env.CONFIRM_SECRET && 'CONFIRM_SECRET',
    env.CONFIRM_SECRET && env.CONFIRM_SECRET.length < 32 && `CONFIRM_SECRET(${env.CONFIRM_SECRET.length}<32)`,
  ].filter(Boolean);
  if (faltan.length) return json({ success: false, reason: `sin-configurar:${faltan.join(',')}` }, 500);

  // Enlace firmado: contiene el correo, el interés, el origen y la caducidad. No se guarda en ningún sitio.
  const payload = b64url(new TextEncoder().encode(JSON.stringify({ e: email, i: interes, o: origen, x: Date.now() + VALIDEZ_MS })));
  const firma = await firmar(env.CONFIRM_SECRET as string, payload);
  const site = env.SITE_URL || SITE;
  const enlace = `${site}/api/confirmar?t=${payload}.${firma}`;

  const html = `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#1c2b2b;line-height:1.5">
<p style="font-size:20px;font-weight:bold">Confirma tu suscripción</p>
<p>Gracias por apuntarte a los avisos de <strong>Mochileando sin Barreras</strong>. Un último paso: confirma que este es tu correo y recibe gratis el <strong>Kit de comunicación para emergencias en el extranjero</strong>.</p>
<p style="margin:24px 0"><a href="${esc(enlace)}" style="background:#36A09F;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:8px;display:inline-block">Confirmar mi suscripción</a></p>
<p style="font-size:13px;color:#555">Si el botón no funciona, copia y pega este enlace en tu navegador:<br><a href="${esc(enlace)}" style="color:#2c8584;word-break:break-all">${esc(enlace)}</a></p>
<p style="font-size:13px;color:#555">Si no has sido tú, ignora este mensaje: no recibirás nada más y no guardamos tu correo. El enlace caduca en 7 días.</p>
<p style="font-size:12px;color:#777">Mochileando sin Barreras · mochileandosinbarreras.com</p></div>`;
  const text = `Confirma tu suscripción\n\nGracias por apuntarte a los avisos de Mochileando sin Barreras. Pulsa este enlace para confirmar tu correo y recibir gratis el Kit de comunicación para emergencias en el extranjero:\n\n${enlace}\n\nSi no has sido tú, ignora este mensaje: no recibirás nada más y no guardamos tu correo. El enlace caduca en 7 días.`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.NEWSLETTER_FROM || FROM,
      to: [email],
      subject: 'Confirma tu suscripción a Mochileando sin Barreras',
      text,
      html,
    }),
  }).catch(() => null);

  if (res && res.ok) return json({ success: true });
  const detail = res ? (await res.text().catch(() => '')).replace(/\s+/g, ' ').slice(0, 140) : '';
  // 200 también en fallo para conservar el motivo (Cloudflare sustituye las respuestas 5xx de una Function)
  return json({ success: false, reason: `resend:${res ? res.status : 'red'}:${detail}` });
};

export const onRequest = async ({ request, env }: Ctx): Promise<Response> =>
  request.method === 'POST' ? onRequestPost({ request, env }) : new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
