# scripts

Scripts de administración de Abril Vet. **No** forman parte del bundle de la app (tienen su
propio `package.json` y dependencias, incluido `firebase-admin`).

## Instalación

```bash
cd scripts
npm install
```

## setUserRole — asignar roles a un usuario

Los roles de cada usuario viven en un *custom claim* `roles` (lista) del token de Firebase Auth (no
se puede setear desde la consola). La app y las `firestore.rules` lo leen de `request.auth.token.roles`.
Un usuario puede tener **varios roles** (ve las vistas de todos). Este script se usa sobre todo para
crear el **primer administrador**; después la gestión se hace desde el módulo Personal de la app.

1. Generá una clave de servicio: Firebase Console → **Project settings → Service accounts →
   Generar nueva clave privada**. Guardá el JSON como `scripts/service-account.json` (está en
   `.gitignore`) o en cualquier ruta fuera del repo. **Nunca lo commitees.**
2. Corré (uno o más roles separados por espacio):

```bash
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json \
  node setUserRole.mjs admin@abril.com admin
# varios roles:
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json \
  node setUserRole.mjs juan@abril.com vet receptionist
```

Roles válidos: `admin`, `vet`, `receptionist`, `assistant`.

Después de asignarlos, el usuario debe **cerrar sesión y volver a entrar** para que apliquen.
