import {
  EMPTY_FORM,
  EMPTY_ITEM,
  INVOICE_STATUS_LABELS
} from "@app/modules/billing/constants/constants";
import type {
  BillingFormType,
  InvoiceItemFormType,
  InvoiceStatusFilterType,
  InvoiceStatusType,
  InvoiceType
} from "@app/modules/billing/entities/entities";
import { formFromInvoice, toInvoiceInput } from "@app/modules/billing/helpers/invoiceMappers";
import { validateBillingForm } from "@app/modules/billing/helpers/validateBillingForm";
import {
  createInvoice,
  deleteInvoice,
  fetchInvoices,
  updateInvoice
} from "@app/modules/billing/services/services";
import { useBillingProvider } from "@app/modules/billing/states/billingProvider";
import { useNotification } from "@app/modules/main/hooks/useNotification";

export const useBillingActions = () => {
  const { getBillingState, setBillingState } = useBillingProvider();
  const { onNotification } = useNotification();

  // Carga inicial de facturas.
  const handleLoad = async (): Promise<void> => {
    setBillingState((s) => ({ ...s, loading: true }));
    try {
      const items = await fetchInvoices();
      setBillingState((s) => ({ ...s, items: items, loading: false }));
    } catch {
      onNotification(false, "No se pudieron cargar las facturas.");
      setBillingState((s) => ({ ...s, loading: false }));
    }
  };

  const handleSearch = (query: string): void => {
    setBillingState((s) => ({ ...s, query: query }));
  };

  const handleFilterStatus = (statusFilter: InvoiceStatusFilterType): void => {
    setBillingState((s) => ({ ...s, statusFilter: statusFilter }));
  };

  // Cambia sólo el estado de una factura (combo en la lista), sin editar.
  const handleQuickStatus = async (
    invoice: InvoiceType,
    status: InvoiceStatusType
  ): Promise<void> => {
    if (invoice.status === status) {
      return;
    }
    try {
      await updateInvoice(
        invoice.id,
        toInvoiceInput({ ...formFromInvoice(invoice), status: status })
      );
      onNotification(true, `Factura: ${INVOICE_STATUS_LABELS[status]}.`);
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo cambiar el estado de la factura.");
    }
  };

  // Abre el formulario de alta.
  const handleOpenCreate = (): void => {
    setBillingState((s) => ({
      ...s,
      mode: "create",
      selected: null,
      form: EMPTY_FORM,
      errors: {}
    }));
  };

  // Abre el formulario de edición cargado con la factura.
  const handleOpenEdit = (invoice: InvoiceType): void => {
    setBillingState((s) => ({
      ...s,
      mode: "edit",
      selected: invoice,
      form: formFromInvoice(invoice),
      errors: {}
    }));
  };

  // Abre la ficha (detalle) de la factura.
  const handleOpenDetail = (invoice: InvoiceType): void => {
    setBillingState((s) => ({ ...s, mode: "detail", selected: invoice }));
  };

  // Vuelve a la lista.
  const handleCancel = (): void => {
    setBillingState((s) => ({ ...s, mode: "list", selected: null, errors: {} }));
  };

  const handleChangeField = <K extends keyof BillingFormType>(
    field: K,
    value: BillingFormType[K]
  ): void => {
    setBillingState((s) => ({
      ...s,
      form: { ...s.form, [field]: value },
      errors: { ...s.errors, [field]: undefined }
    }));
  };

  // Cambia un campo de una fila de ítem por índice.
  const handleChangeItem = <K extends keyof InvoiceItemFormType>(
    index: number,
    field: K,
    value: InvoiceItemFormType[K]
  ): void => {
    setBillingState((s) => ({
      ...s,
      form: {
        ...s.form,
        items: s.form.items.map((item, i) => (i === index ? { ...item, [field]: value } : item))
      },
      errors: { ...s.errors, items: undefined }
    }));
  };

  // Agrega una fila de ítem vacía.
  const handleAddItem = (): void => {
    setBillingState((s) => ({
      ...s,
      form: { ...s.form, items: [...s.form.items, { ...EMPTY_ITEM }] }
    }));
  };

  // Quita una fila de ítem por índice (siempre deja al menos una).
  const handleRemoveItem = (index: number): void => {
    setBillingState((s) => {
      const items = s.form.items.filter((_, i) => i !== index);
      return {
        ...s,
        form: { ...s.form, items: items.length > 0 ? items : [{ ...EMPTY_ITEM }] }
      };
    });
  };

  // Alta o edición según el modo.
  const handleSubmit = async (): Promise<void> => {
    const { form, mode, selected } = getBillingState;
    const errors = validateBillingForm(form);
    if (Object.keys(errors).length > 0) {
      setBillingState((s) => ({ ...s, errors: errors }));
      return;
    }
    setBillingState((s) => ({ ...s, saving: true }));
    try {
      if (mode === "edit" && selected) {
        await updateInvoice(selected.id, toInvoiceInput(form));
        onNotification(true, "Factura actualizada.");
      } else {
        await createInvoice(toInvoiceInput(form));
        onNotification(true, "Factura creada.");
      }
      await handleLoad();
      setBillingState((s) => {
        if (mode === "edit" && selected) {
          const updated = s.items.find((item) => item.id === selected.id) ?? null;
          return { ...s, saving: false, mode: updated ? "detail" : "list", selected: updated };
        }
        return { ...s, saving: false, mode: "list", selected: null };
      });
    } catch {
      onNotification(false, "No se pudo guardar la factura. Probá de nuevo.");
      setBillingState((s) => ({ ...s, saving: false }));
    }
  };

  // Baja de una factura.
  const handleDelete = async (invoice: InvoiceType): Promise<void> => {
    try {
      await deleteInvoice(invoice.id);
      onNotification(true, "Factura eliminada.");
      setBillingState((s) => ({ ...s, mode: "list", selected: null }));
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo eliminar la factura.");
    }
  };

  return {
    handleLoad,
    handleSearch,
    handleFilterStatus,
    handleQuickStatus,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDetail,
    handleCancel,
    handleChangeField,
    handleChangeItem,
    handleAddItem,
    handleRemoveItem,
    handleSubmit,
    handleDelete
  };
};
