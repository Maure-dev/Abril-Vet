import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sendEmail } from "../_lib/email.js";
import { adminDb } from "../_lib/firebaseAdmin.js";
import { HttpError, sendError } from "../_lib/http.js";

const TYPE_LABELS: Record<string, string> = {
  appointment: "turno",
  vaccine: "vacuna",
  deworming: "desparasitación",
  control: "control",
  study: "estudio",
  medication: "medicación"
};

// GET /api/reminders/dispatch — pensado para Vercel Cron (diario). Envía por email los recordatorios
// en estado "pending" cuya fecha (dueDate) ya llegó, y los marca como "sent". Sólo email.
// Protección: si CRON_SECRET está seteado, exige "Authorization: Bearer <CRON_SECRET>" (Vercel Cron
// lo manda automáticamente cuando la env existe).
export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    const secret = process.env.CRON_SECRET;
    if (secret && (req.headers.authorization || "") !== `Bearer ${secret}`) {
      throw new HttpError(401, "No autorizado");
    }

    const db = adminDb();
    const today = new Date().toISOString().slice(0, 10);

    // Filtramos dueDate en memoria para no requerir índice compuesto (status + dueDate).
    const snapshot = await db.collection("reminders").where("status", "==", "pending").get();
    const due = snapshot.docs.filter((doc) => String(doc.data().dueDate || "") <= today);

    let sent = 0;
    let skipped = 0;
    for (const doc of due) {
      const reminder = doc.data();
      let email = "";
      if (reminder.clientId) {
        const clientSnap = await db.collection("clients").doc(String(reminder.clientId)).get();
        email = String(clientSnap.data()?.email || "");
      }
      if (!email) {
        skipped++;
        continue;
      }
      const kind = TYPE_LABELS[String(reminder.type)] || "recordatorio";
      const ok = await sendEmail(
        email,
        `Recordatorio de ${kind} — Abril Vet`,
        `<p>${String(reminder.message || `Tenés un ${kind} pendiente en Abril Vet.`)}</p>
         <p><strong>Fecha:</strong> ${String(reminder.dueDate || "")}</p>
         <p style="color:#64748b;font-size:0.85rem">Abril Vet — Administración veterinaria</p>`
      );
      if (ok) {
        await doc.ref.update({ status: "sent", sentAt: new Date().toISOString() });
        sent++;
      } else {
        skipped++;
      }
    }

    res.status(200).json({ pending: snapshot.size, due: due.length, sent: sent, skipped: skipped });
  } catch (error) {
    sendError(res, error);
  }
}
