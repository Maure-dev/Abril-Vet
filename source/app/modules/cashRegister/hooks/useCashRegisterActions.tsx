import {
  EMPTY_CLOSE_FORM,
  EMPTY_FORM,
  EMPTY_MOVEMENT_FORM
} from "@app/modules/cashRegister/constants/constants";
import type {
  CashCloseFormType,
  CashMovementFormType,
  CashMovementType,
  CashRegisterFormType,
  CashSessionType,
  CashStatusFilterType
} from "@app/modules/cashRegister/entities/entities";
import {
  computeCashDifference,
  computeExpectedAmount
} from "@app/modules/cashRegister/helpers/computeCash";
import {
  validateCashCloseForm,
  validateCashMovementForm,
  validateCashRegisterForm
} from "@app/modules/cashRegister/helpers/validateCashRegisterForm";
import {
  createCashSession,
  deleteCashSession,
  fetchCashSessions,
  updateCashSession
} from "@app/modules/cashRegister/services/services";
import { useCashRegisterProvider } from "@app/modules/cashRegister/states/cashRegisterProvider";
import { useNotification } from "@app/modules/main/hooks/useNotification";

// Datos persistibles de una sesión (sin id ni timestamps).
function toSessionInput(session: CashSessionType) {
  return {
    openedAt: session.openedAt,
    closedAt: session.closedAt,
    status: session.status,
    openingAmount: session.openingAmount,
    countedAmount: session.countedAmount,
    movements: session.movements,
    expectedAmount: session.expectedAmount,
    difference: session.difference,
    notes: session.notes
  };
}

export const useCashRegisterActions = () => {
  const { getCashRegisterState, setCashRegisterState } = useCashRegisterProvider();
  const { onNotification } = useNotification();

  // Carga inicial de sesiones. Separa la sesión abierta (activa) de las cerradas.
  const handleLoad = async (): Promise<void> => {
    setCashRegisterState((s) => ({ ...s, loading: true }));
    try {
      const items = await fetchCashSessions();
      const activeSession = items.find((session) => session.status === "open") ?? null;
      setCashRegisterState((s) => ({
        ...s,
        items: items,
        activeSession: activeSession,
        loading: false
      }));
    } catch {
      onNotification(false, "No se pudieron cargar las sesiones de caja.");
      setCashRegisterState((s) => ({ ...s, loading: false }));
    }
  };

  const handleSearch = (query: string): void => {
    setCashRegisterState((s) => ({ ...s, query: query }));
  };

  const handleFilterStatus = (statusFilter: CashStatusFilterType): void => {
    setCashRegisterState((s) => ({ ...s, statusFilter: statusFilter }));
  };

  // Abre el formulario de apertura de caja.
  const handleOpenCreate = (): void => {
    setCashRegisterState((s) => ({
      ...s,
      mode: "create",
      selected: null,
      form: EMPTY_FORM,
      errors: {}
    }));
  };

  // Abre el formulario de edición cargado con la sesión (solo notas).
  const handleOpenEdit = (session: CashSessionType): void => {
    setCashRegisterState((s) => ({
      ...s,
      mode: "edit",
      selected: session,
      form: { openingAmount: String(session.openingAmount), notes: session.notes },
      errors: {}
    }));
  };

  // Abre la ficha (detalle) de la sesión.
  const handleOpenDetail = (session: CashSessionType): void => {
    setCashRegisterState((s) => ({ ...s, mode: "detail", selected: session }));
  };

  // Vuelve a la lista.
  const handleCancel = (): void => {
    setCashRegisterState((s) => ({ ...s, mode: "list", selected: null, errors: {} }));
  };

  const handleChangeField = <K extends keyof CashRegisterFormType>(
    field: K,
    value: CashRegisterFormType[K]
  ): void => {
    setCashRegisterState((s) => ({
      ...s,
      form: { ...s.form, [field]: value },
      errors: { ...s.errors, [field]: undefined }
    }));
  };

  const handleChangeMovementField = <K extends keyof CashMovementFormType>(
    field: K,
    value: CashMovementFormType[K]
  ): void => {
    setCashRegisterState((s) => ({
      ...s,
      movementForm: { ...s.movementForm, [field]: value },
      movementErrors: { ...s.movementErrors, [field]: undefined }
    }));
  };

  const handleChangeCloseField = <K extends keyof CashCloseFormType>(
    field: K,
    value: CashCloseFormType[K]
  ): void => {
    setCashRegisterState((s) => ({
      ...s,
      closeForm: { ...s.closeForm, [field]: value },
      closeErrors: { ...s.closeErrors, [field]: undefined }
    }));
  };

  // Alta (apertura) o edición de notas según el modo.
  const handleSubmit = async (): Promise<void> => {
    const { form, mode, selected } = getCashRegisterState;
    const errors = validateCashRegisterForm(form);
    if (Object.keys(errors).length > 0) {
      setCashRegisterState((s) => ({ ...s, errors: errors }));
      return;
    }
    setCashRegisterState((s) => ({ ...s, saving: true }));
    try {
      if (mode === "edit" && selected) {
        await updateCashSession(selected.id, {
          ...toSessionInput(selected),
          notes: form.notes.trim()
        });
        onNotification(true, "Sesión de caja actualizada.");
      } else {
        const openingAmount = Number(form.openingAmount);
        await createCashSession({
          openedAt: new Date().toISOString(),
          closedAt: "",
          status: "open",
          openingAmount: openingAmount,
          countedAmount: null,
          movements: [],
          expectedAmount: openingAmount,
          difference: 0,
          notes: form.notes.trim()
        });
        onNotification(true, "Caja abierta.");
      }
      setCashRegisterState((s) => ({ ...s, saving: false, mode: "list", selected: null }));
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo guardar la sesión de caja. Probá de nuevo.");
      setCashRegisterState((s) => ({ ...s, saving: false }));
    }
  };

  // Registra un movimiento (ingreso / egreso) en la sesión abierta.
  const handleAddMovement = async (): Promise<void> => {
    const { activeSession, movementForm } = getCashRegisterState;
    if (!activeSession) {
      return;
    }
    const errors = validateCashMovementForm(movementForm);
    if (Object.keys(errors).length > 0) {
      setCashRegisterState((s) => ({ ...s, movementErrors: errors }));
      return;
    }
    const movement: CashMovementType = {
      type: movementForm.type,
      amount: Number(movementForm.amount),
      concept: movementForm.concept.trim(),
      at: new Date().toISOString()
    };
    const movements = [...activeSession.movements, movement];
    const expectedAmount = computeExpectedAmount(activeSession.openingAmount, movements);
    setCashRegisterState((s) => ({ ...s, saving: true }));
    try {
      await updateCashSession(activeSession.id, {
        ...toSessionInput(activeSession),
        movements: movements,
        expectedAmount: expectedAmount
      });
      onNotification(true, "Movimiento registrado.");
      setCashRegisterState((s) => ({
        ...s,
        saving: false,
        movementForm: EMPTY_MOVEMENT_FORM,
        movementErrors: {}
      }));
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo registrar el movimiento. Probá de nuevo.");
      setCashRegisterState((s) => ({ ...s, saving: false }));
    }
  };

  // Cierra la sesión abierta: calcula esperado y diferencia con el efectivo contado.
  const handleCloseSession = async (): Promise<void> => {
    const { activeSession, closeForm } = getCashRegisterState;
    if (!activeSession) {
      return;
    }
    const errors = validateCashCloseForm(closeForm);
    if (Object.keys(errors).length > 0) {
      setCashRegisterState((s) => ({ ...s, closeErrors: errors }));
      return;
    }
    const countedAmount = Number(closeForm.countedAmount);
    const expectedAmount = computeExpectedAmount(
      activeSession.openingAmount,
      activeSession.movements
    );
    const difference = computeCashDifference(expectedAmount, countedAmount);
    setCashRegisterState((s) => ({ ...s, saving: true }));
    try {
      await updateCashSession(activeSession.id, {
        ...toSessionInput(activeSession),
        closedAt: new Date().toISOString(),
        status: "closed",
        countedAmount: countedAmount,
        expectedAmount: expectedAmount,
        difference: difference
      });
      onNotification(true, "Caja cerrada.");
      setCashRegisterState((s) => ({
        ...s,
        saving: false,
        closeForm: EMPTY_CLOSE_FORM,
        closeErrors: {}
      }));
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo cerrar la caja. Probá de nuevo.");
      setCashRegisterState((s) => ({ ...s, saving: false }));
    }
  };

  // Baja de una sesión de caja.
  const handleDelete = async (session: CashSessionType): Promise<void> => {
    try {
      await deleteCashSession(session.id);
      onNotification(true, "Sesión de caja eliminada.");
      setCashRegisterState((s) => ({ ...s, mode: "list", selected: null }));
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo eliminar la sesión de caja.");
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
    handleChangeMovementField,
    handleChangeCloseField,
    handleSubmit,
    handleAddMovement,
    handleCloseSession,
    handleDelete
  };
};
