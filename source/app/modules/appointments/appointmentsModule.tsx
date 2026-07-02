import { filterAppointments } from "@app/modules/appointments/helpers/filterAppointments";
import { sortAppointmentsByDate } from "@app/modules/appointments/helpers/sortAppointmentsByDate";
import { useAppointmentsActions } from "@app/modules/appointments/hooks/useAppointmentsActions";
import AppointmentsDetailInterface from "@app/modules/appointments/interfaces/appointmentsDetailInterface";
import AppointmentsFormInterface from "@app/modules/appointments/interfaces/appointmentsFormInterface";
import AppointmentsListInterface from "@app/modules/appointments/interfaces/appointmentsListInterface";
import { useAppointmentsProvider } from "@app/modules/appointments/states/appointmentsProvider";
import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { useEffect } from "react";

export default function AppointmentsModule() {
  const { getAppointmentsState } = useAppointmentsProvider();
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
  } = useAppointmentsActions();
  const state = getAppointmentsState;
  const visible = sortAppointmentsByDate(
    filterAppointments(state.items, state.query, state.typeFilter, state.statusFilter)
  );

  useDocumentHead({
    title: "Agenda",
    description: "Turnos, consultas y servicios agendados."
  });

  useEffect(() => {
    handleLoad();
  }, []);

  return (
    <section>
      <PageHeaderInterface
        title="Agenda"
        subtitle="Turnos, consultas, cirugías y servicios de la veterinaria."
      />

      {state.mode === "detail" && state.selected ? (
        <AppointmentsDetailInterface
          appointment={state.selected}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onBack={handleCancel}
        />
      ) : null}

      {state.mode === "create" || state.mode === "edit" ? (
        <AppointmentsFormInterface
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
        <AppointmentsListInterface
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
