import type { VercelRequest, VercelResponse } from "@vercel/node";
import { adminAuth } from "./firebaseAdmin.js";

// Error con código HTTP para responder de forma uniforme.
export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// Verifica que quien llama esté autenticado y tenga rol admin (custom claim del token).
// Sin esto cualquiera podría crear usuarios: es la barrera de seguridad del backend.
export async function requireAdmin(req: VercelRequest): Promise<{ uid: string }> {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) {
    throw new HttpError(401, "Falta el token de autenticación");
  }
  const decoded = await adminAuth().verifyIdToken(token);
  const roles = Array.isArray(decoded.roles) ? decoded.roles : [];
  if (!roles.includes("admin")) {
    throw new HttpError(403, "Se requiere rol de administrador");
  }
  return { uid: decoded.uid };
}

// Responde un error: usa el status de HttpError o 500.
export function sendError(res: VercelResponse, error: unknown): void {
  if (error instanceof HttpError) {
    res.status(error.status).json({ error: error.message });
    return;
  }
  const message = error instanceof Error ? error.message : "Error interno";
  res.status(500).json({ error: message });
}
