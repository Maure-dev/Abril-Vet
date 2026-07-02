import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import CardInterface from "@app/modules/main/interfaces/cardInterface";
import { ArrowLeft } from "@app/modules/main/interfaces/icons";
import {
  REMINDER_CHANNEL_LABELS,
  REMINDER_STATUS_LABELS,
  REMINDER_TYPE_LABELS
} from "@app/modules/reminders/constants/constants";
import type { ReminderType } from "@app/modules/reminders/entities/entities";
import { isReminderOverdue } from "@app/modules/reminders/helpers/isReminderOverdue";

type Props = {
  reminder: ReminderType;
  onEdit: (reminder: ReminderType) => void;
  onDelete: (reminder: ReminderType) => void;
  onBack: () => void;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs uppercase tracking-wide text-ink-soft">{label}</dt>
      <dd className="text-sm text-ink">{value || "—"}</dd>
    </div>
  );
}

export default function RemindersDetailInterface({ reminder, onEdit, onDelete, onBack }: Props) {
  const overdue = reminder.status === "pending" && isReminderOverdue(reminder.dueDate);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <ButtonInterface variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
          Volver
        </ButtonInterface>
        <h2 className="font-display text-xl text-ink">{REMINDER_TYPE_LABELS[reminder.type]}</h2>
        <BadgeInterface tone="brand">{REMINDER_STATUS_LABELS[reminder.status]}</BadgeInterface>
        {overdue ? <BadgeInterface tone="error">Vencido</BadgeInterface> : null}
        <div className="ml-auto flex gap-2">
          <ButtonInterface variant="secondary" size="sm" onClick={() => onEdit(reminder)}>
            Editar
          </ButtonInterface>
          <ButtonInterface variant="danger" size="sm" onClick={() => onDelete(reminder)}>
            Eliminar
          </ButtonInterface>
        </div>
      </div>

      <CardInterface>
        <h3 className="mb-4 font-display text-base text-brand-fg">Datos del recordatorio</h3>
        <dl className="grid gap-4 sm:grid-cols-3">
          <Row label="Vencimiento" value={reminder.dueDate} />
          <Row label="Tipo" value={REMINDER_TYPE_LABELS[reminder.type]} />
          <Row label="Canal" value={REMINDER_CHANNEL_LABELS[reminder.channel]} />
          <Row label="Estado" value={REMINDER_STATUS_LABELS[reminder.status]} />
          <Row label="Paciente (ID)" value={reminder.patientId} />
          <Row label="Cliente (ID)" value={reminder.clientId} />
        </dl>
      </CardInterface>

      {reminder.message ? (
        <CardInterface>
          <h3 className="mb-2 font-display text-base text-brand-fg">Mensaje</h3>
          <p className="whitespace-pre-line text-sm text-ink">{reminder.message}</p>
        </CardInterface>
      ) : null}
    </div>
  );
}
