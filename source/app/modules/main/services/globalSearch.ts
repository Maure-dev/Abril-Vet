import type { GlobalResultType, OptionType } from "@app/modules/main/entities/entities";
import { fetchOptions } from "@app/modules/main/services/lookups";

// Búsqueda global: clientes y pacientes por nombre/dato (reutiliza el service de lookups, que ya
// lee esas colecciones con los permisos correctos —accesibles a todo el personal—). Filtra en cliente.
export async function searchAll(term: string): Promise<GlobalResultType[]> {
  const query = term.trim().toLowerCase();
  if (query.length < 2) {
    return [];
  }
  const [clients, patients] = await Promise.all([
    fetchOptions("clients"),
    fetchOptions("patients")
  ]);

  const matches = (option: OptionType): boolean =>
    `${option.label} ${option.sublabel ?? ""}`.toLowerCase().includes(query);

  const clientResults: GlobalResultType[] = clients
    .filter(matches)
    .slice(0, 5)
    .map((option) => ({
      kind: "client",
      id: option.id,
      label: option.label,
      sublabel: option.sublabel
    }));

  const patientResults: GlobalResultType[] = patients
    .filter(matches)
    .slice(0, 5)
    .map((option) => ({
      kind: "patient",
      id: option.id,
      label: option.label,
      sublabel: option.sublabel
    }));

  return [...clientResults, ...patientResults];
}
