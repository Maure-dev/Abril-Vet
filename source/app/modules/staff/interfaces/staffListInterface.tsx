import { ROLE_LABELS } from "@app/modules/main/constants/constants";
import type { UserRoleType } from "@app/modules/main/entities/entities";
import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import EmptyStateInterface from "@app/modules/main/interfaces/emptyStateInterface";
import { Pencil, UserCog } from "@app/modules/main/interfaces/icons";
import { InputInterface, SelectInterface } from "@app/modules/main/interfaces/inputInterface";
import { STATUS_FILTER_LABELS } from "@app/modules/staff/constants/constants";
import type {
  RoleFilterType,
  StaffType,
  StatusFilterType
} from "@app/modules/staff/entities/entities";
import { formatStaffName } from "@app/modules/staff/helpers/formatStaffName";

type Props = {
  items: StaffType[];
  query: string;
  roleFilter: RoleFilterType;
  statusFilter: StatusFilterType;
  onSearch: (query: string) => void;
  onFilterRole: (role: RoleFilterType) => void;
  onFilterStatus: (status: StatusFilterType) => void;
  onOpenCreate: () => void;
  onOpenDetail: (staff: StaffType) => void;
  onOpenEdit: (staff: StaffType) => void;
};

const ROLE_OPTIONS = Object.keys(ROLE_LABELS) as UserRoleType[];
const STATUS_OPTIONS = Object.keys(STATUS_FILTER_LABELS) as StatusFilterType[];

export default function StaffListInterface({
  items,
  query,
  roleFilter,
  statusFilter,
  onSearch,
  onFilterRole,
  onFilterStatus,
  onOpenCreate,
  onOpenDetail,
  onOpenEdit
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <InputInterface
          type="search"
          placeholder="Buscar por nombre, apellido o email..."
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <SelectInterface
          value={roleFilter}
          onChange={(e) => onFilterRole(e.target.value as RoleFilterType)}
          className="sm:max-w-[12rem]"
        >
          <option value="all">Todos los roles</option>
          {ROLE_OPTIONS.map((role) => (
            <option key={role} value={role}>
              {ROLE_LABELS[role]}
            </option>
          ))}
        </SelectInterface>
        <SelectInterface
          value={statusFilter}
          onChange={(e) => onFilterStatus(e.target.value as StatusFilterType)}
          className="sm:max-w-[12rem]"
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {STATUS_FILTER_LABELS[status]}
            </option>
          ))}
        </SelectInterface>
        <div className="sm:ml-auto">
          <ButtonInterface onClick={onOpenCreate}>Nuevo personal</ButtonInterface>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyStateInterface
          icon={UserCog}
          title="No hay personal para mostrar"
          description="Cargá el primer miembro del personal o ajustá la búsqueda y los filtros."
          action={<ButtonInterface onClick={onOpenCreate}>Nuevo personal</ButtonInterface>}
        />
      ) : (
        <div className="overflow-x-auto rounded-card border border-line bg-surface shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-semibold">Nombre</th>
                <th className="px-4 py-3 font-semibold">Rol</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((staff) => (
                <tr
                  key={staff.id}
                  className="cursor-pointer border-b border-line/60 last:border-0 hover:bg-surface-muted"
                  onClick={() => onOpenDetail(staff)}
                >
                  <td className="px-4 py-3 font-medium text-ink">{formatStaffName(staff)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {staff.roles.map((r) => (
                        <BadgeInterface key={r} tone="brand">
                          {ROLE_LABELS[r]}
                        </BadgeInterface>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{staff.email || "—"}</td>
                  <td className="px-4 py-3">
                    {staff.isActive ? (
                      <BadgeInterface tone="success">Activo</BadgeInterface>
                    ) : (
                      <BadgeInterface tone="neutral">Inactivo</BadgeInterface>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      aria-label={`Editar ${formatStaffName(staff)}`}
                      className="inline-flex items-center gap-1 rounded-buttons px-2 py-1 text-xs text-brand-fg hover:bg-brand-tint"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEdit(staff);
                      }}
                    >
                      <Pencil className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
