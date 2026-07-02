import { auth, isFirebaseConfigured } from "@app/modules/main/services/firebase";
import { db } from "@app/modules/main/services/firestore";
import type {
  StaffCreatePayloadType,
  StaffResetLinkResultType,
  StaffType,
  StaffUpdatePayloadType
} from "@app/modules/staff/entities/entities";
import axios from "axios";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

const COLLECTION = "staff";
const API = "/api/staff";

// Las lecturas van directo a Firestore (permitidas al personal por las reglas).
function requireDb() {
  if (!isFirebaseConfigured || !db) {
    throw new Error("firestore-unavailable");
  }
  return db;
}

// Las escrituras (crear/editar/deshabilitar/contraseña) pasan por el backend (Admin SDK), que
// exige el ID token del admin que llama. Sin sesión, no hay token.
async function authHeaders(): Promise<{ Authorization: string }> {
  const user = auth?.currentUser;
  if (!user) {
    throw new Error("auth-required");
  }
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

// Trae todo el personal ordenado por apellido.
export async function fetchStaff(): Promise<StaffType[]> {
  const database = requireDb();
  const snapshot = await getDocs(query(collection(database, COLLECTION), orderBy("lastName")));
  return snapshot.docs.map((snap) => {
    const data = snap.data() as Omit<StaffType, "id">;
    return { ...data, id: snap.id };
  });
}

// Crea el usuario en Firebase Auth (+ rol + perfil) vía el backend. Devuelve el registro creado.
export async function createStaffMember(payload: StaffCreatePayloadType): Promise<StaffType> {
  const response = await axios.post<StaffType>(API, payload, { headers: await authHeaders() });
  return response.data;
}

// Actualiza perfil/rol/estado/contraseña y/o genera link de invitación (según payload).
export async function updateStaffMember(
  uid: string,
  payload: StaffUpdatePayloadType
): Promise<StaffResetLinkResultType> {
  const response = await axios.patch<StaffResetLinkResultType>(`${API}/${uid}`, payload, {
    headers: await authHeaders()
  });
  return response.data;
}

// Elimina el usuario de Auth y su perfil.
export async function deleteStaffMember(uid: string): Promise<void> {
  await axios.delete(`${API}/${uid}`, { headers: await authHeaders() });
}
