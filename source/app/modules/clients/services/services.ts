import type {
  ClientAccountType,
  ClientAppointmentType,
  ClientInputType,
  ClientInvoiceType,
  ClientSaleType,
  ClientType
} from "@app/modules/clients/entities/entities";
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
  updateDoc,
  where
} from "firebase/firestore";

const COLLECTION = "clients";

// Verifica que Firestore esté disponible; si no, lanza (el hook captura y notifica).
function requireDb() {
  if (!isFirebaseConfigured || !db) {
    throw new Error("firestore-unavailable");
  }
  return db;
}

// Trae todos los clientes ordenados por apellido.
export async function fetchClients(): Promise<ClientType[]> {
  const database = requireDb();
  const snapshot = await getDocs(query(collection(database, COLLECTION), orderBy("lastName")));
  return snapshot.docs.map((snap) => {
    const data = snap.data() as Omit<ClientType, "id">;
    return { ...data, id: snap.id };
  });
}

// Crea un cliente y devuelve su id.
export async function createClient(input: ClientInputType): Promise<string> {
  const database = requireDb();
  const ref = await addDoc(collection(database, COLLECTION), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return ref.id;
}

// Actualiza un cliente existente.
export async function updateClient(id: string, input: ClientInputType): Promise<void> {
  const database = requireDb();
  await updateDoc(doc(database, COLLECTION, id), {
    ...input,
    updatedAt: serverTimestamp()
  });
}

// Elimina un cliente.
export async function deleteClient(id: string): Promise<void> {
  const database = requireDb();
  await deleteDoc(doc(database, COLLECTION, id));
}

// Ordena por fecha descendente (más reciente primero). Las fechas son ISO/yyyy-mm-dd.
function byDateDesc(a: { date: string }, b: { date: string }): number {
  return b.date.localeCompare(a.date);
}

// Estado de cuenta del cliente: lee por nombre las colecciones "appointments" (compartida),
// y "sales"/"invoices" (comerciales) sólo si includeFinancial es true, para no chocar con las
// reglas de Firestore cuando el usuario no tiene rol comercial. Ordena en cliente (sin índices).
export async function fetchClientAccount(
  clientId: string,
  includeFinancial: boolean
): Promise<ClientAccountType> {
  const database = requireDb();

  const appointmentsSnap = await getDocs(
    query(collection(database, "appointments"), where("clientId", "==", clientId))
  );
  const appointments = appointmentsSnap.docs
    .map((snap) => {
      const data = snap.data() as Omit<ClientAppointmentType, "id">;
      return { ...data, id: snap.id };
    })
    .sort(byDateDesc);

  if (!includeFinancial) {
    return { sales: [], invoices: [], appointments: appointments };
  }

  const salesSnap = await getDocs(
    query(collection(database, "sales"), where("clientId", "==", clientId))
  );
  const sales = salesSnap.docs
    .map((snap) => {
      const data = snap.data() as Omit<ClientSaleType, "id">;
      return { ...data, id: snap.id };
    })
    .sort(byDateDesc);

  const invoicesSnap = await getDocs(
    query(collection(database, "invoices"), where("clientId", "==", clientId))
  );
  const invoices = invoicesSnap.docs
    .map((snap) => {
      const data = snap.data() as Omit<ClientInvoiceType, "id">;
      return { ...data, id: snap.id };
    })
    .sort(byDateDesc);

  return { sales: sales, invoices: invoices, appointments: appointments };
}
