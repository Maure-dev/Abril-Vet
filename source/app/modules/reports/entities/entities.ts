import type { Dispatch, SetStateAction } from "react";

// TODO: modelar el dominio de Reportes. Este es un tipo base de ejemplo.
export type ReportsItemType = {
  id: string;
  name: string;
};

export type ReportsDataType = {
  items: ReportsItemType[];
  loading: boolean;
};

export type ReportsContextType = {
  getReportsState: ReportsDataType;
  setReportsState: Dispatch<SetStateAction<ReportsDataType>>;
};
