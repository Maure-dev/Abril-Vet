import { isFirebaseConfigured } from "@app/modules/main/services/firebase";
import { db } from "@app/modules/main/services/firestore";
import type { SaleInputType, SaleType } from "@app/modules/sales/entities/entities";
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

const COLLECTION = "sales";

// Verifica que Firestore esté disponible; si no, lanza (el hook captura y notifica).
function requireDb() {
  if (!isFirebaseConfigured || !db) {
    throw new Error("firestore-unavailable");
  }
  return db;
}

// Trae todas las ventas ordenadas por fecha (más recientes primero).
export async function fetchSales(): Promise<SaleType[]> {
  const database = requireDb();
  const snapshot = await getDocs(query(collection(database, COLLECTION), orderBy("date", "desc")));
  return snapshot.docs.map((snap) => {
    const data = snap.data() as Omit<SaleType, "id">;
    return { ...data, id: snap.id };
  });
}

// Crea una venta y devuelve su id.
export async function createSale(input: SaleInputType): Promise<string> {
  const database = requireDb();
  const ref = await addDoc(collection(database, COLLECTION), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return ref.id;
}

// Actualiza una venta existente.
export async function updateSale(id: string, input: SaleInputType): Promise<void> {
  const database = requireDb();
  await updateDoc(doc(database, COLLECTION, id), {
    ...input,
    updatedAt: serverTimestamp()
  });
}

// Elimina una venta.
export async function deleteSale(id: string): Promise<void> {
  const database = requireDb();
  await deleteDoc(doc(database, COLLECTION, id));
}
