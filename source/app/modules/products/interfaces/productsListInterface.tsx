import { useEntityLookup } from "@app/modules/main/hooks/useEntityLookup";
import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import EmptyStateInterface from "@app/modules/main/interfaces/emptyStateInterface";
import { Package, Pencil } from "@app/modules/main/interfaces/icons";
import { InputInterface, SelectInterface } from "@app/modules/main/interfaces/inputInterface";
import { CATEGORY_LABELS } from "@app/modules/products/constants/constants";
import type {
  CategoryFilterType,
  ProductCategoryType,
  ProductType,
  StatusFilterType
} from "@app/modules/products/entities/entities";
import { formatMoney } from "@app/modules/products/helpers/formatMoney";
import { isLowStock } from "@app/modules/products/helpers/productMetrics";

type Props = {
  items: ProductType[];
  query: string;
  categoryFilter: CategoryFilterType;
  statusFilter: StatusFilterType;
  onSearch: (query: string) => void;
  onFilterCategory: (category: CategoryFilterType) => void;
  onFilterStatus: (status: StatusFilterType) => void;
  onOpenCreate: () => void;
  onOpenDetail: (product: ProductType) => void;
  onOpenEdit: (product: ProductType) => void;
};

const CATEGORY_OPTIONS = Object.keys(CATEGORY_LABELS) as ProductCategoryType[];

export default function ProductsListInterface({
  items,
  query,
  categoryFilter,
  statusFilter,
  onSearch,
  onFilterCategory,
  onFilterStatus,
  onOpenCreate,
  onOpenDetail,
  onOpenEdit
}: Props) {
  const { getLabel: getSupplierLabel } = useEntityLookup("suppliers");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <InputInterface
          type="search"
          placeholder="Buscar por nombre, código o código de barras..."
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <SelectInterface
          value={categoryFilter}
          onChange={(e) => onFilterCategory(e.target.value as CategoryFilterType)}
          className="sm:max-w-[12rem]"
        >
          <option value="all">Todas las categorías</option>
          {CATEGORY_OPTIONS.map((category) => (
            <option key={category} value={category}>
              {CATEGORY_LABELS[category]}
            </option>
          ))}
        </SelectInterface>
        <SelectInterface
          value={statusFilter}
          onChange={(e) => onFilterStatus(e.target.value as StatusFilterType)}
          className="sm:max-w-[10rem]"
        >
          <option value="all">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </SelectInterface>
        <div className="sm:ml-auto">
          <ButtonInterface onClick={onOpenCreate}>Nuevo producto</ButtonInterface>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyStateInterface
          icon={Package}
          title="No hay productos para mostrar"
          description="Cargá el primer producto o ajustá la búsqueda y los filtros."
          action={<ButtonInterface onClick={onOpenCreate}>Nuevo producto</ButtonInterface>}
        />
      ) : (
        <div className="overflow-x-auto rounded-card border border-line bg-surface shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-semibold">Código</th>
                <th className="px-4 py-3 font-semibold">Nombre</th>
                <th className="px-4 py-3 font-semibold">Proveedor</th>
                <th className="px-4 py-3 font-semibold">Categoría</th>
                <th className="px-4 py-3 font-semibold">Precio venta</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((product) => (
                <tr
                  key={product.id}
                  className="cursor-pointer border-b border-line/60 last:border-0 hover:bg-surface-muted"
                  onClick={() => onOpenDetail(product)}
                >
                  <td className="px-4 py-3 font-medium text-ink">{product.code}</td>
                  <td className="px-4 py-3 text-ink">{product.name}</td>
                  <td className="px-4 py-3 text-ink-soft">
                    {getSupplierLabel(product.supplierId) || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <BadgeInterface tone="brand">
                      {CATEGORY_LABELS[product.category]}
                    </BadgeInterface>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{formatMoney(product.salePrice)}</td>
                  <td className="px-4 py-3">
                    {isLowStock(product.stock, product.minStock) ? (
                      <BadgeInterface tone="warning">{product.stock} (bajo)</BadgeInterface>
                    ) : (
                      <span className="text-ink-soft">{product.stock}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      aria-label={`Editar ${product.name}`}
                      className="inline-flex items-center gap-1 rounded-buttons px-2 py-1 text-xs text-brand-fg hover:bg-brand-tint"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEdit(product);
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
