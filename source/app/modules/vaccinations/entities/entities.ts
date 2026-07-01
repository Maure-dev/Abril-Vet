import type { Dispatch, SetStateAction } from "react";

// TODO: modelar el dominio de Vacunacion. Este es un tipo base de ejemplo.
export type VaccinationsItemType = {
  id: string;
  name: string;
};

export type VaccinationsDataType = {
  items: VaccinationsItemType[];
  loading: boolean;
};

export type VaccinationsContextType = {
  getVaccinationsState: VaccinationsDataType;
  setVaccinationsState: Dispatch<SetStateAction<VaccinationsDataType>>;
};
