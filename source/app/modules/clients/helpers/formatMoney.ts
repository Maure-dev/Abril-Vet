// Función pura: formatea un monto en pesos argentinos (ARS, sin decimales).
// Los negativos los muestra Intl con el signo delante (deuda).
export function formatMoney(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(value);
}
