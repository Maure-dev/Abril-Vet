import { isFirebaseConfigured } from "@app/modules/main/services/firebase";
import { db } from "@app/modules/main/services/firestore";
import type {
  VaccinationInputType,
  VaccinationType
} from "@app/modules/vaccinations/entities/entities";
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

const COLLECTION = "vaccinations";

// Verifica que Firestore esté disponible; si no, lanza (el hook captura y notifica).
function requireDb() {
  if (!isFirebaseConfigured || !db) {
    throw new Error("firestore-unavailable");
  }
  return db;
}

// Trae todas las vacunaciones ordenadas por fecha de aplicación (más recientes primero).
export async function fetchVaccinations(): Promise<VaccinationType[]> {
  const database = requireDb();
  const snapshot = await getDocs(query(collection(database, COLLECTION), orderBy("date", "desc")));
  return snapshot.docs.map((snap) => {
    const data = snap.data() as Omit<VaccinationType, "id">;
    return { ...data, id: snap.id };
  });
}

// Crea una vacunación y devuelve su id.
export async function createVaccination(input: VaccinationInputType): Promise<string> {
  const database = requireDb();
  const ref = await addDoc(collection(database, COLLECTION), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return ref.id;
}

// Actualiza una vacunación existente.
export async function updateVaccination(id: string, input: VaccinationInputType): Promise<void> {
  const database = requireDb();
  await updateDoc(doc(database, COLLECTION, id), {
    ...input,
    updatedAt: serverTimestamp()
  });
}

// Elimina una vacunación.
export async function deleteVaccination(id: string): Promise<void> {
  const database = requireDb();
  await deleteDoc(doc(database, COLLECTION, id));
}
