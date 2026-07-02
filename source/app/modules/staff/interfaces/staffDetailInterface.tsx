import { ROLE_LABELS } from "@app/modules/main/constants/constants";
import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import CardInterface from "@app/modules/main/interfaces/cardInterface";
import FieldInterface from "@app/modules/main/interfaces/fieldInterface";
import { ArrowLeft } from "@app/modules/main/interfaces/icons";
import { InputInterface } from "@app/modules/main/interfaces/inputInterface";
import type { StaffType } from "@app/modules/staff/entities/entities";
import { formatStaffName } from "@app/modules/staff/helpers/formatStaffName";
import { useState } from "react";

type Props = {
  staff: StaffType;
  onEdit: (staff: StaffType) => void;
  onDelete: (staff: StaffType) => void;
  onBack: () => void;
  onResetPassword: (staff: StaffType, password: string) => void;
  onSendInvite: (staff: StaffType) => void;
  onToggleActive: (staff: StaffType) => void;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs uppercase tracking-wide text-ink-soft">{label}</dt>
      <dd className="text-sm text-ink">{value || "—"}</dd>
    </div>
  );
}

export default function StaffDetailInterface({
  staff,
  onEdit,
  onDelete,
  onBack,
  onResetPassword,
  onSendInvite,
  onToggleActive
}: Props) {
  const [password, setPassword] = useState("");
  const canSave = password.length >= 6;

  const submitPassword = (): void => {
    if (!canSave) {
      return;
    }
    onResetPassword(staff, password);
    setPassword("");
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <ButtonInterface variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
          Volver
        </ButtonInterface>
        <h2 className="font-display text-xl text-ink">{formatStaffName(staff)}</h2>
        {staff.roles.map((r) => (
          <BadgeInterface key={r} tone="brand">
            {ROLE_LABELS[r]}
          </BadgeInterface>
        ))}
        {staff.isActive ? (
          <BadgeInterface tone="success">Acceso habilitado</BadgeInterface>
        ) : (
          <BadgeInterface tone="neutral">Acceso deshabilitado</BadgeInterface>
        )}
        <div className="ml-auto flex gap-2">
          <ButtonInterface variant="secondary" size="sm" onClick={() => onEdit(staff)}>
            Editar
          </ButtonInterface>
          <ButtonInterface variant="danger" size="sm" onClick={() => onDelete(staff)}>
            Eliminar
          </ButtonInterface>
        </div>
      </div>

      <CardInterface>
        <h3 className="mb-4 font-display text-base text-brand-fg">Datos de contacto</h3>
        <dl className="grid gap-4 sm:grid-cols-3">
          <Row label="Nombre" value={staff.firstName} />
          <Row label="Apellido" value={staff.lastName} />
          <Row label="Roles" value={staff.roles.map((r) => ROLE_LABELS[r]).join(", ")} />
          <Row label="Email" value={staff.email} />
          <Row label="Teléfono" value={staff.phone} />
          <Row label="UID de Firebase Auth" value={staff.uid} />
        </dl>
      </CardInterface>

      <CardInterface>
        <h3 className="mb-4 font-display text-base text-brand-fg">Acceso</h3>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <ButtonInterface
              variant={staff.isActive ? "danger" : "success"}
              size="sm"
              onClick={() => onToggleActive(staff)}
            >
              {staff.isActive ? "Deshabilitar acceso" : "Habilitar acceso"}
            </ButtonInterface>
            <ButtonInterface variant="secondary" size="sm" onClick={() => onSendInvite(staff)}>
              Enviar invitación por email
            </ButtonInterface>
          </div>

          <div className="flex flex-col gap-2 border-t border-line pt-4">
            <FieldInterface
              label="Cambiar contraseña"
              hint="Mínimo 6 caracteres. Aplica de inmediato."
            >
              <InputInterface
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nueva contraseña"
              />
            </FieldInterface>
            <div>
              <ButtonInterface
                type="button"
                variant="secondary"
                size="sm"
                disabled={!canSave}
                onClick={submitPassword}
              >
                Actualizar contraseña
              </ButtonInterface>
            </div>
          </div>
        </div>
      </CardInterface>

      {staff.notes ? (
        <CardInterface>
          <h3 className="mb-2 font-display text-base text-brand-fg">Observaciones</h3>
          <p className="whitespace-pre-line text-sm text-ink">{staff.notes}</p>
        </CardInterface>
      ) : null}
    </div>
  );
}
