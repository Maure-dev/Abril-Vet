// Envío de email vía Resend (opcional). Si RESEND_API_KEY no está configurada, no envía y
// devuelve false para que el llamador muestre el link manualmente.
export async function sendResetEmail(to: string, link: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || "Abril Vet <no-reply@abril-vet.app>";
  if (!apiKey) {
    return false;
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: from,
      to: [to],
      subject: "Acceso a Abril Vet",
      html: `<p>Te damos acceso a <strong>Abril Vet</strong>.</p>
             <p>Definí o restablecé tu contraseña desde este enlace:</p>
             <p><a href="${link}">${link}</a></p>`
    })
  });
  return response.ok;
}
