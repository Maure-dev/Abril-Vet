// Función pura: formatea una fecha ISO ("yyyy-mm-dd" o datetime "yyyy-mm-ddTHH:mm") como
// "dd/mm/aaaa". Parte el string a mano para evitar corrimientos de zona horaria (AR = UTC-3).
export function formatDate(value: string): string {
  if (!value) {
    return "—";
  }
  const datePart = value.split("T")[0];
  const parts = datePart.split("-");
  if (parts.length !== 3) {
    return value;
  }
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}
