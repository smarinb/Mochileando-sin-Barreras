# Notas de campo: sistema Telegram → EC2 → GitHub

> Contexto para Claude Code. Describe cómo llegan al repo las notas de voz, textos, fotos, ubicaciones y documentos que Sergi y Cris envían desde la carretera, dónde se guardan y cómo tratarlas.

## 1. Qué es

Mientras viajan en el motorhome mandan un mensaje a un bot de Telegram (voz, foto, ubicación, texto o documento). El bot lo guarda como fichero en este repo; tras `git pull`, Claude Code tiene ese material como contexto para redactar artículos, fichas de lugares y guías.

## 2. Arquitectura

```
Móvil (Telegram) ──► Bot en EC2 (long polling) ──► escribe ficheros en su clon del repo
                                                    │
                                                    ▼
                                      git pull --rebase + commit + push (rama main)
                                                    │
                                                    ▼
                                       GitHub (repo privado)
                                                    │
                                                    ▼
                         PC local de Sergi: `git pull` → Claude Code lee las notas
```

- **Bot**: script Python (`python-telegram-bot`) como servicio `systemd` (`botnotas.service`) en una EC2 Ubuntu. Long polling: sin puertos de entrada.
- **Transcripción**: Whisper (API de OpenAI, idioma `es`). Solo se guarda el texto, no el audio.
- **Usuario del sistema**: `botnotas` (sin `sudo`), con clon propio en `/home/botnotas/repos/blog`.
- **Acceso a GitHub**: *deploy key* de solo este repo con escritura (`~/.ssh/deploy_bot`).
- **Seguridad**: el bot ignora user IDs de Telegram fuera de `ALLOWED_IDS` (Sergi y Cris). Los secretos viven solo en el `.env` del servidor y **nunca deben aparecer en el repo**.
- **El repo es privado** y debe seguir siéndolo: las notas contienen ubicaciones casi en tiempo real.

## 3. Dónde se guardan los ficheros

Todo cuelga de `notas/` en la raíz del repo:

| Qué se envía | Dónde queda | Detalle |
|---|---|---|
| Nota de voz | `notas/campo/AAAA-MM-DD-HHMMSS-voz.md` | Transcripción de Whisper |
| Texto | `notas/campo/AAAA-MM-DD-HHMMSS-texto.md` | Texto tal cual |
| Foto | `notas/campo/AAAA-MM-DD-HHMMSS-foto.md` + `notas/fotos/AAAA-MM-DD-HHMMSS.jpg` | JPEG reducido a máx. 1600 px; la nota enlaza la imagen y lleva el pie de foto si lo hay |
| Ubicación | `notas/campo/AAAA-MM-DD-HHMMSS-ubicacion.md` | Coordenadas + enlace a Google Maps |
| Documento/archivo | `notas/campo/AAAA-MM-DD-HHMMSS-documento.md` + fichero en `notas/docs/` (o `notas/fotos/` si es imagen) | Imágenes enviadas «como archivo» conservan calidad original |

Formato de cada nota:

```markdown
---
fecha: 2026-10-11 00:25
tipo: voz
---

Texto de la nota (o transcripción, o enlace a la foto/documento).
```

Las fotos se enlazan con ruta relativa: `![foto](../fotos/AAAA-MM-DD-HHMMSS.jpg)`.

## 4. Al leer las notas

1. **La hora es UTC (servidor), no la local del viaje.** En Argentina (UTC−3) una nota de las 21:00 locales aparece como del día siguiente 00:00.
2. **Cada mensaje es una nota independiente.** Foto + voz + ubicación del mismo lugar son tres ficheros: correlaciona por proximidad de marca de tiempo (pocos minutos).
3. **Las transcripciones pueden fallar**, sobre todo en nombres propios. Si un topónimo es dudoso, señálalo y pregunta antes de publicar.
4. **Son material en bruto**: apuntes hablados, informales y sin verificar. Contrastar y redactar, no copiar.
5. **Accesibilidad**: si una nota menciona accesos, rampas, superficies, baños, aparcamiento o ayudas para personas ciegas o con movilidad reducida, destácalo en las fichas de lugar.

## 5. Cómo trabajar con ellas

- Antes de empezar: `git pull` (el bot empuja en cualquier momento) y revisar `notas/campo/`.
- **No modificar ni borrar** nada de `notas/campo/`, `notas/fotos/` ni `notas/docs/` (conflictos con el bot). Lo derivado va a otras carpetas.
- Registrar lo procesado en `notas/_procesadas.md`: una línea por nota (fichero → dónde se usó).
- Al convertir en contenido: agrupar por lugar y fecha, conservar coordenadas y fotos relevantes (copiarlas y optimizarlas a la carpeta de imágenes del blog; **no enlazar a `notas/fotos/` desde el sitio**), mantener el tono del blog.
- Si faltan datos (precios, horarios, nombre exacto), preguntar a Sergi o Cris; no inventar.
- **Privacidad**: no publicar coordenadas exactas de lugares donde duermen o aparcan sin confirmación de Sergi.

## 6. Operación (referencia, desde `ubuntu` con `sudo`)

```bash
sudo systemctl status botnotas
sudo systemctl restart botnotas
journalctl -u botnotas -n 30 --no-pager
```

- Config en `/home/botnotas/bot/.env`: `TELEGRAM_TOKEN`, `OPENAI_API_KEY`, `ALLOWED_IDS` (IDs separados por coma), `REPO_DIR`.
- Añadir persona: añadir su user ID a `ALLOWED_IDS` y reiniciar.
- «Falló el push»: revisar la deploy key (GitHub → Settings → Deploy keys) con escritura.
- Si el log muestra la URL de Telegram con el token: poner el logger `httpx` en `WARNING`.
- Acceso a la EC2: AWS Systems Manager (Session Manager), sin puerto 22 público.

## 7. Pendiente

- [ ] Probar la transcripción de voz de extremo a extremo.
- [ ] Añadir el user ID de Cris a `ALLOWED_IDS`.
- [ ] Comprobar si cada push a `main` dispara un despliegue; si es así, excluir `notas/**` del build.
- [ ] Fase 2: agrupar foto + voz + ubicación enviadas seguidas en una sola nota.
- [ ] Fase 2: plantilla opcional (lugar, accesibilidad, precios, horarios) estructurada por Claude.
- [ ] Fase 2: varios proyectos con `/proyecto blog` o grupo de Telegram por temas.
- [ ] Vigilar el tamaño del repo (fotos en el historial); si crece, mover originales a S3.
