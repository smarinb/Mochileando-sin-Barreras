"""Genera docs/leads/kit-comunicacion-emergencias.html (fuente del PDF del kit).

Después se imprime a PDF con Edge:
  msedge --headless --no-pdf-header-footer --print-to-pdf=public/descargas/kit-comunicacion-emergencias.pdf file:///.../kit-comunicacion-emergencias.html
"""
from pathlib import Path

LANGS = ["English", "Français", "Italiano", "Deutsch", "Português"]
PHRASES = [
    ("Soy sordo/a (tengo hipoacusia). No puedo oírte. Por favor, escribe en el móvil o en papel.",
     "I am deaf (hard of hearing). I cannot hear you. Please write it down on my phone or on paper.",
     "Je suis sourd(e) (malentendant(e)). Je ne vous entends pas. Veuillez l'écrire sur mon téléphone ou sur du papier.",
     "Sono sordo/a (ipoacusico/a). Non riesco a sentirla. Per favore, scriva sul mio telefono o su carta.",
     "Ich bin gehörlos (schwerhörig). Ich kann Sie nicht hören. Bitte schreiben Sie es auf mein Handy oder auf Papier.",
     "Sou surdo/a (tenho deficiência auditiva). Não consigo ouvi-lo/a. Por favor, escreva no meu telemóvel/celular ou em papel."),
    ("Por favor, habla despacio y mírame a la cara.",
     "Please speak slowly and face me.",
     "Parlez lentement et regardez-moi, s'il vous plaît.",
     "Per favore, parli lentamente e mi guardi in faccia.",
     "Bitte sprechen Sie langsam und schauen Sie mich an.",
     "Por favor, fale devagar e olhe para mim."),
    ("Necesito un médico / ir al hospital.",
     "I need a doctor / to go to a hospital.",
     "J'ai besoin d'un médecin / d'aller à l'hôpital.",
     "Ho bisogno di un medico / di andare in ospedale.",
     "Ich brauche einen Arzt / muss ins Krankenhaus.",
     "Preciso de um médico / de ir ao hospital."),
    ("Necesito ayuda urgente. Llame a una ambulancia / a la policía.",
     "I need urgent help. Please call an ambulance / the police.",
     "J'ai besoin d'aide urgente. Appelez une ambulance / la police, s'il vous plaît.",
     "Ho bisogno di aiuto urgente. Chiami un'ambulanza / la polizia, per favore.",
     "Ich brauche dringend Hilfe. Rufen Sie bitte einen Krankenwagen / die Polizei.",
     "Preciso de ajuda urgente. Chame uma ambulância / a polícia, por favor."),
    ("Tengo seguro de viaje. Contacte con mi aseguradora por mí o déjeme escribirles.",
     "I have travel insurance. Please contact my insurer for me, or let me message them.",
     "J'ai une assurance voyage. Veuillez contacter mon assureur à ma place, ou laissez-moi leur écrire.",
     "Ho un'assicurazione di viaggio. Contatti la mia assicurazione per me, o mi lasci scrivere loro.",
     "Ich habe eine Reiseversicherung. Bitte kontaktieren Sie meine Versicherung für mich oder lassen Sie mich ihr schreiben.",
     "Tenho seguro de viagem. Contacte a minha seguradora por mim ou deixe-me escrever-lhes."),
    ("Soy alérgico/a a… / Tomo esta medicación…",
     "I am allergic to… / I take this medication…",
     "Je suis allergique à… / Je prends ce médicament…",
     "Sono allergico/a a… / Prendo questo farmaco…",
     "Ich bin allergisch gegen… / Ich nehme dieses Medikament…",
     "Sou alérgico/a a… / Tomo esta medicação…"),
    ("He perdido mi pasaporte / me lo han robado. Necesito un informe policial para el seguro.",
     "My passport was lost / stolen. I need a police report for my insurance.",
     "Mon passeport est perdu / volé. J'ai besoin d'un rapport de police pour mon assurance.",
     "Il mio passaporto è stato smarrito / rubato. Ho bisogno di una denuncia per la mia assicurazione.",
     "Mein Pass wurde verloren / gestohlen. Ich brauche eine Anzeige für meine Versicherung.",
     "O meu passaporte foi perdido / roubado. Preciso de um relatório policial para o seguro."),
]

CSS = """
@page { size:A4; margin:16mm 15mm; }
* { box-sizing:border-box }
body { font:11pt/1.45 Montserrat,"Segoe UI",Arial,sans-serif; color:#1c2b2b; margin:0 }
h1 { font-size:26pt; line-height:1.1; margin:0 0 6mm; color:#fff }
h2 { font-size:15pt; color:#2c8584; margin:0 0 4mm; border-bottom:2px solid #36A09F; padding-bottom:2mm }
.cover { background:linear-gradient(135deg,#3f9a99,#52a9aa); color:#fff; padding:22mm 16mm; border-radius:6mm; min-height:250mm; page-break-after:always; position:relative }
.cover .kick { letter-spacing:.25em; font-weight:700; font-size:10pt; color:#e3f3f3; margin-bottom:10mm }
.cover p { font-size:13pt; max-width:140mm }
.tag { display:inline-block; background:#D87068; color:#fff; font-weight:700; padding:3mm 6mm; border-radius:10mm; margin-top:6mm }
.cover .foot { position:absolute; left:16mm; bottom:14mm; font-size:10pt }
section { page-break-after:always } section:last-of-type { page-break-after:auto }
ul { padding-left:5mm; margin:0 0 4mm } li { margin-bottom:2mm }
.card { border:1.5px solid #36A09F; border-left:6px solid #36A09F; border-radius:3mm; padding:3mm 4mm; margin-bottom:3.5mm; break-inside:avoid; font-size:9.5pt }
.card p { margin:0 0 1mm } .card .es { font-weight:700; font-size:10.5pt; margin-bottom:2mm }
.lg { display:inline-block; min-width:19mm; font-size:8pt; font-weight:700; color:#2c8584; text-transform:uppercase }
.fill { border:1.5px solid #D87068; border-radius:3mm; padding:4mm } .fill div { border-bottom:1px dotted #999; padding:2mm 0; font-size:10pt } .fill b { color:#a8473f }
.note { background:#f1f8f8; border-left:4px solid #36A09F; padding:3mm 4mm; margin:4mm 0; font-size:9.5pt }
.small { font-size:8.5pt; color:#555 } ol { padding-left:6mm } ol li { margin-bottom:3mm }
"""

ANTES = [
    "<b>Descarga tu póliza</b> en PDF y guárdala sin conexión en el móvil y en la nube.",
    "<b>Apunta el teléfono de asistencia 24 h</b> y comprueba qué canal escrito ofrece tu aseguradora (chat, app, videoconsulta). Si no puedes llamar, es lo primero que debes saber.",
    "<b>Mira el límite médico de tu destino:</b> los capitales cambian según la zona (EE. UU., Canadá y Japón suelen ser los más caros).",
    "<b>Enfermedades previas:</b> casi todas las pólizas solo cubren una primera asistencia de urgencia vital. Lee tu póliza.",
    "<b>Documentos:</b> copia digital del pasaporte y de la póliza; en Europa, la Tarjeta Sanitaria Europea.",
    "<b>Medicación y alergias:</b> lleva la receta o el informe y los nombres de los fármacos en inglés.",
    "<b>Activa la transcripción en el móvil</b> si lo incluye (por ejemplo «Transcripción instantánea» en Android o «Subtítulos en directo» en iPhone) y descarga un traductor sin conexión.",
    "<b>Comprueba el número de emergencias</b> de tu destino (en la UE, el 112) y si ofrece un servicio de emergencias accesible para personas sordas.",
]
FICHA = [
    "Nombre y apellidos", "Fecha de nacimiento y nacionalidad", "Soy sordo/a o tengo hipoacusia · cómo comunicarse conmigo",
    "Alergias", "Medicación habitual", "Enfermedades relevantes", "Grupo sanguíneo (si lo conozco)",
    "Contacto de emergencia (nombre y teléfono)", "Aseguradora y nº de póliza", "Teléfono de asistencia 24 h y canal escrito (chat/app)",
]
PASOS = [
    "<b>Tu seguridad primero.</b> Si hay una urgencia vital, ve directamente al servicio de urgencias o pide una ambulancia y avisa a la aseguradora en cuanto puedas.",
    "<b>Avisa a la aseguradora antes de acudir al médico</b> siempre que la situación lo permita. Muchas pólizas lo exigen para gestionar la asistencia directa y que no adelantes dinero.",
    "<b>Usa el canal escrito</b> (chat, app o mensaje) y guarda la conversación. Si no tienes uno, pide a alguien de confianza o al centro médico que llame por ti y enséñales la frase 5.",
    "<b>Pide todo por escrito:</b> nombre del médico, diagnóstico, tratamiento y un informe médico, a poder ser en inglés.",
    "<b>Guarda facturas, informes y justificantes.</b> En caso de robo, presenta una denuncia: la aseguradora la pedirá.",
    "<b>Pregunta si pueden pagar directamente al centro</b> o si debes adelantar el importe y reclamarlo después.",
    "<b>Avisa a tu contacto de emergencia</b> y envíale tu ubicación.",
]


def main() -> None:
    cards = ""
    for n, ph in enumerate(PHRASES, 1):
        cards += f'<div class="card"><p class="es">{n}. {ph[0]}</p>'
        for lang, text in zip(LANGS, ph[1:]):
            cards += f'<p><span class="lg">{lang}</span>{text}</p>'
        cards += "</div>"
    antes = "".join(f"<li>{x}</li>" for x in ANTES)
    ficha = "".join(f"<div><b>{x}:</b></div>" for x in FICHA)
    pasos = "".join(f"<li>{x}</li>" for x in PASOS)
    html = f"""<!doctype html><html lang="es"><head><meta charset="utf-8">
<title>Kit de comunicación para emergencias en el extranjero</title><style>{CSS}</style></head><body>
<div class="cover"><div class="kick">MOCHILEANDO SIN BARRERAS · VIAJERA SORDA</div>
<h1>Kit de comunicación para emergencias en el extranjero</h1>
<p>Frases listas para enseñar en 6 idiomas, una ficha médica para rellenar, un checklist antes de salir y los pasos a seguir si algo sale mal. Pensado para viajeros sordos o con hipoacusia.</p>
<span class="tag">Guárdalo en el móvil, también sin conexión</span>
<div class="foot">mochileandosinbarreras.com</div></div>
<section><h2>1. Antes de salir</h2><ul>{antes}</ul>
<div class="note">Más información: <b>mochileandosinbarreras.com/seguro-de-viaje-para-sordos</b> y <b>mochileandosinbarreras.com/mejor-seguro-de-viaje</b>.</div>
<h2>2. Mi ficha de emergencia (rellénala y haz una foto)</h2><div class="fill">{ficha}</div></section>
<section><h2>3. Frases para enseñar</h2>
<p class="small">Enséñalas desde el móvil o imprime esta página. Traducciones sencillas y de uso general; en caso de duda, escribe también en el traductor del móvil.</p>{cards}</section>
<section><h2>4. Si ocurre una emergencia: paso a paso</h2><ol>{pasos}</ol>
<div class="note"><b>Aviso:</b> este kit es orientativo y no sustituye a un consejo médico, jurídico ni a las condiciones de tu póliza. Revisa siempre lo que cubre tu seguro y tu destino antes de viajar.</div>
<p class="small">Mochileando sin Barreras · mochileandosinbarreras.com · Si este kit te ha sido útil, compártelo con otro viajero sordo.</p></section>
</body></html>"""
    out = Path(__file__).parent / "kit-comunicacion-emergencias.html"
    out.write_text(html, encoding="utf-8")
    print("escrito", out)


if __name__ == "__main__":
    main()
