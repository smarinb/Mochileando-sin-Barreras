/**
 * Cloudflare Pages Function: recibe el formulario de /contacto, comprueba el token de Cloudflare Turnstile
 * (captcha invisible) y solo entonces reenvía el mensaje a FormSubmit, que lo entrega por correo.
 * Así los bots no pueden saltarse el captcha escribiendo directamente a FormSubmit.
 *
 * Variables de entorno (Pages → Settings → Variables and Secrets):
 *   TURNSTILE_SECRET  clave secreta del widget de Turnstile (obligatoria)
 *   DRY_RUN           (solo pruebas) si existe, no se reenvía nada
 */
interface Env {
  TURNSTILE_SECRET?: string;
  DRY_RUN?: string;
}
interface Ctx {
  request: Request;
  env: Env;
}

const EMAIL = 'equipo@mochileandosinbarreras.com';
const SITE = 'https://mochileandosinbarreras.com';
const FIELDS = ['nombre', 'email', 'asunto', 'mensaje'] as const;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export const onRequestPost = async ({ request, env }: Ctx): Promise<Response> => {
  const wantsJson = (request.headers.get('Accept') || '').includes('application/json');
  const done = (ok: boolean, status = ok ? 200 : 400, reason = '') =>
    wantsJson ? json({ success: ok, reason }, status) : Response.redirect(new URL(ok ? '/contacto?enviado=1' : '/contacto?error=1', request.url).toString(), 303);

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return done(false, 400, "formulario");
  }

  // Campo trampa relleno = bot: respuesta de éxito sin enviar nada
  if (data.get('_honey')) return done(true);

  if (!env.TURNSTILE_SECRET) return done(false, 500, "sin-secreto");
  const token = String(data.get('cf-turnstile-response') || '');
  if (!token) return done(false, 400, "sin-captcha");

  const check = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token, remoteip: request.headers.get('CF-Connecting-IP') || '' }),
  })
    .then((r) => r.json() as Promise<{ success?: boolean; "error-codes"?: string[] }>)
    .catch(() => ({ success: false, "error-codes": ["red"] }));
  if (!check.success) return done(false, 403, "captcha:" + (check["error-codes"] || []).join(","));

  const out = new FormData();
  for (const f of FIELDS) {
    const v = String(data.get(f) || '').trim().slice(0, f === 'mensaje' ? 5000 : 200);
    if (!v) return done(false, 400, "campo-" + f);
    out.set(f, v);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(out.get('email')))) return done(false);
  out.set('_subject', 'Nuevo mensaje desde mochileandosinbarreras.com');
  out.set('_template', 'table');
  out.set('_captcha', 'false');
  out.set('_replyto', String(out.get('email')));

  if (env.DRY_RUN) return done(true);

  const res = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
    method: 'POST',
    headers: { Accept: 'application/json', Origin: SITE, Referer: `${SITE}/contacto` },
    body: out,
  }).catch(() => null);
  const body = res ? ((await res.json().catch(() => ({}))) as { success?: string | boolean; message?: string }) : {};
  const ok = !!res && res.ok && body.success !== 'false' && body.success !== false;
  return done(ok, ok ? 200 : 502, ok ? '' : 'formsubmit:' + (res ? res.status : 'red') + ':' + String(body.message || '').slice(0, 120));
};

export const onRequest = async ({ request, env }: Ctx): Promise<Response> =>
  request.method === 'POST' ? onRequestPost({ request, env }) : new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
