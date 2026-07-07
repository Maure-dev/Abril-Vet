import { useNotification } from "@app/modules/main/hooks/useNotification";
import { EMPTY_FORM } from "@app/modules/suppliers/constants/constants";
import type {
  SupplierFormType,
  SupplierInputType,
  SupplierStatusFilterType,
  SupplierType
} from "@app/modules/suppliers/entities/entities";
import { validateSupplierForm } from "@app/modules/suppliers/helpers/validateSupplierForm";
import {
  createSupplier,
  deleteSupplier,
  fetchSuppliers,
  updateSupplier
} from "@app/modules/suppliers/services/services";
import { useSuppliersProvider } from "@app/modules/suppliers/states/suppliersProvider";

// Formulario → datos persistibles (trim de los campos de texto).
function toSupplierInput(form: SupplierFormType): SupplierInputType {
  return {
    name: form.name.trim(),
    contactName: form.contactName.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    address: form.address.trim(),
    cuit: form.cuit.trim(),
    notes: form.notes.trim(),
    isActive: form.isActive
  };
}

// Proveedor existente → formulario (para edición).
function formFromSupplier(supplier: SupplierType): SupplierFormType {
  return {
    name: supplier.name,
    contactName: supplier.contactName,
    email: supplier.email,
    phone: supplier.phone,
    address: supplier.address,
    cuit: supplier.cuit,
    notes: supplier.notes,
    isActive: supplier.isActive
  };
}

export const useSuppliersActions = () => {
  const { getSuppliersState, setSuppliersState } = useSuppliersProvider();
  const { onNotification } = useNotification();

  // Carga inicial de proveedores.
  const handleLoad = async (): Promise<void> => {
    setSuppliersState((s) => ({ ...s, loading: true }));
    try {
      const items = await fetchSuppliers();
      setSuppliersState((s) => ({ ...s, items: items, loading: false }));
    } catch {
      onNotification(false, "No se pudieron cargar los proveedores.");
      setSuppliersState((s) => ({ ...s, loading: false }));
    }
  };

  const handleSearch = (query: string): void => {
    setSuppliersState((s) => ({ ...s, query: query }));
  };

  const handleFilterStatus = (statusFilter: SupplierStatusFilterType): void => {
    setSuppliersState((s) => ({ ...s, statusFilter: statusFilter }));
  };

  // Abre el formulario de alta.
  const handleOpenCreate = (): void => {
    setSuppliersState((s) => ({
      ...s,
      mode: "create",
      selected: null,
      form: EMPTY_FORM,
      errors: {}
    }));
  };

  // Abre el formulario de edición cargado con el proveedor.
  const handleOpenEdit = (supplier: SupplierType): void => {
    setSuppliersState((s) => ({
      ...s,
      mode: "edit",
      selected: supplier,
      form: formFromSupplier(supplier),
      errors: {}
    }));
  };

  // Abre la ficha (detalle) del proveedor.
  const handleOpenDetail = (supplier: SupplierType): void => {
    setSuppliersState((s) => ({ ...s, mode: "detail", selected: supplier }));
  };

  // Vuelve a la lista.
  const handleCancel = (): void => {
    setSuppliersState((s) => ({ ...s, mode: "list", selected: null, errors: {} }));
  };

  const handleChangeField = <K extends keyof SupplierFormType>(
    field: K,
    value: SupplierFormType[K]
  ): void => {
    setSuppliersState((s) => ({
      ...s,
      form: { ...s.form, [field]: value },
      errors: { ...s.errors, [field]: undefined }
    }));
  };

  // Alta o edición según el modo.
  const handleSubmit = async (): Promise<void> => {
    const { form, mode, selected } = getSuppliersState;
    const errors = validateSupplierForm(form);
    if (Object.keys(errors).length > 0) {
      setSuppliersState((s) => ({ ...s, errors: errors }));
      return;
    }
    setSuppliersState((s) => ({ ...s, saving: true }));
    try {
      if (mode === "edit" && selected) {
        await updateSupplier(selected.id, toSupplierInput(form));
        onNotification(true, "Proveedor actualizado.");
      } else {
        await createSupplier(toSupplierInput(form));
        onNotification(true, "Proveedor creado.");
      }
      await handleLoad();
      setSuppliersState((s) => {
        if (mode === "edit" && selected) {
          const updated = s.items.find((item) => item.id === selected.id) ?? null;
          return { ...s, saving: false, mode: updated ? "detail" : "list", selected: updated };
        }
        return { ...s, saving: false, mode: "list", selected: null };
      });
    } catch {
      onNotification(false, "No se pudo guardar el proveedor. Probá de nuevo.");
      setSuppliersState((s) => ({ ...s, saving: false }));
    }
  };

  // Baja de un proveedor.
  const handleDelete = async (supplier: SupplierType): Promise<void> => {
    try {
      await deleteSupplier(supplier.id);
      onNotification(true, "Proveedor eliminado.");
      setSuppliersState((s) => ({ ...s, mode: "list", selected: null }));
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo eliminar el proveedor.");
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
    handleSubmit,
    handleDelete
  };
};
