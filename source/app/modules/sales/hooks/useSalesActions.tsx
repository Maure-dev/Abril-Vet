import { useNotification } from "@app/modules/main/hooks/useNotification";
import { EMPTY_DRAFT, EMPTY_FORM } from "@app/modules/sales/constants/constants";
import type {
  SaleFormType,
  SaleItemDraftType,
  SaleType
} from "@app/modules/sales/entities/entities";
import {
  draftToItem,
  formFromSale,
  todayIso,
  toSaleInput
} from "@app/modules/sales/helpers/saleMappers";
import { validateSalesForm } from "@app/modules/sales/helpers/validateSalesForm";
import {
  createSale,
  deleteSale,
  fetchSales,
  updateSale
} from "@app/modules/sales/services/services";
import { useSalesProvider } from "@app/modules/sales/states/salesProvider";

export const useSalesActions = () => {
  const { getSalesState, setSalesState } = useSalesProvider();
  const { onNotification } = useNotification();

  // Carga inicial de ventas.
  const handleLoad = async (): Promise<void> => {
    setSalesState((s) => ({ ...s, loading: true }));
    try {
      const items = await fetchSales();
      setSalesState((s) => ({ ...s, items: items, loading: false }));
    } catch {
      onNotification(false, "No se pudieron cargar las ventas.");
      setSalesState((s) => ({ ...s, loading: false }));
    }
  };

  const handleSearch = (query: string): void => {
    setSalesState((s) => ({ ...s, query: query }));
  };

  // Abre el formulario de alta con una venta nueva (fecha de hoy).
  const handleOpenCreate = (): void => {
    setSalesState((s) => ({
      ...s,
      mode: "create",
      selected: null,
      form: { ...EMPTY_FORM, date: todayIso() },
      errors: {}
    }));
  };

  // Abre el formulario de edición cargado con la venta.
  const handleOpenEdit = (sale: SaleType): void => {
    setSalesState((s) => ({
      ...s,
      mode: "edit",
      selected: sale,
      form: formFromSale(sale),
      errors: {}
    }));
  };

  // Abre la ficha (detalle) de la venta.
  const handleOpenDetail = (sale: SaleType): void => {
    setSalesState((s) => ({ ...s, mode: "detail", selected: sale }));
  };

  // Vuelve a la lista.
  const handleCancel = (): void => {
    setSalesState((s) => ({ ...s, mode: "list", selected: null, errors: {} }));
  };

  const handleChangeField = <K extends keyof SaleFormType>(
    field: K,
    value: SaleFormType[K]
  ): void => {
    setSalesState((s) => ({
      ...s,
      form: { ...s.form, [field]: value },
      errors: { ...s.errors, [field]: undefined }
    }));
  };

  // Edita un campo del borrador de la línea (aún sin agregar al carrito).
  const handleChangeDraft = <K extends keyof SaleItemDraftType>(
    field: K,
    value: SaleItemDraftType[K]
  ): void => {
    setSalesState((s) => ({
      ...s,
      form: { ...s.form, draft: { ...s.form.draft, [field]: value } }
    }));
  };

  // Agrega la línea del borrador al carrito (si es válida) y resetea el borrador.
  const handleAddItem = (): void => {
    const item = draftToItem(getSalesState.form.draft);
    if (item.name.length === 0 || item.quantity <= 0) {
      onNotification(false, "Completá nombre y cantidad de la línea.");
      return;
    }
    setSalesState((s) => ({
      ...s,
      form: { ...s.form, items: [...s.form.items, item], draft: EMPTY_DRAFT },
      errors: { ...s.errors, items: undefined }
    }));
  };

  // Quita una línea del carrito por su posición.
  const handleRemoveItem = (index: number): void => {
    setSalesState((s) => ({
      ...s,
      form: { ...s.form, items: s.form.items.filter((_, i) => i !== index) }
    }));
  };

  // Alta o edición según el modo.
  const handleSubmit = async (): Promise<void> => {
    const { form, mode, selected } = getSalesState;
    const errors = validateSalesForm(form);
    if (Object.keys(errors).length > 0) {
      setSalesState((s) => ({ ...s, errors: errors }));
      return;
    }
    setSalesState((s) => ({ ...s, saving: true }));
    try {
      if (mode === "edit" && selected) {
        await updateSale(selected.id, toSaleInput(form));
        onNotification(true, "Venta actualizada.");
      } else {
        await createSale(toSaleInput(form));
        onNotification(true, "Venta registrada.");
      }
      setSalesState((s) => ({ ...s, saving: false, mode: "list", selected: null }));
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo guardar la venta. Probá de nuevo.");
      setSalesState((s) => ({ ...s, saving: false }));
    }
  };

  // Baja de una venta.
  const handleDelete = async (sale: SaleType): Promise<void> => {
    try {
      await deleteSale(sale.id);
      onNotification(true, "Venta eliminada.");
      setSalesState((s) => ({ ...s, mode: "list", selected: null }));
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo eliminar la venta.");
    }
  };

  return {
    handleLoad,
    handleSearch,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDetail,
    handleCancel,
    handleChangeField,
    handleChangeDraft,
    handleAddItem,
    handleRemoveItem,
    handleSubmit,
    handleDelete
  };
};
