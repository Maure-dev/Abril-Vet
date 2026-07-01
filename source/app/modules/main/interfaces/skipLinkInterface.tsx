// Enlace de salto al contenido (accesibilidad de teclado): visible sólo al enfocarlo.
export default function SkipLinkInterface() {
  return (
    <a
      href="#contenido"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-buttons focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
    >
      Saltar al contenido
    </a>
  );
}
