import type {
  ProductCategoryType,
  ProductFormType,
  ProductsDataType
} from "@app/modules/products/entities/entities";

// Etiquetas en español para la UI (sin enum: mapas tipados).
export const CATEGORY_LABELS: Record<ProductCategoryType, string> = {
  medication: "Medicamento",
  food: "Alimento",
  accessory: "Accesorio",
  toy: "Juguete",
  hygiene: "Higiene",
  antiparasitic: "Antiparasitario",
  vaccine: "Vacuna",
  supply: "Insumo",
  pharmacy: "Farmacia",
  other: "Otro"
};

// Formulario vacío (alta de producto).
export const EMPTY_FORM: ProductFormType = {
  code: "",
  barcode: "",
  name: "",
  category: "medication",
  brand: "",
  supplierId: "",
  costPrice: "",
  salePrice: "",
  ivaPct: "21",
  stock: "0",
  minStock: "0",
  unit: "",
  expirationDate: "",
  batch: "",
  notes: ""
};

export const INITIAL_STATE = {
  PRODUCTS_PAGE: {
    items: [],
    loading: true,
    query: "",
    categoryFilter: "all",
    statusFilter: "all",
    mode: "list",
    selected: null,
    form: EMPTY_FORM,
    errors: {},
    saving: false
  } satisfies ProductsDataType
};
