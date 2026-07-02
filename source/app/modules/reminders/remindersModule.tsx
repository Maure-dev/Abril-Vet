import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { filterReminders } from "@app/modules/reminders/helpers/filterReminders";
import { useRemindersActions } from "@app/modules/reminders/hooks/useRemindersActions";
import RemindersDetailInterface from "@app/modules/reminders/interfaces/remindersDetailInterface";
import RemindersFormInterface from "@app/modules/reminders/interfaces/remindersFormInterface";
import RemindersListInterface from "@app/modules/reminders/interfaces/remindersListInterface";
import { useRemindersProvider } from "@app/modules/reminders/states/remindersProvider";
import { useEffect } from "react";

export default function RemindersModule() {
  const { getRemindersState } = useRemindersProvider();
  const {
    handleLoad,
    handleSearch,
    handleFilterType,
    handleFilterStatus,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDetail,
    handleCancel,
    handleChangeField,
    handleSubmit,
    handleDelete
  } = useRemindersActions();
  const state = getRemindersState;
  const visible = filterReminders(state.items, state.query, state.typeFilter, state.statusFilter);

  useDocumentHead({
    title: "Recordatorios",
    description: "Recordatorios de turnos, vacunas y controles por email."
  });

  useEffect(() => {
    handleLoad();
  }, []);

  return (
    <section>
      <PageHeaderInterface
        title="Recordatorios"
        subtitle="Recordatorios de turnos, vacunas y controles por email."
      />

      {state.mode === "detail" && state.selected ? (
        <RemindersDetailInterface
          reminder={state.selected}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onBack={handleCancel}
        />
      ) : null}

      {state.mode === "create" || state.mode === "edit" ? (
        <RemindersFormInterface
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
        <RemindersListInterface
          items={visible}
          query={state.query}
          typeFilter={state.typeFilter}
          statusFilter={state.statusFilter}
          onSearch={handleSearch}
          onFilterType={handleFilterType}
          onFilterStatus={handleFilterStatus}
          onOpenCreate={handleOpenCreate}
          onOpenDetail={handleOpenDetail}
          onOpenEdit={handleOpenEdit}
        />
      ) : null}
    </section>
  );
}
