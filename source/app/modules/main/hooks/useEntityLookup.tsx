import type { LookupKindType, OptionType } from "@app/modules/main/entities/entities";
import { useEntityOptions } from "@app/modules/main/hooks/useEntityOptions";
import { useMemo } from "react";

// Resolución de IDs → nombre para mostrar (no sólo para selects). Reutiliza useEntityOptions
// (que ya trae { id, label } de la colección) y arma un índice por id.
export const useEntityLookup = (kind: LookupKindType) => {
  const { options, loading } = useEntityOptions(kind);

  const byId = useMemo(() => {
    const map = new Map<string, OptionType>();
    for (const option of options) {
      map.set(option.id, option);
    }
    return map;
  }, [options]);

  const getOption = (id: string): OptionType | null => (id ? (byId.get(id) ?? null) : null);
  const getLabel = (id: string): string => (id ? (byId.get(id)?.label ?? "") : "");

  return {
    options: options,
    loading: loading,
    byId: byId,
    getOption: getOption,
    getLabel: getLabel
  };
};
