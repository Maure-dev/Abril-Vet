// Funciones puras de métricas de producto (testeables).

// Margen de ganancia en porcentaje, redondeado al entero.
// Devuelve 0 si el costo es <= 0 (no hay base para calcular).
export function computeMargin(costPrice: number, salePrice: number): number {
  if (costPrice <= 0) {
    return 0;
  }
  return Math.round(((salePrice - costPrice) / costPrice) * 100);
}

// Indica si el stock está en o por debajo del mínimo (alerta de reposición).
export function isLowStock(stock: number, minStock: number): boolean {
  return stock <= minStock;
}
