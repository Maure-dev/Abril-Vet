import { isFirebaseConfigured } from "@app/modules/main/services/firebase";
import { db } from "@app/modules/main/services/firestore";
import type { ReminderInputType, ReminderType } from "@app/modules/reminders/entities/entities";
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

const COLLECTION = "reminders";

// Verifica que Firestore esté disponible; si no, lanza (el hook captura y notifica).
function requireDb() {
  if (!isFirebaseConfigured || !db) {
    throw new Error("firestore-unavailable");
  }
  return db;
}

// Trae todos los recordatorios ordenados por fecha de vencimiento.
export async function fetchReminders(): Promise<ReminderType[]> {
  const database = requireDb();
  const snapshot = await getDocs(query(collection(database, COLLECTION), orderBy("dueDate")));
  return snapshot.docs.map((snap) => {
    const data = snap.data() as Omit<ReminderType, "id">;
    return { ...data, id: snap.id };
  });
}

// Crea un recordatorio y devuelve su id.
export async function createReminder(input: ReminderInputType): Promise<string> {
  const database = requireDb();
  const ref = await addDoc(collection(database, COLLECTION), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return ref.id;
}

// Actualiza un recordatorio existente.
export async function updateReminder(id: string, input: ReminderInputType): Promise<void> {
  const database = requireDb();
  await updateDoc(doc(database, COLLECTION, id), {
    ...input,
    updatedAt: serverTimestamp()
  });
}

// Elimina un recordatorio.
export async function deleteReminder(id: string): Promise<void> {
  const database = requireDb();
  await deleteDoc(doc(database, COLLECTION, id));
}
