import { type App, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Init del Firebase Admin SDK para las Vercel Functions. La service account se pasa por la
// variable de entorno FIREBASE_SERVICE_ACCOUNT (JSON crudo o codificado en base64), SOLO en el
// servidor (nunca con prefijo ENV_ ni en el bundle del cliente).
function loadServiceAccount(): Record<string, unknown> {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT no está configurada");
  }
  const json = raw.trim().startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8");
  return JSON.parse(json);
}

let app: App | null = null;

function getAdminApp(): App {
  if (app) {
    return app;
  }
  app = getApps().length > 0 ? getApps()[0] : initializeApp({ credential: cert(loadServiceAccount()) });
  return app;
}

export const adminAuth = () => getAuth(getAdminApp());
export const adminDb = () => getFirestore(getAdminApp());
