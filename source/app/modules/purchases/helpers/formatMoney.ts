// Función pura: formatea un monto entero en pesos argentinos (Intl es-AR, sin decimales).
// Toda la app maneja ARS como entero (ver MoneyType en modules/main/entities/entities).
const FORMATTER = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

export function formatMoney(amount: number): string {
  const value = Number.isFinite(amount) ? amount : 0;
  return FORMATTER.format(value);
}
