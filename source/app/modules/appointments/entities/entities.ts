import type { Dispatch, SetStateAction } from "react";

// TODO: modelar el dominio de Agenda. Este es un tipo base de ejemplo.
export type AppointmentsItemType = {
  id: string;
  name: string;
};

export type AppointmentsDataType = {
  items: AppointmentsItemType[];
  loading: boolean;
};

export type AppointmentsContextType = {
  getAppointmentsState: AppointmentsDataType;
  setAppointmentsState: Dispatch<SetStateAction<AppointmentsDataType>>;
};
