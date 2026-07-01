import type { Dispatch, SetStateAction } from "react";

// TODO: modelar el dominio de Recordatorios. Este es un tipo base de ejemplo.
export type RemindersItemType = {
  id: string;
  name: string;
};

export type RemindersDataType = {
  items: RemindersItemType[];
  loading: boolean;
};

export type RemindersContextType = {
  getRemindersState: RemindersDataType;
  setRemindersState: Dispatch<SetStateAction<RemindersDataType>>;
};
