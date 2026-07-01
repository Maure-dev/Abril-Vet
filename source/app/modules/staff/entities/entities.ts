import type { Dispatch, SetStateAction } from "react";

// TODO: modelar el dominio de Personal. Este es un tipo base de ejemplo.
export type StaffItemType = {
  id: string;
  name: string;
};

export type StaffDataType = {
  items: StaffItemType[];
  loading: boolean;
};

export type StaffContextType = {
  getStaffState: StaffDataType;
  setStaffState: Dispatch<SetStateAction<StaffDataType>>;
};
