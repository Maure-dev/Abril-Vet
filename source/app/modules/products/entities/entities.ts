import type { Dispatch, SetStateAction } from "react";

// ── Union types del dominio (sin enum) ──
export type ProductCategoryType =
  | "medication"
  | "food"
  | "accessory"
  | "toy"
  | "hygiene"
  | "antiparasitic"
  | "vaccine"
  | "supply"
  | "pharmacy"
  | "other";

// Filtro de categoría en la lista ("all" = todas).
export type CategoryFilterType = ProductCategoryType | "all";

// Filtro de estado en la lista ("all" = todos, activo/inactivo).
export type StatusFilterType = "all" | "active" | "inactive";

// Modo de la página (lista / alta / edición / ficha).
export type ProductsModeType = "list" | "create" | "edit" | "detail";

// ── Producto (artículo de venta / insumo) ──
export type ProductType = {
  id: string;
  code: string;
  barcode: string;
  name: string;
  category: ProductCategoryType;
  brand: string;
  supplierId: string; // referencia al proveedor (por ID)
  costPrice: number; // ARS
  salePrice: number; // ARS
  ivaPct: number;
  stock: number;
  minStock: number;
  unit: string;
  expirationDate: string; // ISO (yyyy-mm-dd) o "" si no aplica
  batch: string;
  notes: string;
  imageUrl: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

// Datos que se persisten (sin id ni timestamps: los pone el service).
export type ProductInputType = Omit<ProductType, "id" | "createdAt" | "updatedAt">;

// ── Formulario (campos numéricos como string para los inputs) ──
export type ProductFormType = {
  code: string;
  barcode: string;
  name: string;
  category: ProductCategoryType;
  brand: string;
  supplierId: string;
  costPrice: string;
  salePrice: string;
  ivaPct: string;
  stock: string;
  minStock: string;
  unit: string;
  expirationDate: string;
  batch: string;
  notes: string;
};

export type ProductFormErrorsType = Partial<Record<keyof ProductFormType, string>>;

// ── Estado y contexto del módulo ──
export type ProductsDataType = {
  items: ProductType[];
  loading: boolean;
  query: string;
  categoryFilter: CategoryFilterType;
  statusFilter: StatusFilterType;
  mode: ProductsModeType;
  selected: ProductType | null;
  form: ProductFormType;
  errors: ProductFormErrorsType;
  saving: boolean;
};

export type ProductsContextType = {
  getProductsState: ProductsDataType;
  setProductsState: Dispatch<SetStateAction<ProductsDataType>>;
};
