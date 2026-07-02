// Función pura: formatea un monto en pesos argentinos para la UI.
// Ejemplo: 1500 => "$ 1.500". Se usa en la lista y en la ficha de producto.
export function formatMoney(amount: number): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  return `$ ${safe.toLocaleString("es-AR")}`;
}
