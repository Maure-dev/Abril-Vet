import type { PurchaseItemType } from "@app/modules/purchases/entities/entities";

// Función pura clave: calcula el total de una orden de compra como la suma de
// cantidad × costo unitario de cada ítem. Ignora cantidades/costos no válidos
// (NaN o negativos) tratándolos como 0, para no propagar valores basura.
export function computePurchaseTotal(items: PurchaseItemType[]): number {
  return items.reduce((sum, item) => {
    const quantity = Number.isFinite(item.quantity) && item.quantity > 0 ? item.quantity : 0;
    const unitCost = Number.isFinite(item.unitCost) && item.unitCost > 0 ? item.unitCost : 0;
    return sum + quantity * unitCost;
  }, 0);
}
