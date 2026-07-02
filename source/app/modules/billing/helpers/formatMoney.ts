// Formateador de montos en pesos argentinos (entero). Única convención monetaria de la app.
const FORMATTER = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0
});

// Función pura: formatea un monto ARS entero como texto de moneda (es-AR).
export function formatMoney(amount: number): string {
  return FORMATTER.format(amount);
}
