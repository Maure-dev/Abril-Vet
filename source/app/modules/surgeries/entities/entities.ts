import type { Dispatch, SetStateAction } from "react";

// TODO: modelar el dominio de Cirugias. Este es un tipo base de ejemplo.
export type SurgeriesItemType = {
  id: string;
  name: string;
};

export type SurgeriesDataType = {
  items: SurgeriesItemType[];
  loading: boolean;
};

export type SurgeriesContextType = {
  getSurgeriesState: SurgeriesDataType;
  setSurgeriesState: Dispatch<SetStateAction<SurgeriesDataType>>;
};
