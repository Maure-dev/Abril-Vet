import { db, isFirebaseConfigured } from "@app/modules/main/services/firebase";
import type { PatientInputType, PatientType } from "@app/modules/patients/entities/entities";
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

const COLLECTION = "patients";

// Verifica que Firestore esté disponible; si no, lanza (el hook captura y notifica).
function requireDb() {
  if (!isFirebaseConfigured || !db) {
    throw new Error("firestore-unavailable");
  }
  return db;
}

// Trae todos los pacientes ordenados por nombre.
export async function fetchPatients(): Promise<PatientType[]> {
  const database = requireDb();
  const snapshot = await getDocs(query(collection(database, COLLECTION), orderBy("name")));
  return snapshot.docs.map((snap) => {
    const data = snap.data() as Omit<PatientType, "id">;
    return { ...data, id: snap.id };
  });
}

// Crea un paciente y devuelve su id.
export async function createPatient(input: PatientInputType): Promise<string> {
  const database = requireDb();
  const ref = await addDoc(collection(database, COLLECTION), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return ref.id;
}

// Actualiza un paciente existente.
export async function updatePatient(id: string, input: PatientInputType): Promise<void> {
  const database = requireDb();
  await updateDoc(doc(database, COLLECTION, id), {
    ...input,
    updatedAt: serverTimestamp()
  });
}

// Elimina un paciente.
export async function deletePatient(id: string): Promise<void> {
  const database = requireDb();
  await deleteDoc(doc(database, COLLECTION, id));
}
