import { app, isFirebaseConfigured } from "@app/modules/main/services/firebase";
import { type Firestore, getFirestore } from "firebase/firestore";

// Instancia de Firestore, separada de firebase.ts a propósito: como sólo la importan los services
// de los módulos (que se cargan por demanda / code-splitting), el SDK de Firestore NO entra al
// bundle inicial. La pantalla de login sólo necesita Auth. Guarda: null si no está configurado.
let db: Firestore | null = null;

if (isFirebaseConfigured && app) {
  db = getFirestore(app);
}

export { db };
