import type {
  CashSessionInputType,
  CashSessionType
} from "@app/modules/cashRegister/entities/entities";
import { isFirebaseConfigured } from "@app/modules/main/services/firebase";
import { db } from "@app/modules/main/services/firestore";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";

const COLLECTION = "cashSessions";

// Verifica que Firestore esté disponible; si no, lanza (el hook captura y notifica).
function requireDb() {
  if (!isFirebaseConfigured || !db) {
    throw new Error("firestore-unavailable");
  }
  return db;
}

// Trae todas las sesiones de caja ordenadas por apertura (más recientes primero).
export async function fetchCashSessions(): Promise<CashSessionType[]> {
  const database = requireDb();
  const snapshot = await getDocs(
    query(collection(database, COLLECTION), orderBy("openedAt", "desc"))
  );
  return snapshot.docs.map((snap) => {
    const data = snap.data() as Omit<CashSessionType, "id">;
    return { ...data, id: snap.id };
  });
}

// Crea una sesión de caja y devuelve su id.
export async function createCashSession(input: CashSessionInputType): Promise<string> {
  const database = requireDb();
  const ref = await addDoc(collection(database, COLLECTION), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return ref.id;
}

// Actualiza una sesión de caja existente.
export async function updateCashSession(id: string, input: CashSessionInputType): Promise<void> {
  const database = requireDb();
  await updateDoc(doc(database, COLLECTION, id), {
    ...input,
    updatedAt: serverTimestamp()
  });
}

// Elimina una sesión de caja.
export async function deleteCashSession(id: string): Promise<void> {
  const database = requireDb();
  await deleteDoc(doc(database, COLLECTION, id));
}
