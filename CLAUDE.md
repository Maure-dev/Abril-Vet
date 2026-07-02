# CLAUDE.md — Abril Vet

Abril Vet. Software de gestión integral para clínicas y consultorios veterinarios.
Aplicación frontend React + TypeScript + Vite + Tailwind CSS + Firebase.

## Stack

- React 19 con TypeScript (SPA, sin SSR)
- Vite (bundler)
- Tailwind CSS v4 vía `@tailwindcss/vite` (tema CSS-first con `@theme`, sin `tailwind.config.js`)
- React Router (routing declarativo) — importar siempre desde `react-router`
- Firebase (Auth + Firestore) como backend
- Cloudinary para subida de archivos (fotos, estudios, PDFs) — tier gratuito, unsigned upload
  (reemplaza a Firebase Storage, que requiere plan Blaze)
- Axios para las Vercel Functions (recordatorios email/WhatsApp) y la subida a Cloudinary, siempre vía service tipado
- Biome (linter + formatter)
- Vitest + Testing Library (tests)

## Layout

- `source/` — raíz del proyecto npm del frontend (todo el código de la app en `source/app/`)
- `source/app/` — frontend (raíz de Vite en dev/build)
- `api/` — backend en la raíz del repo (mismo lineamiento que carilidesign): Vercel Functions (Node)
  con Firebase **Admin SDK**. Tiene su **propio `api/package.json` + `api/tsconfig.json` + `api/.gitignore`**
  (deps aisladas, NodeNext) — no está en el gate de tsc/biome del frontend. Administra usuarios de Auth (Personal).
- `deploy.sh` — wrapper que corre los scripts npm dentro de `source/`
- Deploy: **Vercel** (`vercel.json` en la raíz: `buildCommand: cd source && npm run build`,
  `outputDirectory: source/dist`, rewrites SPA). Root Directory del proyecto Vercel = raíz del repo.

```
source/app/
├── index.html              # entry HTML (lang es, SEO, <div id="root">)
├── index.tsx               # BrowserRouter + rutas (auth público + shell protegido)
├── index.css               # Tailwind v4 + tema violeta (@theme) light/dark
└── modules/
    ├── main/               # capa compartida (layout, estado global, hooks/UI, tests utils)
    └── [name]/             # un módulo por feature/página
        ├── [name]ModuleProvider.tsx
        ├── [name]Module.tsx
        ├── constants/constants.ts   # INITIAL_STATE.[NAME]_PAGE
        ├── entities/entities.ts     # todos los tipos del módulo
        ├── states/                  # [name]Context.tsx + [name]Provider.tsx
        ├── services/services.ts     # llamadas a Firestore tipadas
        ├── hooks/                   # custom hooks (acciones; acá van try/catch + notificaciones)
        ├── helpers/                 # funciones puras
        └── interfaces/              # componentes UI del módulo
```

### Reglas de estructura

- Cada módulo es **independiente**: nunca importar `states/`, `services/` ni `hooks/` de otro módulo.
- El módulo `main` es la única capa compartida. Tipos compartidos en `modules/main/entities/entities.ts`.
- Todos los tipos del módulo viven en su `entities/entities.ts`. No crear archivos de tipos sueltos.
- Path alias: `@app/*` → `source/app/*` (configurado en `tsconfig.json` y `vite.config.ts`).

## Patrón de módulo

Orden de creación: **entities → constants → states (Context + Provider) → services → hooks → helpers → interfaces → Module → ModuleProvider → ruta**.

| Artifact          | Convención                          | Ejemplo                             |
| ----------------- | ----------------------------------- | ----------------------------------- |
| Carpeta           | `camelCase`                         | `modules/patients/`                 |
| ModuleProvider    | `[name]ModuleProvider.tsx`          | `patientsModuleProvider.tsx`        |
| Module            | `[name]Module.tsx`                  | `patientsModule.tsx`                |
| Context           | `[name]Context.tsx`                 | `patientsContext.tsx`               |
| Provider          | `[name]Provider.tsx`                | `patientsProvider.tsx`              |
| Provider hook     | `use[Name]Provider`                 | `usePatientsProvider`               |
| Getter / Setter   | `get[Name]State` / `set[Name]State` | `getPatientsState` / `setPatientsState` |
| INITIAL_STATE key | `[NAME]_PAGE`                       | `PATIENTS_PAGE`                     |
| Interface         | sufijo `Interface`                  | `patientsListInterface.tsx`         |

El módulo **`patients`** es la plantilla end-to-end de referencia (entities, states, services Firestore,
hook de acciones, helpers con tests, interfaces list/form/detail, tests de hook y helpers).

## Estado

React Context + `useState` exclusivamente (sin Redux/Zustand).

- Un único `useState` por módulo con todo el estado de la página como objeto.
- Estado inicial en `constants/constants.ts` bajo `INITIAL_STATE.[NAME]_PAGE` con `satisfies [Name]DataType`.
- El provider expone el par `get[Name]State` / `set[Name]State`.
- Updates siempre con callback: `setState((prev) => ({ ...prev, ... }))`.
- Context: `createContext<[Name]ContextType | null>(null)`. `ChildrenType` desde `modules/main`.
- Estado global (`main`): `{ notification, session }`. La sesión (Firebase Auth) incluye los `roles`
  del usuario (lista de `admin | vet | receptionist | assistant`), leídos del custom claim `roles`
  del token. Un usuario puede tener **varios roles**. `useSession().hasRole(allowed)` devuelve true si
  hay intersección. La navegación filtra por rol: clínica = vet/asistente/admin; comercial =
  recepcionista/admin; Personal = admin.

## Routing

- Rutas en `app/index.tsx`, anidadas bajo `MainModuleProvider` (estado global + compuerta de arranque).
- `auth` es público; el resto de la app va dentro de `RequireAuthInterface` + `AppLayoutInterface`
  (shell con sidebar + topbar). `/personal` requiere rol `admin` (`<RequireAuthInterface roles={["admin"]} />`).
- El element de ruta es siempre un `*ModuleProvider`, nunca un `*Module` directo.
- Params, navegación y estado de ruta vía el hook compartido `useRouter()` (`modules/main/hooks/`),
  nunca `useParams()`/`useNavigate()` directo en los módulos.

## Tema (claro / oscuro)

- `index.css` define la paleta cruda en `:root` (light) y `[data-theme="dark"]` (dark), y los tokens
  semánticos en `@theme inline` (así las utilidades responden al tema en runtime).
- El hook `useTheme()` (`modules/main/hooks`) es el único que muta `data-theme` y persiste en localStorage.
- Paleta: violeta de marca (`brand` #4A148C), lavanda, oro (highlights), verde menta (éxito) y azul
  confianza (info), sobre neutros fríos.

## Services

- Todas las llamadas a Firestore/Firebase en `modules/[name]/services/services.ts`, tipadas
  (request y response) con tipos del propio módulo. Funciones async que hacen `throw` en error.
- El manejo de errores (try/catch) y las notificaciones van en los **hooks**, no en los services.
- Firebase se inicializa en `modules/main/services/firebase.ts` (Auth + Firestore; guarda
  `isFirebaseConfigured`: la app corre en dev/tests sin credenciales).
- Archivos: `modules/main/services/fileUpload.ts` sube a Cloudinary (unsigned, `isUploadConfigured`).
  No se usa Firebase Storage.
- **Administración de usuarios (Personal):** las operaciones privilegiadas (crear usuario en Auth,
  deshabilitar acceso, cambiar contraseña, setear el rol/claim) NO se pueden hacer desde el cliente.
  El módulo `staff` lee el directorio por Firestore, pero para escribir llama a las Functions de
  `api/staff` (Admin SDK) vía axios, mandando el ID token del admin (`Authorization: Bearer`).
  El backend verifica que el que llama tenga rol `admin` (`api/_lib/http.ts`). El primer admin se
  bootstrapea una única vez con `scripts/setUserRole.mjs`.
- Variables de entorno públicas con prefijo `ENV_` (`envPrefix`, embebidas en el bundle). Los secretos
  NO llevan `ENV_` y sólo los consumen las Vercel Functions en `/api`.
- **Seguridad de datos (`firestore.rules`):** deny-by-default, por área/rol (lee el claim `roles`).
  Compartido (todo el personal): `clients`, `patients`, `appointments`. Clínica (admin/vet/assistant):
  `medicalRecords`, `vaccinations`, `reminders`, `studies`, `surgeries`, `hospitalizations`. Comercial
  (admin/receptionist): `sales`, `invoices`, `products`, `stockMovements`, `purchaseOrders`,
  `cashSessions`, `reports`. `staff`: lectura del personal, escritura sólo por backend. Borrado: admin.
  Si agregás una colección nueva, sumá su `match`: lo no declarado queda denegado.

## Code style

- Biome como único formatter/linter (config en `source/biome.json`): ancho 100, indent 2 espacios, sin trailing commas.
- Sin enums (usar union types o `as const`). Sin `any` (usar `unknown` + type guards). Sin non-null assertions (`!`).
- `import type` para imports de solo tipos. `const` siempre. Igualdad estricta (`===`).
- `strict: false` en tsconfig; los tipos vienen del `entities/entities.ts` del módulo.
- **Código** (variables, funciones, tipos, archivos, services) en **inglés**. **Texto de usuario** y **comentarios** en **español (es-AR)**.
- **Unidades relativas obligatorias**: no usar `px` en CSS propio (usar `rem`, `%`, `vh`/`vw`). Excepciones: SVG `viewBox` y valores internos de `box-shadow`.

## Tests

- Vitest (runner) + jsdom. `globals: false`: importar `describe`, `it`, `expect` (y `vi`, `act`) explícitamente desde `"vitest"`.
- Setup: `source/app/modules/main/tests/setup.ts`. Utilidades compartidas en `modules/main/tests/`
  (`renderWithProviders`, `renderHookWithProviders`, `factories`, `mockFirebase`, `mockAxios`).
- Naming: `<archivo>.test.ts` para lógica pura, `.test.tsx` para componentes/hooks con JSX. Un test por archivo fuente,
  espejando la estructura del módulo bajo `tests/`.

## Comandos

```bash
./deploy.sh install     # instala dependencias en source/
./deploy.sh start       # format + lint + dev server
./deploy.sh build       # format + lint + build de producción (source/dist/)
./deploy.sh typecheck   # tsc --noEmit
./deploy.sh test        # corre los tests una vez

# o directo desde source/
npm start · npm run build · npm run lint · npm run format · npm run typecheck · npm test
```

## Estado del scaffold

- **End-to-end:** `main` (compartido), `auth` (ingreso + recuperar clave), `dashboard`, `patients` (plantilla).
- **Stubs** (estructura + entities + estado + ruta + UI mínima, listos para implementar): `clients`,
  `appointments`, `medicalRecords`, `vaccinations`, `reminders`, `studies`, `surgeries`,
  `hospitalizations`, `staff`, `billing`, `products`, `inventory`, `purchases`, `sales`,
  `cashRegister`, `reports`.
