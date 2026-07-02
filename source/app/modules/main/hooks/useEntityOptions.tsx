import type { LookupKindType, OptionType } from "@app/modules/main/entities/entities";
import { fetchOptions } from "@app/modules/main/services/lookups";
import { useEffect, useState } from "react";

// Hook compartido: carga las opciones de una colección (clients/patients/vets/products) para
// alimentar un EntitySelectInterface. Se refresca al cambiar `kind`.
export const useEntityOptions = (kind: LookupKindType) => {
  const [options, setOptions] = useState<OptionType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchOptions(kind)
      .then((result) => {
        if (active) {
          setOptions(result);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setOptions([]);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [kind]);

  return { options: options, loading: loading };
};
