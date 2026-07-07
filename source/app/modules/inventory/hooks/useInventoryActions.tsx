import { EMPTY_FORM } from "@app/modules/inventory/constants/constants";
import type {
  MovementFormType,
  MovementTypeFilterType,
  StockMovementType
} from "@app/modules/inventory/entities/entities";
import { formFromMovement, toMovementInput } from "@app/modules/inventory/helpers/movementMappers";
import { validateMovementForm } from "@app/modules/inventory/helpers/validateMovementForm";
import {
  createStockMovement,
  deleteStockMovement,
  fetchStockMovements,
  updateStockMovement
} from "@app/modules/inventory/services/services";
import { useInventoryProvider } from "@app/modules/inventory/states/inventoryProvider";
import { useNotification } from "@app/modules/main/hooks/useNotification";

export const useInventoryActions = () => {
  const { getInventoryState, setInventoryState } = useInventoryProvider();
  const { onNotification } = useNotification();

  // Carga inicial de movimientos.
  const handleLoad = async (): Promise<void> => {
    setInventoryState((s) => ({ ...s, loading: true }));
    try {
      const items = await fetchStockMovements();
      setInventoryState((s) => ({ ...s, items: items, loading: false }));
    } catch {
      onNotification(false, "No se pudieron cargar los movimientos.");
      setInventoryState((s) => ({ ...s, loading: false }));
    }
  };

  const handleSearch = (query: string): void => {
    setInventoryState((s) => ({ ...s, query: query }));
  };

  const handleFilterType = (typeFilter: MovementTypeFilterType): void => {
    setInventoryState((s) => ({ ...s, typeFilter: typeFilter }));
  };

  // Abre el formulario de alta.
  const handleOpenCreate = (): void => {
    setInventoryState((s) => ({
      ...s,
      mode: "create",
      selected: null,
      form: EMPTY_FORM,
      errors: {}
    }));
  };

  // Abre el formulario de edición cargado con el movimiento.
  const handleOpenEdit = (movement: StockMovementType): void => {
    setInventoryState((s) => ({
      ...s,
      mode: "edit",
      selected: movement,
      form: formFromMovement(movement),
      errors: {}
    }));
  };

  // Abre la ficha (detalle) del movimiento.
  const handleOpenDetail = (movement: StockMovementType): void => {
    setInventoryState((s) => ({ ...s, mode: "detail", selected: movement }));
  };

  // Vuelve a la lista.
  const handleCancel = (): void => {
    setInventoryState((s) => ({ ...s, mode: "list", selected: null, errors: {} }));
  };

  const handleChangeField = <K extends keyof MovementFormType>(
    field: K,
    value: MovementFormType[K]
  ): void => {
    setInventoryState((s) => ({
      ...s,
      form: { ...s.form, [field]: value },
      errors: { ...s.errors, [field]: undefined }
    }));
  };

  // Alta o edición según el modo.
  const handleSubmit = async (): Promise<void> => {
    const { form, mode, selected } = getInventoryState;
    const errors = validateMovementForm(form);
    if (Object.keys(errors).length > 0) {
      setInventoryState((s) => ({ ...s, errors: errors }));
      return;
    }
    setInventoryState((s) => ({ ...s, saving: true }));
    try {
      if (mode === "edit" && selected) {
        await updateStockMovement(selected.id, toMovementInput(form));
        onNotification(true, "Movimiento actualizado.");
      } else {
        await createStockMovement(toMovementInput(form));
        onNotification(true, "Movimiento creado.");
      }
      await handleLoad();
      setInventoryState((s) => {
        if (mode === "edit" && selected) {
          const updated = s.items.find((item) => item.id === selected.id) ?? null;
          return { ...s, saving: false, mode: updated ? "detail" : "list", selected: updated };
        }
        return { ...s, saving: false, mode: "list", selected: null };
      });
    } catch {
      onNotification(false, "No se pudo guardar el movimiento. Probá de nuevo.");
      setInventoryState((s) => ({ ...s, saving: false }));
    }
  };

  // Baja de un movimiento.
  const handleDelete = async (movement: StockMovementType): Promise<void> => {
    try {
      await deleteStockMovement(movement.id);
      onNotification(true, "Movimiento eliminado.");
      setInventoryState((s) => ({ ...s, mode: "list", selected: null }));
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo eliminar el movimiento.");
    }
  };

  return {
    handleLoad,
    handleSearch,
    handleFilterType,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDetail,
    handleCancel,
    handleChangeField,
    handleSubmit,
    handleDelete
  };
};
