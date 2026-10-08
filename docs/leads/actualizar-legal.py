"""Aplica al aviso legal y a la política de privacidad los cambios necesarios para activar el boletín.

Domicilio: Calle Ramón y Cajal 15, 06228 Hornachos (confirmado por el titular). Proveedor de correo: genérico.
"""
from pathlib import Path

DOMICILIO = "Calle Ramón y Cajal 15, 06228 Hornachos (Badajoz)"
FECHA = "_Última actualización: 8 de octubre de 2026_"
VIEJA_FECHA = "_Última actualización: 6 de octubre de 2026_"
BRL = "\n"


def sub(texto: str, viejo: str, nuevo: str) -> str:
    assert viejo in texto, viejo[:60]
    return texto.replace(viejo, nuevo, 1)


def main() -> None:
    p = Path("src/pages/aviso-legal.md")
    s = p.read_text(encoding="utf-8")
    s = sub(s, "**[RELLENAR: dirección postal completa]**", DOMICILIO)
    s = sub(s, VIEJA_FECHA, FECHA)
    p.write_text(s, encoding="utf-8", newline="")

    p = Path("src/pages/privacidad.md")
    s = p.read_text(encoding="utf-8")
    s = sub(s, "**[RELLENAR: dirección postal]**", DOMICILIO)
    s = sub(s, VIEJA_FECHA, FECHA)
    s = sub(
        s,
        "**[RELLENAR: proveedor de correo, por ejemplo Google Workspace o el que uses]**",
        "el proveedor del servicio de correo electrónico corporativo del dominio, que aloja los mensajes que nos envías.",
    )
    boletin = (
        "**Boletín por correo electrónico.** Si te suscribes, tratamos tu correo electrónico, el interés que elijas "
        "(seguros, tarjetas, eSIM, alquiler de coches o general) y la página desde la que te apuntas, para enviarte avisos y "
        "contenidos sobre seguros, tarjetas, eSIM y viajes accesibles. La base jurídica es tu consentimiento (art. 6.1.a RGPD), "
        "que confirmas con un correo de doble confirmación y que puedes retirar en cualquier momento con el enlace de baja que "
        "incluye cada correo. El formulario usa Cloudflare Turnstile para evitar el spam." + BRL + BRL
    )
    s = sub(
        s,
        "Actualmente este sitio **no dispone de comentarios, boletín ni tienda propia**",
        boletin + "Actualmente este sitio **no dispone de comentarios ni tienda propia**",
    )
    s = sub(
        s,
        "durante los plazos legales de prescripción de posibles responsabilidades.",
        "durante los plazos legales de prescripción de posibles responsabilidades. Los datos del boletín se conservan hasta que te des "
        "de baja; después, solo guardamos lo mínimo para acreditar el consentimiento durante los plazos legales.",
    )
    s = sub(
        s,
        BRL + BRL + "Si alguno de estos proveedores está fuera del Espacio Económico Europeo",
        BRL
        + "- **Envío de los correos del boletín:** Brevo (Sendinblue SAS, Francia), que almacena la lista de suscriptores y envía los mensajes."
        + BRL
        + BRL
        + "Si alguno de estos proveedores está fuera del Espacio Económico Europeo",
    )
    p.write_text(s, encoding="utf-8", newline="")
    print("ok")


if __name__ == "__main__":
    main()
