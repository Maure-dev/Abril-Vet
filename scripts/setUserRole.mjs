// Asigna los roles (custom claim `roles`) a un usuario de Firebase Auth.
//
// Los roles NO se pueden setear desde la consola de Firebase: hay que usar el Admin SDK.
// La app lee este claim (`request.auth.token.roles`) para la navegación por rol y las firestore.rules.
// Un usuario puede tener varios roles (ve las vistas de todos).
//
// Requisitos:
//   1) npm install            (dentro de scripts/)
//   2) Una clave de servicio: Firebase Console → Project settings → Service accounts →
//      Generar nueva clave privada. Guardá el JSON FUERA del repo (o en scripts/service-account.json,
//      que está en .gitignore). NUNCA lo commitees.
//
// Uso (uno o más roles separados por espacio):
//   GOOGLE_APPLICATION_CREDENTIALS=./service-account.json \
//     node setUserRole.mjs <email> <rol> [rol...]
//   Ej.: node setUserRole.mjs admin@abril.com admin
//        node setUserRole.mjs juan@abril.com vet receptionist
//
// Después de correrlo, el usuario debe cerrar sesión y volver a entrar para que aplique.

import { readFileSync } from "node:fs";
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const VALID_ROLES = ["admin", "vet", "receptionist", "assistant"];

const email = process.argv[2];
const roles = [...new Set(process.argv.slice(3).filter((r) => VALID_ROLES.includes(r)))];

if (!email || roles.length === 0) {
  console.error(`Uso: node setUserRole.mjs <email> <rol> [rol...]  (roles: ${VALID_ROLES.join(", ")})`);
  process.exit(1);
}

const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || "./service-account.json";

let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync(credentialsPath, "utf8"));
} catch {
  console.error(
    `No se pudo leer la clave de servicio en "${credentialsPath}".\n` +
      "Generála en Firebase Console → Project settings → Service accounts, y pasá la ruta " +
      "con GOOGLE_APPLICATION_CREDENTIALS o dejala en scripts/service-account.json."
  );
  process.exit(1);
}

initializeApp({ credential: cert(serviceAccount) });

try {
  const user = await getAuth().getUserByEmail(email);
  await getAuth().setCustomUserClaims(user.uid, { roles });
  console.log(`OK: ${email} (uid ${user.uid}) → roles=[${roles.join(", ")}].`);
  console.log("El usuario debe cerrar sesión y volver a entrar para que apliquen.");
  process.exit(0);
} catch (error) {
  console.error(
    `Error al asignar los roles a ${email}:`,
    error instanceof Error ? error.message : error
  );
  process.exit(1);
}
