/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly ENV_FIREBASE_API_KEY?: string;
  readonly ENV_FIREBASE_AUTH_DOMAIN?: string;
  readonly ENV_FIREBASE_PROJECT_ID?: string;
  readonly ENV_FIREBASE_STORAGE_BUCKET?: string;
  readonly ENV_FIREBASE_MESSAGING_SENDER_ID?: string;
  readonly ENV_FIREBASE_APP_ID?: string;
  readonly ENV_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Paquetes de fuentes self-host (sólo CSS, sin tipos).
declare module "@fontsource-variable/inter";
declare module "@fontsource-variable/plus-jakarta-sans";
