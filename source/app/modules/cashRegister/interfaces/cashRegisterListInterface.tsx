import { CASH_STATUS_LABELS } from "@app/modules/cashRegister/constants/constants";
import type {
  CashSessionType,
  CashStatusFilterType,
  CashStatusType
} from "@app/modules/cashRegister/entities/entities";
import { formatMoney } from "@app/modules/cashRegister/helpers/computeCash";
import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import EmptyStateInterface from "@app/modules/main/interfaces/emptyStateInterface";
import { Pencil, Wallet } from "@app/modules/main/interfaces/icons";
import { InputInterface, SelectInterface } from "@app/modules/main/interfaces/inputInterface";

type Props = {
  items: CashSessionType[];
  query: string;
  statusFilter: CashStatusFilterType;
  onSearch: (query: string) => void;
  onFilterStatus: (status: CashStatusFilterType) => void;
  onOpenCreate: () => void;
  onOpenDetail: (session: CashSessionType) => void;
  onOpenEdit: (session: CashSessionType) => void;
};

const STATUS_OPTIONS = Object.keys(CASH_STATUS_LABELS) as CashStatusType[];

// Muestra solo la fecha (yyyy-mm-dd) de un ISO datetime, o "—" si está vacío.
function formatDate(value: string): string {
  if (value.length === 0) {
    return "—";
  }
  return value.slice(0, 10);
}

export default function CashRegisterListInterface({
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
          placeholder="Buscar por fecha o notas..."
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <SelectInterface
          value={statusFilter}
          onChange={(e) => onFilterStatus(e.target.value as CashStatusFilterType)}
          className="sm:max-w-[12rem]"
        >
          <option value="all">Todos los estados</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {CASH_STATUS_LABELS[status]}
            </option>
          ))}
        </SelectInterface>
        <div className="sm:ml-auto">
          <ButtonInterface onClick={onOpenCreate}>Nueva caja</ButtonInterface>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyStateInterface
          icon={Wallet}
          title="No hay sesiones de caja para mostrar"
          description="Abrí la primera caja o ajustá la búsqueda y los filtros."
          action={<ButtonInterface onClick={onOpenCreate}>Nueva caja</ButtonInterface>}
        />
      ) : (
        <div className="overflow-x-auto rounded-card border border-line bg-surface shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">Apertura</th>
                <th className="px-4 py-3 font-semibold">Cierre</th>
                <th className="px-4 py-3 font-semibold">Esperado</th>
                <th className="px-4 py-3 font-semibold">Contado</th>
                <th className="px-4 py-3 font-semibold">Diferencia</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((session) => (
                <tr
                  key={session.id}
                  className="cursor-pointer border-b border-line/60 last:border-0 hover:bg-surface-muted"
                  onClick={() => onOpenDetail(session)}
                >
                  <td className="px-4 py-3">
                    <BadgeInterface tone={session.status === "open" ? "success" : "neutral"}>
                      {CASH_STATUS_LABELS[session.status]}
                    </BadgeInterface>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{formatDate(session.openedAt)}</td>
                  <td className="px-4 py-3 text-ink-soft">{formatDate(session.closedAt)}</td>
                  <td className="px-4 py-3 text-ink-soft">{formatMoney(session.expectedAmount)}</td>
                  <td className="px-4 py-3 text-ink-soft">
                    {session.countedAmount === null ? "—" : formatMoney(session.countedAmount)}
                  </td>
                  <td className="px-4 py-3 text-ink-soft">
                    {session.status === "closed" ? formatMoney(session.difference) : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      aria-label="Editar sesión de caja"
                      className="inline-flex items-center gap-1 rounded-buttons px-2 py-1 text-xs text-brand-fg hover:bg-brand-tint"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEdit(session);
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
