import type { Dispatch, SetStateAction } from "react";

// TODO: modelar el dominio de Internaciones. Este es un tipo base de ejemplo.
export type HospitalizationsItemType = {
  id: string;
  name: string;
};

export type HospitalizationsDataType = {
  items: HospitalizationsItemType[];
  loading: boolean;
};

export type HospitalizationsContextType = {
  getHospitalizationsState: HospitalizationsDataType;
  setHospitalizationsState: Dispatch<SetStateAction<HospitalizationsDataType>>;
};
