/**
 * Cloudflare Pages Function: recibe el formulario de /contacto, comprueba el token de Cloudflare Turnstile
 * (captcha invisible) y solo entonces envía el mensaje por correo con la API de Resend.
 *
 * Variables de entorno (Pages → Settings → Variables and Secrets):
 *   TURNSTILE_SECRET  clave secreta del widget de Turnstile (obligatoria)
 *   RESEND_API_KEY    API key de Resend (obligatoria)
 *   CONTACT_TO        (opcional) destinatario; por defecto equipo@mochileandosinbarreras.com
 *   CONTACT_FROM      (opcional) remitente; por defecto contacto@mochileandosinbarreras.com,
 *                     que exige tener el dominio verificado en Resend
 *   DRY_RUN           (solo pruebas) si existe, no se envía nada
 */
interface Env {
  TURNSTILE_SECRET?: string;
  RESEND_API_KEY?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
  DRY_RUN?: string;
}
interface Ctx {
  request: Request;
  env: Env;
}

const TO = 'equipo@mochileandosinbarreras.com';
const FROM = 'Mochileando sin Barreras <contacto@mochileandosinbarreras.com>';
const FIELDS = ['nombre', 'email', 'asunto', 'mensaje'] as const;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');

export const onRequestPost = async ({ request, env }: Ctx): Promise<Response> => {
  const wantsJson = (request.headers.get('Accept') || '').includes('application/json');
  const done = (ok: boolean, status = ok ? 200 : 400, reason = '') =>
    wantsJson ? json({ success: ok, reason }, status) : Response.redirect(new URL(ok ? '/contacto?enviado=1' : '/contacto?error=1', request.url).toString(), 303);

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return done(false, 400, 'formulario');
  }

  // Campo trampa relleno = bot: respuesta de éxito sin enviar nada
  if (data.get('_honey')) return done(true);

  if (!env.TURNSTILE_SECRET) return done(false, 500, 'sin-secreto');
  const token = String(data.get('cf-turnstile-response') || '');
  if (!token) return done(false, 400, 'sin-captcha');

  const check = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token, remoteip: request.headers.get('CF-Connecting-IP') || '' }),
  })
    .then((r) => r.json() as Promise<{ success?: boolean; 'error-codes'?: string[] }>)
    .catch(() => ({ success: false, 'error-codes': ['red'] }));
  if (!check.success) return done(false, 403, 'captcha:' + (check['error-codes'] || []).join(','));

  const v: Record<string, string> = {};
  for (const f of FIELDS) {
    const value = String(data.get(f) || '').trim().slice(0, f === 'mensaje' ? 5000 : 200);
    if (!value) return done(false, 400, 'campo-' + f);
    v[f] = value;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) return done(false, 400, 'email-no-valido');

  if (env.DRY_RUN) return done(true);
  if (!env.RESEND_API_KEY) return done(false, 500, 'sin-api-key');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.CONTACT_FROM || FROM,
      to: [env.CONTACT_TO || TO],
      reply_to: v.email,
      subject: `Contacto web: ${v.asunto} (${v.nombre})`.slice(0, 200),
      text: `Nombre: ${v.nombre}\nEmail: ${v.email}\nAsunto: ${v.asunto}\n\n${v.mensaje}`,
      html: `<p><strong>Nombre:</strong> ${esc(v.nombre)}<br><strong>Email:</strong> ${esc(v.email)}<br><strong>Asunto:</strong> ${esc(v.asunto)}</p><p>${esc(v.mensaje)}</p>`,
    }),
  }).catch(() => null);

  if (res && res.ok) return done(true);
  const detail = res ? (await res.text().catch(() => '')).replace(/\s+/g, ' ').slice(0, 140) : '';
  // 200 también en fallo: Cloudflare sustituye por su página de error las respuestas 502 de una Function y se perdería el motivo.
  return done(false, 200, `resend:${res ? res.status : 'red'}:${detail}`);
};

export const onRequest = async ({ request, env }: Ctx): Promise<Response> =>
  request.method === 'POST' ? onRequestPost({ request, env }) : new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
