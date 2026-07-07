import type { LookupKindType, OptionType } from "@app/modules/main/entities/entities";
import { isFirebaseConfigured } from "@app/modules/main/services/firebase";
import { db } from "@app/modules/main/services/firestore";
import { collection, getDocs } from "firebase/firestore";

// Servicio de lookups compartido: lee colecciones de Firestore por nombre y las mapea a opciones
// { id, label }. Vive en `main` para que cualquier módulo pueda ofrecer selectores de entidades
// relacionadas sin importar el código de otros módulos (misma técnica que el módulo reports).

// Formas mínimas de cada documento (sólo los campos que necesitamos para la etiqueta).
type ClientDoc = { firstName?: string; lastName?: string; docId?: string };
type PatientDoc = { name?: string; species?: string; clientId?: string };
type StaffDoc = { firstName?: string; lastName?: string; roles?: string[] };
type ProductDoc = { name?: string; code?: string };
type SupplierDoc = { name?: string; cuit?: string };

// Quiénes pueden asignarse como profesional en un turno/atención: veterinarios y asistentes
// (no administradores ni recepcionistas).
const VET_ROLES = ["vet", "assistant"];

function personLabel(firstName?: string, lastName?: string): string {
  const last = (lastName ?? "").trim();
  const first = (firstName ?? "").trim();
  if (last && first) {
    return `${last}, ${first}`;
  }
  return last || first || "(sin nombre)";
}

function sortByLabel(options: OptionType[]): OptionType[] {
  return [...options].sort((a, b) => a.label.localeCompare(b.label, "es"));
}

// Devuelve las opciones de la colección indicada. Sin Firebase configurado devuelve [] (no rompe
// el formulario en dev/tests). Lanza sólo ante un error real de Firestore (lo captura el hook).
export async function fetchOptions(kind: LookupKindType): Promise<OptionType[]> {
  if (!isFirebaseConfigured || !db) {
    return [];
  }

  if (kind === "clients") {
    const snapshot = await getDocs(collection(db, "clients"));
    return sortByLabel(
      snapshot.docs.map((snap) => {
        const data = snap.data() as ClientDoc;
        return {
          id: snap.id,
          label: personLabel(data.firstName, data.lastName),
          sublabel: data.docId
        };
      })
    );
  }

  if (kind === "patients") {
    const snapshot = await getDocs(collection(db, "patients"));
    return sortByLabel(
      snapshot.docs.map((snap) => {
        const data = snap.data() as PatientDoc;
        return { id: snap.id, label: data.name ?? "(sin nombre)", clientId: data.clientId };
      })
    );
  }

  if (kind === "vets") {
    const snapshot = await getDocs(collection(db, "staff"));
    return sortByLabel(
      snapshot.docs
        .map((snap) => {
          const data = snap.data() as StaffDoc;
          return {
            id: snap.id,
            label: personLabel(data.firstName, data.lastName),
            roles: data.roles ?? []
          };
        })
        .filter((item) => item.roles.some((r) => VET_ROLES.includes(r)))
        .map((item) => ({ id: item.id, label: item.label }))
    );
  }

  if (kind === "suppliers") {
    const snapshot = await getDocs(collection(db, "suppliers"));
    return sortByLabel(
      snapshot.docs.map((snap) => {
        const data = snap.data() as SupplierDoc;
        return { id: snap.id, label: data.name ?? "(sin nombre)", sublabel: data.cuit };
      })
    );
  }

  // products
  const snapshot = await getDocs(collection(db, "products"));
  return sortByLabel(
    snapshot.docs.map((snap) => {
      const data = snap.data() as ProductDoc;
      return { id: snap.id, label: data.name ?? "(sin nombre)", sublabel: data.code };
    })
  );
}
