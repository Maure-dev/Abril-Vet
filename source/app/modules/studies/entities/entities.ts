import type { Dispatch, SetStateAction } from "react";

// TODO: modelar el dominio de Estudios. Este es un tipo base de ejemplo.
export type StudiesItemType = {
  id: string;
  name: string;
};

export type StudiesDataType = {
  items: StudiesItemType[];
  loading: boolean;
};

export type StudiesContextType = {
  getStudiesState: StudiesDataType;
  setStudiesState: Dispatch<SetStateAction<StudiesDataType>>;
};
