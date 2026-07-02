import type { VercelRequest, VercelResponse } from "@vercel/node";
import { adminAuth, adminDb } from "../_lib/firebaseAdmin.js";
import { HttpError, requireAdmin, sendError } from "../_lib/http.js";

const ROLES = ["admin", "vet", "receptionist", "assistant"];

// Normaliza y valida la lista de roles del body (al menos uno válido).
function parseRoles(value: unknown): string[] {
  const list = Array.isArray(value) ? value.map((r) => String(r)) : [];
  const valid = list.filter((r) => ROLES.includes(r));
  return [...new Set(valid)];
}

// POST /api/staff — crea el usuario en Firebase Auth (email + contraseña), setea los roles como
// custom claim y guarda el perfil en la colección `staff` (doc id = uid). Sólo admin.
export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      throw new HttpError(405, "Método no permitido");
    }
    await requireAdmin(req);

    const body = (req.body ?? {}) as Record<string, unknown>;
    const firstName = String(body.firstName ?? "").trim();
    const lastName = String(body.lastName ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const notes = String(body.notes ?? "").trim();
    const roles = parseRoles(body.roles);
    const password = String(body.password ?? "");
    const isActive = body.isActive !== false;

    if (!email) {
      throw new HttpError(400, "El email es obligatorio");
    }
    if (password.length < 6) {
      throw new HttpError(400, "La contraseña debe tener al menos 6 caracteres");
    }
    if (roles.length === 0) {
      throw new HttpError(400, "Elegí al menos un rol válido");
    }

    const displayName = `${firstName} ${lastName}`.trim();
    const user = await adminAuth().createUser({
      email: email,
      password: password,
      displayName: displayName || undefined,
      disabled: !isActive
    });
    await adminAuth().setCustomUserClaims(user.uid, { roles: roles });

    const now = new Date().toISOString();
    const profile = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      roles: roles,
      phone: phone,
      notes: notes,
      isActive: isActive,
      uid: user.uid,
      createdAt: now,
      updatedAt: now
    };
    await adminDb().collection("staff").doc(user.uid).set(profile);

    res.status(201).json({ id: user.uid, ...profile });
  } catch (error) {
    sendError(res, error);
  }
}
