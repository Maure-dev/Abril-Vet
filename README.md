# Abril Vet

Software de gestión integral para clínicas y consultorios veterinarios: clientes, pacientes,
agenda, historia clínica, vacunación, estudios, cirugías, internaciones, facturación, ventas
(POS), inventario, compras, caja y reportes — en una sola plataforma, con modo claro y oscuro.

Frontend **React 19 + TypeScript + Vite + Tailwind CSS v4 + Firebase**, desplegable en **Vercel**.

## Requisitos

- Node.js 20+
- Un proyecto de Firebase (Auth + Firestore) para el backend
- Una cuenta de Cloudinary (tier gratuito) para la subida de archivos (fotos, estudios, PDFs)

## Puesta en marcha

```bash
./deploy.sh install     # instala dependencias en source/
cp source/.env.example source/.env   # completá las credenciales de Firebase
./deploy.sh start       # levanta el dev server (format + lint + vite)
```

Abrí http://localhost:5173. Sin credenciales de Firebase la app corre igual (modo
"no configurado") y muestra la pantalla de ingreso.

## Comandos

| Comando | Descripción |
| --- | --- |
| `./deploy.sh install` | Instala dependencias en `source/` |
| `./deploy.sh start` | Format + lint + servidor de desarrollo |
| `./deploy.sh build` | Format + lint + build de producción (`source/dist/`) |
| `./deploy.sh typecheck` | Chequeo de tipos (`tsc --noEmit`) |
| `./deploy.sh test` | Corre los tests una vez |
| `./deploy.sh test:coverage` | Tests con reporte de cobertura |

## Estructura

Monorepo simple: el proyecto npm vive en `source/` y `deploy.sh` (raíz) es un wrapper que
entra a `source/` y corre los scripts. El código está en `source/app/modules/`, organizado
por feature. La única capa compartida es `modules/main/`.

Ver [CLAUDE.md](CLAUDE.md) para la arquitectura, convenciones y el patrón de módulo en detalle.

## Variables de entorno

Las públicas (frontend) llevan prefijo `ENV_` y se embeben en el bundle; los secretos (Vercel
Functions) no. Ver [source/.env.example](source/.env.example).

## Deploy

Configurado para **Vercel** con el Root Directory del proyecto en la **raíz del repo** (ver
[vercel.json](vercel.json)): build `cd source && npm run build`, output `source/dist`, rewrites SPA
a `/index.html`. El backend son Vercel Functions en [api/](api/) (Firebase Admin SDK, con su propio
`package.json`). Las reglas de Firestore están en [firestore.rules](firestore.rules) (seguridad por roles).

Variables de servidor necesarias en Vercel (Environment Variables): `FIREBASE_SERVICE_ACCOUNT`
(service account, JSON o base64) y, opcional, `RESEND_API_KEY` + `RESEND_FROM` para invitaciones por email.

## Administración de usuarios

El rol de cada usuario (`admin`/`vet`/`receptionist`/`assistant`) vive en un custom claim de
Firebase Auth. El **primer administrador** se crea una única vez con el script de
[scripts/](scripts/) (`setUserRole.mjs`). A partir de ahí, ese admin gestiona todo el personal
desde el módulo **Personal** de la app: crear usuarios (que se crean en Firebase Auth), cambiar
contraseñas, enviar invitaciones por email y habilitar/deshabilitar el acceso.
