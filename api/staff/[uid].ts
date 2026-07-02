import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sendResetEmail } from "../_lib/email.js";
import { adminAuth, adminDb } from "../_lib/firebaseAdmin.js";
import { HttpError, requireAdmin, sendError } from "../_lib/http.js";

const ROLES = ["admin", "vet", "receptionist", "assistant"];

// PATCH  /api/staff/:uid  — actualiza perfil/rol, deshabilita el acceso, cambia la contraseña
//                          y/o genera un link de invitación/reseteo (opcionalmente por email).
// DELETE /api/staff/:uid  — elimina el usuario de Auth y su perfil. Sólo admin.
export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    await requireAdmin(req);
    const uid = String(req.query.uid ?? "");
    if (!uid) {
      throw new HttpError(400, "Falta el uid");
    }

    if (req.method === "DELETE") {
      await adminAuth()
        .deleteUser(uid)
        .catch(() => undefined);
      await adminDb().collection("staff").doc(uid).delete();
      res.status(200).json({ ok: true });
      return;
    }

    if (req.method !== "PATCH") {
      res.setHeader("Allow", "PATCH, DELETE");
      throw new HttpError(405, "Método no permitido");
    }

    const body = (req.body ?? {}) as Record<string, unknown>;
    const authUpdate: { password?: string; disabled?: boolean; displayName?: string } = {};
    const docUpdate: Record<string, unknown> = { updatedAt: new Date().toISOString() };

    if (typeof body.firstName === "string") {
      docUpdate.firstName = body.firstName.trim();
    }
    if (typeof body.lastName === "string") {
      docUpdate.lastName = body.lastName.trim();
    }
    if (typeof body.phone === "string") {
      docUpdate.phone = body.phone.trim();
    }
    if (typeof body.notes === "string") {
      docUpdate.notes = body.notes.trim();
    }
    if (typeof body.firstName === "string" || typeof body.lastName === "string") {
      const current = await adminDb().collection("staff").doc(uid).get();
      const data = current.data() ?? {};
      const firstName = typeof body.firstName === "string" ? body.firstName : data.firstName ?? "";
      const lastName = typeof body.lastName === "string" ? body.lastName : data.lastName ?? "";
      authUpdate.displayName = `${firstName} ${lastName}`.trim();
    }
    if (Array.isArray(body.roles)) {
      const roles = [...new Set(body.roles.map((r) => String(r)).filter((r) => ROLES.includes(r)))];
      if (roles.length === 0) {
        throw new HttpError(400, "Elegí al menos un rol válido");
      }
      await adminAuth().setCustomUserClaims(uid, { roles: roles });
      docUpdate.roles = roles;
    }
    if (typeof body.isActive === "boolean") {
      authUpdate.disabled = !body.isActive;
      docUpdate.isActive = body.isActive;
    }
    if (typeof body.password === "string") {
      if (body.password.length < 6) {
        throw new HttpError(400, "La contraseña debe tener al menos 6 caracteres");
      }
      authUpdate.password = body.password;
    }

    if (Object.keys(authUpdate).length > 0) {
      await adminAuth().updateUser(uid, authUpdate);
    }
    await adminDb().collection("staff").doc(uid).set(docUpdate, { merge: true });

    // Link de invitación / reseteo de contraseña (opcional).
    let resetLink: string | undefined;
    let emailed = false;
    if (body.resetLink === true) {
      const user = await adminAuth().getUser(uid);
      if (user.email) {
        resetLink = await adminAuth().generatePasswordResetLink(user.email);
        emailed = await sendResetEmail(user.email, resetLink).catch(() => false);
      }
    }

    res.status(200).json({ ok: true, resetLink: resetLink, emailed: emailed });
  } catch (error) {
    sendError(res, error);
  }
}
