import type {
  HospitalizationInputType,
  HospitalizationType
} from "@app/modules/hospitalizations/entities/entities";
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

const COLLECTION = "hospitalizations";

// Verifica que Firestore esté disponible; si no, lanza (el hook captura y notifica).
function requireDb() {
  if (!isFirebaseConfigured || !db) {
    throw new Error("firestore-unavailable");
  }
  return db;
}

// Trae todas las internaciones ordenadas por fecha de ingreso (descendente).
export async function fetchHospitalizations(): Promise<HospitalizationType[]> {
  const database = requireDb();
  const snapshot = await getDocs(
    query(collection(database, COLLECTION), orderBy("admissionDate", "desc"))
  );
  return snapshot.docs.map((snap) => {
    const data = snap.data() as Omit<HospitalizationType, "id">;
    return { ...data, id: snap.id };
  });
}

// Crea una internación y devuelve su id.
export async function createHospitalization(input: HospitalizationInputType): Promise<string> {
  const database = requireDb();
  const ref = await addDoc(collection(database, COLLECTION), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return ref.id;
}

// Actualiza una internación existente.
export async function updateHospitalization(
  id: string,
  input: HospitalizationInputType
): Promise<void> {
  const database = requireDb();
  await updateDoc(doc(database, COLLECTION, id), {
    ...input,
    updatedAt: serverTimestamp()
  });
}

// Elimina una internación.
export async function deleteHospitalization(id: string): Promise<void> {
  const database = requireDb();
  await deleteDoc(doc(database, COLLECTION, id));
}
