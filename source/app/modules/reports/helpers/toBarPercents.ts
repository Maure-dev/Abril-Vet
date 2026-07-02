// Función pura clave: convierte una lista de valores en porcentajes relativos al máximo.
// Cada valor se expresa como % del mayor de la lista (0 si el máximo es 0), redondeado a entero.
// Se usa para dibujar barras con CSS (width en %), sin librería de gráficos.
export function toBarPercents(values: number[]): number[] {
  const max = values.reduce((acc, value) => (value > acc ? value : acc), 0);
  if (max <= 0) {
    return values.map(() => 0);
  }
  return values.map((value) => Math.round((value / max) * 100));
}
