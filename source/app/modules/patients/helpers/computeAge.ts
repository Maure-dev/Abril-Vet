// Función pura: calcula la edad (automática) de un paciente a partir de su fecha de
// nacimiento (ISO yyyy-mm-dd). Devuelve una etiqueta en español, o "" si no hay dato
// o la fecha es inválida/futura. `now` es inyectable para tests deterministas.
//
// Parseamos por componentes (no `new Date(str)`) para evitar el desfase de zona horaria:
// `new Date("2023-05-01")` es UTC y en TZ negativas cae el día anterior.
export function computeAge(birthDate: string | null, now: Date = new Date()): string {
  if (!birthDate) {
    return "";
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(birthDate);
  if (!match) {
    return "";
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const birth = new Date(year, month - 1, day);
  // Rechaza fechas que no round-trippean (por ejemplo 2023-13-40).
  if (birth.getFullYear() !== year || birth.getMonth() !== month - 1 || birth.getDate() !== day) {
    return "";
  }

  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  if (now.getDate() < birth.getDate()) {
    months -= 1;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  if (years < 0) {
    return ""; // fecha futura
  }

  const parts: string[] = [];
  if (years > 0) {
    parts.push(years === 1 ? "1 año" : `${years} años`);
  }
  if (months > 0) {
    parts.push(months === 1 ? "1 mes" : `${months} meses`);
  }
  if (parts.length === 0) {
    return "Menos de 1 mes";
  }
  return parts.join(" y ");
}
