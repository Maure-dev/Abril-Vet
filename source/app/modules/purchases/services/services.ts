import { isFirebaseConfigured } from "@app/modules/main/services/firebase";
import { db } from "@app/modules/main/services/firestore";
import type {
  PurchaseInputType,
  PurchaseOrderType
} from "@app/modules/purchases/entities/entities";
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

const COLLECTION = "purchaseOrders";

// Verifica que Firestore esté disponible; si no, lanza (el hook captura y notifica).
function requireDb() {
  if (!isFirebaseConfigured || !db) {
    throw new Error("firestore-unavailable");
  }
  return db;
}

// Trae todas las órdenes de compra ordenadas por fecha (más recientes primero).
export async function fetchPurchases(): Promise<PurchaseOrderType[]> {
  const database = requireDb();
  const snapshot = await getDocs(query(collection(database, COLLECTION), orderBy("date", "desc")));
  return snapshot.docs.map((snap) => {
    const data = snap.data() as Omit<PurchaseOrderType, "id">;
    return { ...data, id: snap.id };
  });
}

// Crea una orden de compra y devuelve su id.
export async function createPurchase(input: PurchaseInputType): Promise<string> {
  const database = requireDb();
  const ref = await addDoc(collection(database, COLLECTION), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return ref.id;
}

// Actualiza una orden de compra existente.
export async function updatePurchase(id: string, input: PurchaseInputType): Promise<void> {
  const database = requireDb();
  await updateDoc(doc(database, COLLECTION, id), {
    ...input,
    updatedAt: serverTimestamp()
  });
}

// Elimina una orden de compra.
export async function deletePurchase(id: string): Promise<void> {
  const database = requireDb();
  await deleteDoc(doc(database, COLLECTION, id));
}
