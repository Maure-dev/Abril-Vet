import type { OptionType } from "@app/modules/main/entities/entities";

// Función pura: filtra opciones de un selector por texto (sobre label + sublabel), case-insensitive.
export function filterOptions(options: OptionType[], query: string): OptionType[] {
  const q = query.trim().toLowerCase();
  if (q.length === 0) {
    return options;
  }
  return options.filter((option) =>
    `${option.label} ${option.sublabel ?? ""}`.toLowerCase().includes(q)
  );
}
