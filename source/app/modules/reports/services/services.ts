import { isFirebaseConfigured } from "@app/modules/main/services/firebase";
import { db } from "@app/modules/main/services/firestore";
import { METRIC_COLLECTIONS } from "@app/modules/reports/constants/constants";
import type {
  MetricKeyType,
  ReportMetricInputType,
  SaleForReportType
} from "@app/modules/reports/entities/entities";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDocs,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";

// Módulo de sólo lectura: el service cuenta varias colecciones de Firestore por nombre
// (clients, patients, appointments, sales) sin importar otros módulos.
const COLLECTION = "reports";

// Verifica que Firestore esté disponible; si no, lanza (el hook captura y notifica).
function requireDb() {
  if (!isFirebaseConfigured || !db) {
    throw new Error("firestore-unavailable");
  }
  return db;
}

// Cuenta los documentos de una colección con el agregador del servidor.
export async function fetchMetricCount(key: MetricKeyType): Promise<number> {
  const database = requireDb();
  const snapshot = await getCountFromServer(collection(database, METRIC_COLLECTIONS[key]));
  return snapshot.data().count;
}

// Trae las ventas (fecha + total) para el gráfico de facturación por mes.
export async function fetchSalesForReports(): Promise<SaleForReportType[]> {
  const database = requireDb();
  const snapshot = await getDocs(collection(database, "sales"));
  return snapshot.docs.map((snap) => {
    const data = snap.data() as { date?: string; total?: number };
    return { date: data.date ?? "", total: typeof data.total === "number" ? data.total : 0 };
  });
}

// Crea un reporte guardado y devuelve su id (forma CRUD de la plantilla).
export async function createReport(input: ReportMetricInputType): Promise<string> {
  const database = requireDb();
  const ref = await addDoc(collection(database, COLLECTION), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return ref.id;
}

// Actualiza un reporte guardado existente.
export async function updateReport(id: string, input: ReportMetricInputType): Promise<void> {
  const database = requireDb();
  await updateDoc(doc(database, COLLECTION, id), {
    ...input,
    updatedAt: serverTimestamp()
  });
}

// Elimina un reporte guardado.
export async function deleteReport(id: string): Promise<void> {
  const database = requireDb();
  await deleteDoc(doc(database, COLLECTION, id));
}
