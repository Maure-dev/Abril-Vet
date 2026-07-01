/// <reference types="vitest/config" />
import path from "node:path";
import { defineConfig, type UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const isTest = mode === "test";

  const config: UserConfig = {
    // En dev/build la raíz es `app/` (donde vive index.html).
    // En test la raíz es `source/` para que los paths de include/setup resuelvan bien.
    root: isTest ? __dirname : path.resolve(__dirname, "app"),
    publicDir: path.resolve(__dirname, "public"),
    // Los .env viven en `source/` (no en `app/`). Sin esto, en dev Vite los buscaría
    // en `app/` (el root) y nunca leería `source/.env`.
    envDir: __dirname,
    envPrefix: "ENV_",
    resolve: {
      alias: [{ find: "@app", replacement: path.resolve(__dirname, "app") }]
    },
    server: {
      host: true,
      port: 5173,
      strictPort: true,
      proxy: {
        // En dev las Vercel Functions corren con `vercel dev` (puerto 3000).
        // Si usás `vercel dev` directamente (sirve front + /api juntos), este proxy no se usa.
        "/api": { target: "http://localhost:3000", changeOrigin: true }
      }
    },
    build: {
      outDir: path.resolve(__dirname, "dist"),
      emptyOutDir: true
    },
    clearScreen: false,
    plugins: [react(), tailwindcss()],
    test: {
      environment: "jsdom",
      globals: false,
      include: ["app/**/*.test.{ts,tsx}"],
      setupFiles: [path.resolve(__dirname, "app/modules/main/tests/setup.ts")],
      css: true,
      coverage: {
        provider: "v8",
        reporter: ["text", "html", "lcov"],
        include: ["app/**/*.{ts,tsx}"],
        exclude: [
          "app/**/entities/**",
          "app/index.tsx",
          "app/vite-env.d.ts",
          "app/**/*.test.{ts,tsx}"
        ]
      }
    }
  };

  return config;
});
