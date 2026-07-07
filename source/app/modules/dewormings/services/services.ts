import type { DewormingInputType, DewormingType } from "@app/modules/dewormings/entities/entities";
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

const COLLECTION = "dewormings";

// Verifica que Firestore esté disponible; si no, lanza (el hook captura y notifica).
function requireDb() {
  if (!isFirebaseConfigured || !db) {
    throw new Error("firestore-unavailable");
  }
  return db;
}

// Trae todas las desparasitaciones ordenadas por fecha de aplicación (más recientes primero).
export async function fetchDewormings(): Promise<DewormingType[]> {
  const database = requireDb();
  const snapshot = await getDocs(query(collection(database, COLLECTION), orderBy("date", "desc")));
  return snapshot.docs.map((snap) => {
    const data = snap.data() as Omit<DewormingType, "id">;
    return { ...data, id: snap.id };
  });
}

// Crea una desparasitación y devuelve su id.
export async function createDeworming(input: DewormingInputType): Promise<string> {
  const database = requireDb();
  const ref = await addDoc(collection(database, COLLECTION), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return ref.id;
}

// Actualiza una desparasitación existente.
export async function updateDeworming(id: string, input: DewormingInputType): Promise<void> {
  const database = requireDb();
  await updateDoc(doc(database, COLLECTION, id), {
    ...input,
    updatedAt: serverTimestamp()
  });
}

// Elimina una desparasitación.
export async function deleteDeworming(id: string): Promise<void> {
  const database = requireDb();
  await deleteDoc(doc(database, COLLECTION, id));
}
