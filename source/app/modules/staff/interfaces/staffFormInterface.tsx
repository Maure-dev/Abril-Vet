import { ROLE_LABELS } from "@app/modules/main/constants/constants";
import type { UserRoleType } from "@app/modules/main/entities/entities";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import FieldInterface from "@app/modules/main/interfaces/fieldInterface";
import {
  InputInterface,
  SelectInterface,
  TextareaInterface
} from "@app/modules/main/interfaces/inputInterface";
import type { StaffFormErrorsType, StaffFormType } from "@app/modules/staff/entities/entities";

type Props = {
  form: StaffFormType;
  errors: StaffFormErrorsType;
  saving: boolean;
  isEdit: boolean;
  onChange: <K extends keyof StaffFormType>(field: K, value: StaffFormType[K]) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

const ROLE_OPTIONS = Object.keys(ROLE_LABELS) as UserRoleType[];

export default function StaffFormInterface({
  form,
  errors,
  saving,
  isEdit,
  onChange,
  onSubmit,
  onCancel
}: Props) {
  const toggleRole = (role: UserRoleType): void => {
    const next = form.roles.includes(role)
      ? form.roles.filter((r) => r !== role)
      : [...form.roles, role];
    onChange("roles", next);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex flex-col gap-5"
    >
      <p className="rounded-card border border-line bg-surface-muted px-4 py-3 text-sm text-ink-soft">
        Al crear personal se crea también el usuario de acceso en Firebase Auth con los roles
        elegidos. Después podés deshabilitar el acceso, cambiar la contraseña o enviar una
        invitación desde la ficha del usuario.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <FieldInterface label="Nombre" error={errors.firstName} required>
          <InputInterface
            value={form.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
          />
        </FieldInterface>
        <FieldInterface label="Apellido" error={errors.lastName} required>
          <InputInterface
            value={form.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
          />
        </FieldInterface>
        <FieldInterface
          label="Email"
          error={errors.email}
          hint={isEdit ? "El email de acceso no se puede cambiar" : undefined}
          required
        >
          <InputInterface
            type="email"
            value={form.email}
            disabled={isEdit}
            onChange={(e) => onChange("email", e.target.value)}
          />
        </FieldInterface>
        {!isEdit ? (
          <FieldInterface
            label="Contraseña inicial"
            error={errors.password}
            hint="Mínimo 6 caracteres. El usuario podrá cambiarla luego."
            required
          >
            <InputInterface
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => onChange("password", e.target.value)}
            />
          </FieldInterface>
        ) : null}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="text-sm font-medium text-ink">
            Roles<span className="text-brand-fg"> *</span>
          </span>
          <p className="text-xs text-ink-soft">
            Un usuario puede tener varios roles y ver las vistas de todos.
          </p>
          <div className="flex flex-wrap gap-2">
            {ROLE_OPTIONS.map((role) => {
              const active = form.roles.includes(role);
              return (
                <label
                  key={role}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-buttons border px-3 py-2 text-sm ${
                    active
                      ? "border-brand bg-brand-tint text-brand-fg"
                      : "border-line text-ink-soft"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleRole(role)}
                    className="accent-brand"
                  />
                  {ROLE_LABELS[role]}
                </label>
              );
            })}
          </div>
          {errors.roles ? (
            <p role="alert" className="text-xs text-error">
              {errors.roles}
            </p>
          ) : null}
        </div>
        <FieldInterface label="Teléfono">
          <InputInterface value={form.phone} onChange={(e) => onChange("phone", e.target.value)} />
        </FieldInterface>
        <FieldInterface label="Estado del acceso">
          <SelectInterface
            value={form.isActive ? "active" : "inactive"}
            onChange={(e) => onChange("isActive", e.target.value === "active")}
          >
            <option value="active">Habilitado</option>
            <option value="inactive">Deshabilitado</option>
          </SelectInterface>
        </FieldInterface>
      </div>

      <FieldInterface label="Observaciones">
        <TextareaInterface
          rows={3}
          value={form.notes}
          onChange={(e) => onChange("notes", e.target.value)}
        />
      </FieldInterface>

      <div className="flex items-center gap-3">
        <ButtonInterface type="submit" variant="success" loading={saving}>
          {isEdit ? "Guardar cambios" : "Crear personal y acceso"}
        </ButtonInterface>
        <ButtonInterface type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </ButtonInterface>
      </div>
    </form>
  );
}
