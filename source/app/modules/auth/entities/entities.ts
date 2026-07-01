import type { Dispatch, SetStateAction } from "react";

export type AuthModeType = "login" | "recover";

export type AuthFormType = {
  email: string;
  password: string;
};

export type AuthFormErrorsType = Partial<Record<keyof AuthFormType, string>>;

export type AuthDataType = {
  mode: AuthModeType;
  form: AuthFormType;
  errors: AuthFormErrorsType;
  submitting: boolean;
  recoverySent: boolean;
};

export type AuthContextType = {
  getAuthState: AuthDataType;
  setAuthState: Dispatch<SetStateAction<AuthDataType>>;
};
