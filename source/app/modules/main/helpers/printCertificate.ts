type CertificateRowType = { label: string; value: string };

export type CertificateDataType = {
  title: string;
  subtitle?: string;
  rows: CertificateRowType[];
  note?: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Abre una ventana con el certificado formateado (membrete Abril Vet) y dispara la impresión,
// desde donde el usuario puede imprimir o "Guardar como PDF". No usa el CSS de la app.
export function printCertificate(data: CertificateDataType): void {
  const win = window.open("", "_blank", "width=820,height=920");
  if (!win) {
    return;
  }
  const rows = data.rows
    .map((row) => `<tr><th>${escapeHtml(row.label)}</th><td>${escapeHtml(row.value)}</td></tr>`)
    .join("");
  win.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8" />
    <title>${escapeHtml(data.title)}</title>
    <style>
      body { font-family: Arial, Helvetica, sans-serif; color: #1c3a42; margin: 3rem; }
      .brand { color: #0f766e; font-size: 1.6rem; font-weight: 700; letter-spacing: 0.02em; }
      .tagline { color: #5b7079; margin: 0 0 1.5rem; font-size: 0.9rem; }
      h1 { font-size: 1.25rem; margin: 1.5rem 0 0.25rem; }
      .sub { color: #5b7079; margin: 0 0 1.5rem; }
      table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
      th, td { text-align: left; padding: 0.5rem 0.75rem; border-bottom: 0.0625rem solid #d7e3e5; font-size: 0.95rem; }
      th { width: 13rem; color: #5b7079; font-weight: 600; }
      .note { margin-top: 1.5rem; font-size: 0.9rem; }
      .sign { margin-top: 4.5rem; display: flex; justify-content: space-between; }
      .sign div { border-top: 0.0625rem solid #1c3a42; padding-top: 0.4rem; width: 15rem; text-align: center; font-size: 0.85rem; }
      @media print { body { margin: 1.5rem; } }
    </style></head><body>
    <div class="brand">Abril Vet</div>
    <p class="tagline">Administración veterinaria</p>
    <h1>${escapeHtml(data.title)}</h1>
    ${data.subtitle ? `<p class="sub">${escapeHtml(data.subtitle)}</p>` : ""}
    <table><tbody>${rows}</tbody></table>
    ${data.note ? `<p class="note">${escapeHtml(data.note)}</p>` : ""}
    <div class="sign"><div>Firma y sello del profesional</div><div>Fecha</div></div>
  </body></html>`);
  win.document.close();
  win.focus();
  win.print();
}
