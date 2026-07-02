import type {
  ProductFormErrorsType,
  ProductFormType
} from "@app/modules/products/entities/entities";

// Función pura: valida el formulario de producto. Devuelve un mapa de errores por campo.
export function validateProductForm(form: ProductFormType): ProductFormErrorsType {
  const errors: ProductFormErrorsType = {};

  if (form.name.trim().length < 2) {
    errors.name = "Ingresá el nombre del producto";
  }
  if (form.code.trim().length === 0) {
    errors.code = "Ingresá el código del producto";
  }

  const salePrice = Number(form.salePrice);
  if (form.salePrice.trim().length === 0 || Number.isNaN(salePrice) || salePrice <= 0) {
    errors.salePrice = "El precio de venta debe ser mayor a 0";
  }

  if (form.costPrice.trim().length > 0) {
    const costPrice = Number(form.costPrice);
    if (Number.isNaN(costPrice) || costPrice < 0) {
      errors.costPrice = "El costo debe ser un número válido";
    }
  }

  if (form.ivaPct.trim().length > 0) {
    const iva = Number(form.ivaPct);
    if (Number.isNaN(iva) || iva < 0) {
      errors.ivaPct = "El IVA debe ser un número válido";
    }
  }

  if (form.stock.trim().length > 0) {
    const stock = Number(form.stock);
    if (Number.isNaN(stock) || stock < 0) {
      errors.stock = "El stock debe ser un número válido";
    }
  }

  if (form.minStock.trim().length > 0) {
    const minStock = Number(form.minStock);
    if (Number.isNaN(minStock) || minStock < 0) {
      errors.minStock = "El stock mínimo debe ser un número válido";
    }
  }

  if (form.expirationDate.trim().length > 0) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(form.expirationDate.trim());
    if (!match) {
      errors.expirationDate = "Fecha de vencimiento inválida";
    }
  }

  return errors;
}
