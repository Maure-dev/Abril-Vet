import { sortAppointmentsByDate } from "@app/modules/appointments/helpers/sortAppointmentsByDate";
import { useAppointmentsActions } from "@app/modules/appointments/hooks/useAppointmentsActions";
import AppointmentsBoardInterface from "@app/modules/appointments/interfaces/appointmentsBoardInterface";
import AppointmentsDetailInterface from "@app/modules/appointments/interfaces/appointmentsDetailInterface";
import AppointmentsFormInterface from "@app/modules/appointments/interfaces/appointmentsFormInterface";
import AppointmentsWeekInterface from "@app/modules/appointments/interfaces/appointmentsWeekInterface";
import { useAppointmentsProvider } from "@app/modules/appointments/states/appointmentsProvider";
import { startOfWeek, todayStr } from "@app/modules/main/helpers/weekDates";
import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import { useEntityOptions } from "@app/modules/main/hooks/useEntityOptions";
import { useRouter } from "@app/modules/main/hooks/useRouter";
import { useSession } from "@app/modules/main/hooks/useSession";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import { SelectInterface } from "@app/modules/main/interfaces/inputInterface";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { useEffect } from "react";

export default function AppointmentsModule() {
  const { getAppointmentsState } = useAppointmentsProvider();
  const {
    handleLoad,
    handleFilterVet,
    handleQuickStatus,
    handleQuickVet,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDetail,
    handleCancel,
    handleChangeField,
    handleSubmit,
    handleDelete,
    handleSetView,
    handlePrevWeek,
    handleNextWeek,
    handleToday,
    handleOpenCreateOnDate
  } = useAppointmentsActions();
  const { user, hasRole } = useSession();
  const { options: vetOptions } = useEntityOptions("vets");
  const { navigate, pathname, searchParams } = useRouter();
  const state = getAppointmentsState;
  const openId = searchParams.get("id");

  // Cada veterinario ve sólo sus turnos (salvo admin/recepción, que ven todos y pueden filtrar).
  const isVetScoped = hasRole(["vet"]) && !hasRole(["admin", "receptionist"]);
  const scoped = isVetScoped
    ? state.items.filter((a) => a.vetId === (user?.uid ?? ""))
    : state.items;
  const byVet =
    state.vetFilter === "all" ? scoped : scoped.filter((a) => a.vetId === state.vetFilter);
  const orderedItems = sortAppointmentsByDate(byVet);
  const effectiveWeekStart = state.weekStart || startOfWeek(todayStr());

  useDocumentHead({
    title: "Agenda",
    description: "Turnos, consultas y servicios agendados."
  });

  useEffect(() => {
    handleLoad();
  }, []);

  // Deep-link ?id=: al volver desde un registro clínico (o desde otra ficha), reabre el detalle del turno.
  useEffect(() => {
    if (!openId || state.loading) {
      return;
    }
    const item = state.items.find((a) => a.id === openId);
    if (item) {
      handleOpenDetail(item);
      navigate(pathname, { replace: true });
    }
  }, [openId, state.loading]);

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
          onChangeVet={handleQuickVet}
          onBack={handleCancel}
        />
      ) : null}

      {state.mode === "create" || state.mode === "edit" ? (
        <AppointmentsFormInterface
          form={state.form}
          errors={state.errors}
          saving={state.saving}
          isEdit={state.mode === "edit"}
          items={state.items}
          excludeId={state.selected?.id ?? ""}
          onChange={handleChangeField}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : null}

      {state.mode === "list" ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <ButtonInterface
              variant={state.view === "week" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => handleSetView("week")}
            >
              Semana
            </ButtonInterface>
            <ButtonInterface
              variant={state.view === "board" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => handleSetView("board")}
            >
              Tablero
            </ButtonInterface>

            <div className="ml-auto flex items-center gap-2">
              {isVetScoped ? (
                <span className="text-xs text-ink-soft">Mostrando tus turnos</span>
              ) : (
                <SelectInterface
                  value={state.vetFilter}
                  onChange={(e) => handleFilterVet(e.target.value)}
                  className="max-w-[14rem]"
                >
                  <option value="all">Todos los veterinarios</option>
                  {vetOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </SelectInterface>
              )}
              <ButtonInterface onClick={handleOpenCreate}>Nuevo turno</ButtonInterface>
            </div>
          </div>

          {state.view === "board" ? (
            <AppointmentsBoardInterface
              items={orderedItems}
              weekStart={effectiveWeekStart}
              onPrevWeek={handlePrevWeek}
              onNextWeek={handleNextWeek}
              onToday={handleToday}
              onOpenDetail={handleOpenDetail}
              onMoveStatus={(id, status) => {
                const appointment = state.items.find((a) => a.id === id);
                if (appointment) {
                  handleQuickStatus(appointment, status);
                }
              }}
            />
          ) : (
            <AppointmentsWeekInterface
              items={orderedItems}
              weekStart={effectiveWeekStart}
              onPrevWeek={handlePrevWeek}
              onNextWeek={handleNextWeek}
              onToday={handleToday}
              onOpenDetail={handleOpenDetail}
              onOpenCreateOnDate={handleOpenCreateOnDate}
            />
          )}
        </div>
      ) : null}
    </section>
  );
}
