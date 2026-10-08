/**
 * Cloudflare Pages Function: paso 2 del alta (doble confirmación). Recibe el enlace firmado del correo de
 * /api/suscribir, comprueba la firma y la caducidad y solo entonces da de alta el contacto en la lista de Brevo.
 *
 * Variables de entorno:
 *   CONFIRM_SECRET   la misma cadena que usa /api/suscribir
 *   BREVO_API_KEY    API key de Brevo
 *   BREVO_LIST_ID    id numérico de la lista «Newsletter»
 *   SITE_URL         (opcional) por defecto https://mochileandosinbarreras.com
 *   DRY_RUN          (solo pruebas) si existe, no se llama a Brevo
 */
interface Env {
  CONFIRM_SECRET?: string;
  BREVO_API_KEY?: string;
  BREVO_LIST_ID?: string;
  SITE_URL?: string;
  DRY_RUN?: string;
}
interface Ctx {
  request: Request;
  env: Env;
}

const SITE = 'https://mochileandosinbarreras.com';
const INTERESES = ['seguros', 'tarjetas', 'esim', 'alquiler', 'general'];

const b64url = (bytes: ArrayBuffer | Uint8Array) => {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = '';
  for (const b of arr) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const desdeB64url = (s: string) => {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (s.length % 4)) % 4));
  return new Uint8Array([...bin].map((c) => c.charCodeAt(0)));
};

const firmar = async (secret: string, payload: string) => {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64url(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload)));
};

const igual = (a: string, b: string) => {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
};

export const onRequestGet = async ({ request, env }: Ctx): Promise<Response> => {
  const site = env.SITE_URL || SITE;
  const ir = (ruta: string) => new Response(null, { status: 303, headers: { Location: `${site}${ruta}`, 'Cache-Control': 'no-store' } });

  if (!env.CONFIRM_SECRET || !env.BREVO_API_KEY || !env.BREVO_LIST_ID) return ir('/suscripcion-error');

  const t = new URL(request.url).searchParams.get('t') || '';
  const [payload, firma] = t.split('.');
  if (!payload || !firma) return ir('/suscripcion-error');
  if (!igual(firma, await firmar(env.CONFIRM_SECRET, payload))) return ir('/suscripcion-error');

  let datos: { e?: string; i?: string; o?: string; x?: number };
  try {
    datos = JSON.parse(new TextDecoder().decode(desdeB64url(payload)));
  } catch {
    return ir('/suscripcion-error');
  }
  if (!datos.e || !datos.x || Date.now() > datos.x) return ir('/suscripcion-error?caducado=1');

  const interes = INTERESES.includes(datos.i || '') ? datos.i! : 'general';
  if (env.DRY_RUN) return ir('/suscripcion-confirmada');

  const res = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: { 'api-key': env.BREVO_API_KEY, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      email: datos.e,
      attributes: { INTERES: interes, ORIGEN: String(datos.o || '').slice(0, 200) },
      listIds: [Number(env.BREVO_LIST_ID)],
      updateEnabled: true,
    }),
  }).catch(() => null);

  // 201 = creado; 204 = actualizado (ya existía). Cualquier otra respuesta es un fallo real.
  if (res && (res.status === 201 || res.status === 204 || res.ok)) return ir('/suscripcion-confirmada');
  return ir('/suscripcion-error');
};

export const onRequest = async ({ request, env }: Ctx): Promise<Response> =>
  request.method === 'GET' ? onRequestGet({ request, env }) : new Response('Method Not Allowed', { status: 405, headers: { Allow: 'GET' } });
