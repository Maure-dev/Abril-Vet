import { auth, isFirebaseConfigured } from "@app/modules/main/services/firebase";
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";

function requireAuth() {
  if (!isFirebaseConfigured || !auth) {
    throw new Error("auth-unavailable");
  }
  return auth;
}

// Ingreso con email + contraseña. El estado de sesión lo actualiza MainProvider (onAuthStateChanged).
export async function signIn(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(requireAuth(), email, password);
}

// Envía el email de recuperación de contraseña.
export async function sendRecovery(email: string): Promise<void> {
  await sendPasswordResetEmail(requireAuth(), email);
}
