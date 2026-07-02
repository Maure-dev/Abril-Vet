import type {
  DashAppointmentType,
  DashHospitalizationType,
  DashVaccinationType
} from "@app/modules/dashboard/entities/entities";
import { isFirebaseConfigured } from "@app/modules/main/services/firebase";
import { db } from "@app/modules/main/services/firestore";
import { collection, getDocs } from "firebase/firestore";

// El dashboard lee varias colecciones por nombre (como reports), sin importar otros módulos.
// El gating por rol lo hace el hook; las reglas de Firestore son la barrera real.
function requireDb() {
  if (!isFirebaseConfigured || !db) {
    throw new Error("firestore-unavailable");
  }
  return db;
}

const str = (value: unknown): string => (typeof value === "string" ? value : "");
const num = (value: unknown): number => (typeof value === "number" ? value : 0);

// Compartido (todo el personal).
export async function fetchAppointments(): Promise<DashAppointmentType[]> {
  const database = requireDb();
  const snapshot = await getDocs(collection(database, "appointments"));
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      date: str(data.date),
      type: str(data.type),
      status: str(data.status),
      patientId: str(data.patientId)
    };
  });
}

export async function countActiveClients(): Promise<number> {
  const database = requireDb();
  const snapshot = await getDocs(collection(database, "clients"));
  return snapshot.docs.filter((doc) => doc.data().isActive !== false).length;
}

export async function countActivePatients(): Promise<number> {
  const database = requireDb();
  const snapshot = await getDocs(collection(database, "patients"));
  return snapshot.docs.filter((doc) => doc.data().isActive !== false).length;
}

// Clínica (admin / vet / asistente).
export async function fetchVaccinations(): Promise<DashVaccinationType[]> {
  const database = requireDb();
  const snapshot = await getDocs(collection(database, "vaccinations"));
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      patientId: str(data.patientId),
      vaccineName: str(data.vaccineName),
      nextDoseDate: str(data.nextDoseDate)
    };
  });
}

export async function fetchActiveHospitalizations(): Promise<DashHospitalizationType[]> {
  const database = requireDb();
  const snapshot = await getDocs(collection(database, "hospitalizations"));
  return snapshot.docs
    .filter((doc) => str(doc.data().status) === "active")
    .map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        patientId: str(data.patientId),
        reason: str(data.reason),
        admissionDate: str(data.admissionDate)
      };
    });
}

// Comercial (admin / recepcionista).
export async function sumSalesTotal(dayPrefix: string): Promise<number> {
  const database = requireDb();
  const snapshot = await getDocs(collection(database, "sales"));
  return snapshot.docs
    .filter((doc) => str(doc.data().date).startsWith(dayPrefix))
    .reduce((sum, doc) => sum + num(doc.data().total), 0);
}

export async function sumInvoicesTotal(monthPrefix: string): Promise<number> {
  const database = requireDb();
  const snapshot = await getDocs(collection(database, "invoices"));
  return snapshot.docs
    .filter((doc) => str(doc.data().date).startsWith(monthPrefix))
    .reduce((sum, doc) => sum + num(doc.data().total), 0);
}
