import { isFirebaseConfigured } from "@app/modules/main/services/firebase";
import { db } from "@app/modules/main/services/firestore";
import type {
  PatientHistoryItemType,
  PatientInputType,
  PatientType
} from "@app/modules/patients/entities/entities";
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

// Fuentes clínicas que se agregan en la historia unificada del paciente.
const HISTORY_SOURCES = [
  {
    coll: "medicalRecords",
    kind: "medicalRecord",
    kindLabel: "Consulta",
    route: "/historia-clinica",
    dateField: "date",
    titleFields: ["reason", "diagnosis"]
  },
  {
    coll: "vaccinations",
    kind: "vaccination",
    kindLabel: "Vacuna",
    route: "/vacunacion",
    dateField: "date",
    titleFields: ["vaccineName"]
  },
  {
    coll: "dewormings",
    kind: "deworming",
    kindLabel: "Desparasitación",
    route: "/desparasitaciones",
    dateField: "date",
    titleFields: ["productName"]
  },
  {
    coll: "studies",
    kind: "study",
    kindLabel: "Estudio",
    route: "/estudios",
    dateField: "date",
    titleFields: ["name"]
  },
  {
    coll: "surgeries",
    kind: "surgery",
    kindLabel: "Cirugía",
    route: "/cirugias",
    dateField: "date",
    titleFields: ["type"]
  },
  {
    coll: "hospitalizations",
    kind: "hospitalization",
    kindLabel: "Internación",
    route: "/internaciones",
    dateField: "admissionDate",
    titleFields: ["reason"]
  }
] as const;

// Historia clínica unificada del paciente: junta los registros clínicos de todas las colecciones
// (por patientId) en un solo timeline ordenado por fecha descendente. Sólo lo consumen roles con
// acceso clínico (las reglas de Firestore deniegan estas colecciones a recepción).
export async function fetchPatientHistory(patientId: string): Promise<PatientHistoryItemType[]> {
  const database = requireDb();
  if (!patientId) {
    return [];
  }
  const groups = await Promise.all(
    HISTORY_SOURCES.map(async (source) => {
      const snapshot = await getDocs(
        query(collection(database, source.coll), where("patientId", "==", patientId))
      );
      return snapshot.docs.map((snap) => {
        const data = snap.data() as Record<string, unknown>;
        const title =
          source.titleFields
            .map((field) => String(data[field] ?? ""))
            .find((value) => value.length > 0) ?? source.kindLabel;
        return {
          kind: source.kind,
          kindLabel: source.kindLabel,
          id: snap.id,
          date: String(data[source.dateField] ?? ""),
          title: title,
          route: source.route
        } satisfies PatientHistoryItemType;
      });
    })
  );
  return groups.flat().sort((a, b) => b.date.localeCompare(a.date));
}
