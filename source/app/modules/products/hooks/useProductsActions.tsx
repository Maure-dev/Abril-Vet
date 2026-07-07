import { useNotification } from "@app/modules/main/hooks/useNotification";
import { EMPTY_FORM } from "@app/modules/products/constants/constants";
import type {
  CategoryFilterType,
  ProductFormType,
  ProductType,
  StatusFilterType
} from "@app/modules/products/entities/entities";
import { formFromProduct, toProductInput } from "@app/modules/products/helpers/productMappers";
import { validateProductForm } from "@app/modules/products/helpers/validateProductForm";
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct
} from "@app/modules/products/services/services";
import { useProductsProvider } from "@app/modules/products/states/productsProvider";

export const useProductsActions = () => {
  const { getProductsState, setProductsState } = useProductsProvider();
  const { onNotification } = useNotification();

  // Carga inicial de productos.
  const handleLoad = async (): Promise<void> => {
    setProductsState((s) => ({ ...s, loading: true }));
    try {
      const items = await fetchProducts();
      setProductsState((s) => ({ ...s, items: items, loading: false }));
    } catch {
      onNotification(false, "No se pudieron cargar los productos.");
      setProductsState((s) => ({ ...s, loading: false }));
    }
  };

  const handleSearch = (query: string): void => {
    setProductsState((s) => ({ ...s, query: query }));
  };

  const handleFilterCategory = (categoryFilter: CategoryFilterType): void => {
    setProductsState((s) => ({ ...s, categoryFilter: categoryFilter }));
  };

  const handleFilterStatus = (statusFilter: StatusFilterType): void => {
    setProductsState((s) => ({ ...s, statusFilter: statusFilter }));
  };

  // Abre el formulario de alta.
  const handleOpenCreate = (): void => {
    setProductsState((s) => ({
      ...s,
      mode: "create",
      selected: null,
      form: EMPTY_FORM,
      errors: {}
    }));
  };

  // Abre el formulario de edición cargado con el producto.
  const handleOpenEdit = (product: ProductType): void => {
    setProductsState((s) => ({
      ...s,
      mode: "edit",
      selected: product,
      form: formFromProduct(product),
      errors: {}
    }));
  };

  // Abre la ficha (detalle) del producto.
  const handleOpenDetail = (product: ProductType): void => {
    setProductsState((s) => ({ ...s, mode: "detail", selected: product }));
  };

  // Vuelve a la lista.
  const handleCancel = (): void => {
    setProductsState((s) => ({ ...s, mode: "list", selected: null, errors: {} }));
  };

  const handleChangeField = <K extends keyof ProductFormType>(
    field: K,
    value: ProductFormType[K]
  ): void => {
    setProductsState((s) => ({
      ...s,
      form: { ...s.form, [field]: value },
      errors: { ...s.errors, [field]: undefined }
    }));
  };

  // Alta o edición según el modo.
  const handleSubmit = async (): Promise<void> => {
    const { form, mode, selected } = getProductsState;
    const errors = validateProductForm(form);
    if (Object.keys(errors).length > 0) {
      setProductsState((s) => ({ ...s, errors: errors }));
      return;
    }
    setProductsState((s) => ({ ...s, saving: true }));
    try {
      if (mode === "edit" && selected) {
        await updateProduct(
          selected.id,
          toProductInput(form, { imageUrl: selected.imageUrl, isActive: selected.isActive })
        );
        onNotification(true, "Producto actualizado.");
      } else {
        await createProduct(toProductInput(form));
        onNotification(true, "Producto creado.");
      }
      await handleLoad();
      setProductsState((s) => {
        if (mode === "edit" && selected) {
          const updated = s.items.find((item) => item.id === selected.id) ?? null;
          return { ...s, saving: false, mode: updated ? "detail" : "list", selected: updated };
        }
        return { ...s, saving: false, mode: "list", selected: null };
      });
    } catch {
      onNotification(false, "No se pudo guardar el producto. Probá de nuevo.");
      setProductsState((s) => ({ ...s, saving: false }));
    }
  };

  // Baja de un producto.
  const handleDelete = async (product: ProductType): Promise<void> => {
    try {
      await deleteProduct(product.id);
      onNotification(true, "Producto eliminado.");
      setProductsState((s) => ({ ...s, mode: "list", selected: null }));
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo eliminar el producto.");
    }
  };

  return {
    handleLoad,
    handleSearch,
    handleFilterCategory,
    handleFilterStatus,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDetail,
    handleCancel,
    handleChangeField,
    handleSubmit,
    handleDelete
  };
};
