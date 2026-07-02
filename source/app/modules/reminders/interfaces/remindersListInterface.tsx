import { useEntityLookup } from "@app/modules/main/hooks/useEntityLookup";
import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import EmptyStateInterface from "@app/modules/main/interfaces/emptyStateInterface";
import EntityLinkInterface from "@app/modules/main/interfaces/entityLinkInterface";
import { Bell, Pencil } from "@app/modules/main/interfaces/icons";
import { InputInterface, SelectInterface } from "@app/modules/main/interfaces/inputInterface";
import {
  REMINDER_CHANNEL_LABELS,
  REMINDER_STATUS_LABELS,
  REMINDER_TYPE_LABELS
} from "@app/modules/reminders/constants/constants";
import type {
  ReminderStatusFilterType,
  ReminderStatusType,
  ReminderType,
  ReminderTypeFilterType,
  ReminderTypeType
} from "@app/modules/reminders/entities/entities";
import { isReminderOverdue } from "@app/modules/reminders/helpers/isReminderOverdue";

type Props = {
  items: ReminderType[];
  query: string;
  typeFilter: ReminderTypeFilterType;
  statusFilter: ReminderStatusFilterType;
  onSearch: (query: string) => void;
  onFilterType: (type: ReminderTypeFilterType) => void;
  onFilterStatus: (status: ReminderStatusFilterType) => void;
  onOpenCreate: () => void;
  onOpenDetail: (reminder: ReminderType) => void;
  onOpenEdit: (reminder: ReminderType) => void;
};

const TYPE_OPTIONS = Object.keys(REMINDER_TYPE_LABELS) as ReminderTypeType[];
const STATUS_OPTIONS = Object.keys(REMINDER_STATUS_LABELS) as ReminderStatusType[];

const STATUS_TONE: Record<ReminderStatusType, "warning" | "success" | "neutral"> = {
  pending: "warning",
  sent: "success",
  cancelled: "neutral"
};

export default function RemindersListInterface({
  items,
  query,
  typeFilter,
  statusFilter,
  onSearch,
  onFilterType,
  onFilterStatus,
  onOpenCreate,
  onOpenDetail,
  onOpenEdit
}: Props) {
  const { getLabel: getPatientLabel } = useEntityLookup("patients");
  const { getLabel: getClientLabel } = useEntityLookup("clients");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <InputInterface
          type="search"
          placeholder="Buscar por mensaje..."
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <SelectInterface
          value={typeFilter}
          onChange={(e) => onFilterType(e.target.value as ReminderTypeFilterType)}
          className="sm:max-w-[12rem]"
        >
          <option value="all">Todos los tipos</option>
          {TYPE_OPTIONS.map((type) => (
            <option key={type} value={type}>
              {REMINDER_TYPE_LABELS[type]}
            </option>
          ))}
        </SelectInterface>
        <SelectInterface
          value={statusFilter}
          onChange={(e) => onFilterStatus(e.target.value as ReminderStatusFilterType)}
          className="sm:max-w-[12rem]"
        >
          <option value="all">Todos los estados</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {REMINDER_STATUS_LABELS[status]}
            </option>
          ))}
        </SelectInterface>
        <div className="sm:ml-auto">
          <ButtonInterface onClick={onOpenCreate}>Nuevo recordatorio</ButtonInterface>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyStateInterface
          icon={Bell}
          title="No hay recordatorios para mostrar"
          description="Cargá el primer recordatorio o ajustá la búsqueda y los filtros."
          action={<ButtonInterface onClick={onOpenCreate}>Nuevo recordatorio</ButtonInterface>}
        />
      ) : (
        <div className="overflow-x-auto rounded-card border border-line bg-surface shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-semibold">Vencimiento</th>
                <th className="px-4 py-3 font-semibold">Paciente</th>
                <th className="px-4 py-3 font-semibold">Cliente</th>
                <th className="px-4 py-3 font-semibold">Tipo</th>
                <th className="px-4 py-3 font-semibold">Canal</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((reminder) => {
                const overdue =
                  reminder.status === "pending" && isReminderOverdue(reminder.dueDate);
                return (
                  <tr
                    key={reminder.id}
                    className="cursor-pointer border-b border-line/60 last:border-0 hover:bg-surface-muted"
                    onClick={() => onOpenDetail(reminder)}
                  >
                    <td className="px-4 py-3 font-medium text-ink">
                      <span className="inline-flex items-center gap-2">
                        {reminder.dueDate || "—"}
                        {overdue ? <BadgeInterface tone="error">Vencido</BadgeInterface> : null}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <EntityLinkInterface
                        kind="patients"
                        id={reminder.patientId}
                        label={getPatientLabel(reminder.patientId)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <EntityLinkInterface
                        kind="clients"
                        id={reminder.clientId}
                        label={getClientLabel(reminder.clientId)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <BadgeInterface tone="brand">
                        {REMINDER_TYPE_LABELS[reminder.type]}
                      </BadgeInterface>
                    </td>
                    <td className="px-4 py-3 text-ink-soft">
                      {REMINDER_CHANNEL_LABELS[reminder.channel]}
                    </td>
                    <td className="px-4 py-3">
                      <BadgeInterface tone={STATUS_TONE[reminder.status]}>
                        {REMINDER_STATUS_LABELS[reminder.status]}
                      </BadgeInterface>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        aria-label={`Editar recordatorio del ${reminder.dueDate}`}
                        className="inline-flex items-center gap-1 rounded-buttons px-2 py-1 text-xs text-brand-fg hover:bg-brand-tint"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenEdit(reminder);
                        }}
                      >
                        <Pencil className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
                        Editar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
