import { useNotification } from "@app/modules/main/hooks/useNotification";
import { EMPTY_FORM, EMPTY_ITEM, STATUS_LABELS } from "@app/modules/purchases/constants/constants";
import type {
  PurchaseFormType,
  PurchaseItemFormType,
  PurchaseOrderType,
  PurchaseStatusFilterType,
  PurchaseStatusType
} from "@app/modules/purchases/entities/entities";
import { formFromPurchase, toPurchaseInput } from "@app/modules/purchases/helpers/purchaseMappers";
import { validatePurchasesForm } from "@app/modules/purchases/helpers/validatePurchasesForm";
import {
  createPurchase,
  deletePurchase,
  fetchPurchases,
  updatePurchase
} from "@app/modules/purchases/services/services";
import { usePurchasesProvider } from "@app/modules/purchases/states/purchasesProvider";

export const usePurchasesActions = () => {
  const { getPurchasesState, setPurchasesState } = usePurchasesProvider();
  const { onNotification } = useNotification();

  // Carga inicial de órdenes de compra.
  const handleLoad = async (): Promise<void> => {
    setPurchasesState((s) => ({ ...s, loading: true }));
    try {
      const items = await fetchPurchases();
      setPurchasesState((s) => ({ ...s, items: items, loading: false }));
    } catch {
      onNotification(false, "No se pudieron cargar las compras.");
      setPurchasesState((s) => ({ ...s, loading: false }));
    }
  };

  const handleSearch = (query: string): void => {
    setPurchasesState((s) => ({ ...s, query: query }));
  };

  const handleFilterStatus = (statusFilter: PurchaseStatusFilterType): void => {
    setPurchasesState((s) => ({ ...s, statusFilter: statusFilter }));
  };

  // Abre el formulario de alta.
  const handleOpenCreate = (): void => {
    setPurchasesState((s) => ({
      ...s,
      mode: "create",
      selected: null,
      form: { ...EMPTY_FORM, items: [{ ...EMPTY_ITEM }] },
      errors: {}
    }));
  };

  // Abre el formulario de edición cargado con la orden.
  const handleOpenEdit = (purchase: PurchaseOrderType): void => {
    setPurchasesState((s) => ({
      ...s,
      mode: "edit",
      selected: purchase,
      form: formFromPurchase(purchase),
      errors: {}
    }));
  };

  // Abre la ficha (detalle) de la orden.
  const handleOpenDetail = (purchase: PurchaseOrderType): void => {
    setPurchasesState((s) => ({ ...s, mode: "detail", selected: purchase }));
  };

  // Vuelve a la lista.
  const handleCancel = (): void => {
    setPurchasesState((s) => ({ ...s, mode: "list", selected: null, errors: {} }));
  };

  const handleChangeField = <K extends keyof PurchaseFormType>(
    field: K,
    value: PurchaseFormType[K]
  ): void => {
    setPurchasesState((s) => ({
      ...s,
      form: { ...s.form, [field]: value },
      errors: { ...s.errors, [field]: undefined }
    }));
  };

  // ── Manejo de la lista dinámica de ítems ──

  const handleAddItem = (): void => {
    setPurchasesState((s) => ({
      ...s,
      form: { ...s.form, items: [...s.form.items, { ...EMPTY_ITEM }] }
    }));
  };

  const handleRemoveItem = (index: number): void => {
    setPurchasesState((s) => {
      const next = s.form.items.filter((_, i) => i !== index);
      const items = next.length > 0 ? next : [{ ...EMPTY_ITEM }];
      return { ...s, form: { ...s.form, items: items }, errors: { ...s.errors, items: undefined } };
    });
  };

  const handleChangeItem = <K extends keyof PurchaseItemFormType>(
    index: number,
    field: K,
    value: PurchaseItemFormType[K]
  ): void => {
    setPurchasesState((s) => {
      const items = s.form.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      return { ...s, form: { ...s.form, items: items }, errors: { ...s.errors, items: undefined } };
    });
  };

  // Alta o edición según el modo.
  const handleSubmit = async (): Promise<void> => {
    const { form, mode, selected } = getPurchasesState;
    const errors = validatePurchasesForm(form);
    if (Object.keys(errors).length > 0) {
      setPurchasesState((s) => ({ ...s, errors: errors }));
      return;
    }
    setPurchasesState((s) => ({ ...s, saving: true }));
    try {
      if (mode === "edit" && selected) {
        await updatePurchase(selected.id, toPurchaseInput(form));
        onNotification(true, "Compra actualizada.");
      } else {
        await createPurchase(toPurchaseInput(form));
        onNotification(true, "Compra creada.");
      }
      await handleLoad();
      setPurchasesState((s) => {
        if (mode === "edit" && selected) {
          const updated = s.items.find((item) => item.id === selected.id) ?? null;
          return { ...s, saving: false, mode: updated ? "detail" : "list", selected: updated };
        }
        return { ...s, saving: false, mode: "list", selected: null };
      });
    } catch {
      onNotification(false, "No se pudo guardar la compra. Probá de nuevo.");
      setPurchasesState((s) => ({ ...s, saving: false }));
    }
  };

  // Cambia sólo el estado de una orden (combo en la lista), sin entrar a editar.
  const handleQuickStatus = async (
    purchase: PurchaseOrderType,
    status: PurchaseStatusType
  ): Promise<void> => {
    if (purchase.status === status) {
      return;
    }
    try {
      await updatePurchase(
        purchase.id,
        toPurchaseInput({ ...formFromPurchase(purchase), status: status })
      );
      onNotification(true, `Compra: ${STATUS_LABELS[status]}.`);
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo cambiar el estado de la compra.");
    }
  };

  // Marca una orden como cancelada (sin borrarla).
  const handleCancelOrder = async (purchase: PurchaseOrderType): Promise<void> => {
    try {
      const { id, createdAt, updatedAt, ...rest } = purchase;
      await updatePurchase(id, { ...rest, status: "cancelled" });
      onNotification(true, "Compra cancelada.");
      setPurchasesState((s) => ({ ...s, mode: "list", selected: null }));
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo cancelar la compra.");
    }
  };

  // Baja de una orden de compra.
  const handleDelete = async (purchase: PurchaseOrderType): Promise<void> => {
    try {
      await deletePurchase(purchase.id);
      onNotification(true, "Compra eliminada.");
      setPurchasesState((s) => ({ ...s, mode: "list", selected: null }));
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo eliminar la compra.");
    }
  };

  return {
    handleLoad,
    handleSearch,
    handleFilterStatus,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDetail,
    handleCancel,
    handleChangeField,
    handleAddItem,
    handleRemoveItem,
    handleChangeItem,
    handleSubmit,
    handleQuickStatus,
    handleCancelOrder,
    handleDelete
  };
};
