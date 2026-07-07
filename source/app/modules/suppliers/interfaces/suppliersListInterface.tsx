import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import EmptyStateInterface from "@app/modules/main/interfaces/emptyStateInterface";
import { Building2, Pencil } from "@app/modules/main/interfaces/icons";
import { InputInterface, SelectInterface } from "@app/modules/main/interfaces/inputInterface";
import { STATUS_FILTER_LABELS } from "@app/modules/suppliers/constants/constants";
import type {
  SupplierStatusFilterType,
  SupplierType
} from "@app/modules/suppliers/entities/entities";

type Props = {
  items: SupplierType[];
  query: string;
  statusFilter: SupplierStatusFilterType;
  onSearch: (query: string) => void;
  onFilterStatus: (status: SupplierStatusFilterType) => void;
  onOpenCreate: () => void;
  onOpenDetail: (supplier: SupplierType) => void;
  onOpenEdit: (supplier: SupplierType) => void;
};

const STATUS_OPTIONS = Object.keys(STATUS_FILTER_LABELS) as SupplierStatusFilterType[];

export default function SuppliersListInterface({
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
          placeholder="Buscar por nombre, CUIT o email..."
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <SelectInterface
          value={statusFilter}
          onChange={(e) => onFilterStatus(e.target.value as SupplierStatusFilterType)}
          className="sm:max-w-[12rem]"
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {STATUS_FILTER_LABELS[status]}
            </option>
          ))}
        </SelectInterface>
        <div className="sm:ml-auto">
          <ButtonInterface onClick={onOpenCreate}>Nuevo proveedor</ButtonInterface>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyStateInterface
          icon={Building2}
          title="No hay proveedores para mostrar"
          description="Cargá el primer proveedor o ajustá la búsqueda y los filtros."
          action={<ButtonInterface onClick={onOpenCreate}>Nuevo proveedor</ButtonInterface>}
        />
      ) : (
        <div className="overflow-x-auto rounded-card border border-line bg-surface shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-semibold">Nombre</th>
                <th className="px-4 py-3 font-semibold">CUIT</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Teléfono</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((supplier) => (
                <tr
                  key={supplier.id}
                  className="cursor-pointer border-b border-line/60 last:border-0 hover:bg-surface-muted"
                  onClick={() => onOpenDetail(supplier)}
                >
                  <td className="px-4 py-3 font-medium text-ink">{supplier.name}</td>
                  <td className="px-4 py-3 text-ink-soft">{supplier.cuit || "—"}</td>
                  <td className="px-4 py-3 text-ink-soft">{supplier.email || "—"}</td>
                  <td className="px-4 py-3 text-ink-soft">{supplier.phone || "—"}</td>
                  <td className="px-4 py-3">
                    <BadgeInterface tone={supplier.isActive ? "success" : "neutral"}>
                      {supplier.isActive ? "Activo" : "Inactivo"}
                    </BadgeInterface>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      aria-label={`Editar ${supplier.name}`}
                      className="inline-flex items-center gap-1 rounded-buttons px-2 py-1 text-xs text-brand-fg hover:bg-brand-tint"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEdit(supplier);
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
