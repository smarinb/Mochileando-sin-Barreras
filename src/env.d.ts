// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="vite/client" />
/// <reference types="../vendor/integration/types.d.ts" />

declare namespace App {
  interface Locals {
    /** Encabezados del post que se está renderizando; los lee el componente <Indice />. */
    headings?: Array<{ depth: number; slug: string; text: string }>;
  }
}
