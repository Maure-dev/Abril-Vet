import type { AuthDataType } from "@app/modules/auth/entities/entities";

export const INITIAL_STATE = {
  AUTH_PAGE: {
    mode: "login",
    form: { email: "", password: "" },
    errors: {},
    submitting: false,
    recoverySent: false
  } satisfies AuthDataType
};
