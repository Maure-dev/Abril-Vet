import { isFirebaseConfigured } from "@app/modules/main/services/firebase";
import { db } from "@app/modules/main/services/firestore";
import type { SupplierInputType, SupplierType } from "@app/modules/suppliers/entities/entities";
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

const COLLECTION = "suppliers";

// Verifica que Firestore esté disponible; si no, lanza (el hook captura y notifica).
function requireDb() {
  if (!isFirebaseConfigured || !db) {
    throw new Error("firestore-unavailable");
  }
  return db;
}

// Trae todos los proveedores ordenados por nombre.
export async function fetchSuppliers(): Promise<SupplierType[]> {
  const database = requireDb();
  const snapshot = await getDocs(query(collection(database, COLLECTION), orderBy("name")));
  return snapshot.docs.map((snap) => {
    const data = snap.data() as Omit<SupplierType, "id">;
    return { ...data, id: snap.id };
  });
}

// Crea un proveedor y devuelve su id.
export async function createSupplier(input: SupplierInputType): Promise<string> {
  const database = requireDb();
  const ref = await addDoc(collection(database, COLLECTION), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return ref.id;
}

// Actualiza un proveedor existente.
export async function updateSupplier(id: string, input: SupplierInputType): Promise<void> {
  const database = requireDb();
  await updateDoc(doc(database, COLLECTION, id), {
    ...input,
    updatedAt: serverTimestamp()
  });
}

// Elimina un proveedor.
export async function deleteSupplier(id: string): Promise<void> {
  const database = requireDb();
  await deleteDoc(doc(database, COLLECTION, id));
}
