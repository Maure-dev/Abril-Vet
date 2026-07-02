import { STATUS_FILTER_LABELS } from "@app/modules/clients/constants/constants";
import type { ClientType, StatusFilterType } from "@app/modules/clients/entities/entities";
import { formatClientName } from "@app/modules/clients/helpers/formatClientName";
import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import EmptyStateInterface from "@app/modules/main/interfaces/emptyStateInterface";
import { Pencil, Plus, Users } from "@app/modules/main/interfaces/icons";
import { InputInterface, SelectInterface } from "@app/modules/main/interfaces/inputInterface";

type Props = {
  items: ClientType[];
  query: string;
  statusFilter: StatusFilterType;
  onSearch: (query: string) => void;
  onFilterStatus: (status: StatusFilterType) => void;
  onOpenCreate: () => void;
  onOpenDetail: (client: ClientType) => void;
  onOpenEdit: (client: ClientType) => void;
};

const STATUS_OPTIONS = Object.keys(STATUS_FILTER_LABELS) as StatusFilterType[];

export default function ClientsListInterface({
  items,
  query,
  statusFilter,
  onSearch,
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
          placeholder="Buscar por nombre, documento, teléfono o email..."
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          className="sm:max-w-xs"
        />
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
          <ButtonInterface onClick={onOpenCreate}>
            <Plus className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
            Nuevo cliente
          </ButtonInterface>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyStateInterface
          icon={Users}
          title="No hay clientes para mostrar"
          description="Cargá el primer cliente o ajustá la búsqueda y los filtros."
          action={<ButtonInterface onClick={onOpenCreate}>Nuevo cliente</ButtonInterface>}
        />
      ) : (
        <div className="overflow-x-auto rounded-card border border-line bg-surface shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-semibold">Nombre</th>
                <th className="px-4 py-3 font-semibold">Documento</th>
                <th className="px-4 py-3 font-semibold">Teléfono</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((client) => (
                <tr
                  key={client.id}
                  className="cursor-pointer border-b border-line/60 last:border-0 hover:bg-surface-muted"
                  onClick={() => onOpenDetail(client)}
                >
                  <td className="px-4 py-3 font-medium text-ink">{formatClientName(client)}</td>
                  <td className="px-4 py-3 text-ink-soft">{client.docId || "—"}</td>
                  <td className="px-4 py-3 text-ink-soft">{client.phone || "—"}</td>
                  <td className="px-4 py-3 text-ink-soft">{client.email || "—"}</td>
                  <td className="px-4 py-3">
                    {client.isActive ? (
                      <BadgeInterface tone="success">Activo</BadgeInterface>
                    ) : (
                      <BadgeInterface tone="neutral">Inactivo</BadgeInterface>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      aria-label={`Editar ${formatClientName(client)}`}
                      className="inline-flex items-center gap-1 rounded-buttons px-2 py-1 text-xs text-brand-fg hover:bg-brand-tint"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEdit(client);
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
