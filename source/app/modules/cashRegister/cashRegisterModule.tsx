import { filterCashSessions } from "@app/modules/cashRegister/helpers/filterCashSessions";
import { useCashRegisterActions } from "@app/modules/cashRegister/hooks/useCashRegisterActions";
import CashRegisterActiveInterface from "@app/modules/cashRegister/interfaces/cashRegisterActiveInterface";
import CashRegisterDetailInterface from "@app/modules/cashRegister/interfaces/cashRegisterDetailInterface";
import CashRegisterFormInterface from "@app/modules/cashRegister/interfaces/cashRegisterFormInterface";
import CashRegisterListInterface from "@app/modules/cashRegister/interfaces/cashRegisterListInterface";
import { useCashRegisterProvider } from "@app/modules/cashRegister/states/cashRegisterProvider";
import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { useEffect } from "react";

export default function CashRegisterModule() {
  const { getCashRegisterState } = useCashRegisterProvider();
  const {
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
  } = useCashRegisterActions();
  const state = getCashRegisterState;
  const visible = filterCashSessions(state.items, state.query, state.statusFilter);

  useDocumentHead({
    title: "Caja",
    description: "Caja diaria: apertura, movimientos, cierre y arqueo."
  });

  useEffect(() => {
    handleLoad();
  }, []);

  return (
    <section>
      <PageHeaderInterface
        title="Caja"
        subtitle="Caja diaria: apertura, ingresos y egresos, cierre y arqueo."
      />

      {state.mode === "detail" && state.selected ? (
        <CashRegisterDetailInterface
          session={state.selected}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onBack={handleCancel}
        />
      ) : null}

      {state.mode === "create" || state.mode === "edit" ? (
        <CashRegisterFormInterface
          form={state.form}
          errors={state.errors}
          saving={state.saving}
          isEdit={state.mode === "edit"}
          onChange={handleChangeField}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : null}

      {state.mode === "list" ? (
        <div className="flex flex-col gap-8">
          {state.activeSession ? (
            <CashRegisterActiveInterface
              session={state.activeSession}
              movementForm={state.movementForm}
              movementErrors={state.movementErrors}
              closeForm={state.closeForm}
              closeErrors={state.closeErrors}
              saving={state.saving}
              onChangeMovementField={handleChangeMovementField}
              onAddMovement={handleAddMovement}
              onChangeCloseField={handleChangeCloseField}
              onCloseSession={handleCloseSession}
            />
          ) : null}

          <CashRegisterListInterface
            items={visible}
            query={state.query}
            statusFilter={state.statusFilter}
            onSearch={handleSearch}
            onFilterStatus={handleFilterStatus}
            onOpenCreate={handleOpenCreate}
            onOpenDetail={handleOpenDetail}
            onOpenEdit={handleOpenEdit}
          />
        </div>
      ) : null}
    </section>
  );
}
