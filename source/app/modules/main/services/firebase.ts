import { type FirebaseApp, getApps, initializeApp } from "firebase/app";
import { type Auth, getAuth } from "firebase/auth";

// Config web (PÚBLICA) tomada de las variables ENV_ (se embeben en el bundle de Vite).
// Sólo inicializa la app + Auth (lo que el shell necesita al arrancar). Firestore vive en
// firestore.ts (se importa recién desde el código lazy → no entra al bundle inicial).
// Los archivos (fotos, estudios, PDFs) NO usan Firebase Storage (requiere Blaze): van a Cloudinary.
const config = {
  apiKey: import.meta.env.ENV_FIREBASE_API_KEY,
  authDomain: import.meta.env.ENV_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.ENV_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.ENV_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.ENV_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.ENV_FIREBASE_APP_ID
};

// Si falta la config (dev sin credenciales / tests), la app corre en modo "no configurado":
// los services deben chequear `isFirebaseConfigured` antes de operar.
export const isFirebaseConfigured = Boolean(config.apiKey && config.projectId && config.appId);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

if (isFirebaseConfigured) {
  app = getApps().length > 0 ? getApps()[0] : initializeApp(config);
  auth = getAuth(app);
}

export { app, auth };
