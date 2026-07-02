// Función pura: formatea un monto en pesos argentinos (entero) como texto es-AR.
// Los montos no finitos se tratan como 0. No usa decimales (convención ARS del proyecto).
export function formatMoney(amount: number): string {
  const safe = Number.isFinite(amount) ? Math.round(amount) : 0;
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(safe);
}
