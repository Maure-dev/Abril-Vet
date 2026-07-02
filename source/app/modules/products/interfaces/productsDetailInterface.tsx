import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import CardInterface from "@app/modules/main/interfaces/cardInterface";
import { ArrowLeft } from "@app/modules/main/interfaces/icons";
import { CATEGORY_LABELS } from "@app/modules/products/constants/constants";
import type { ProductType } from "@app/modules/products/entities/entities";
import { formatMoney } from "@app/modules/products/helpers/formatMoney";
import { computeMargin, isLowStock } from "@app/modules/products/helpers/productMetrics";

type Props = {
  product: ProductType;
  onEdit: (product: ProductType) => void;
  onDelete: (product: ProductType) => void;
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

export default function ProductsDetailInterface({ product, onEdit, onDelete, onBack }: Props) {
  const margin = computeMargin(product.costPrice, product.salePrice);
  const lowStock = isLowStock(product.stock, product.minStock);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <ButtonInterface variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
          Volver
        </ButtonInterface>
        <h2 className="font-display text-xl text-ink">{product.name}</h2>
        <BadgeInterface tone="brand">{CATEGORY_LABELS[product.category]}</BadgeInterface>
        {!product.isActive ? <BadgeInterface tone="neutral">Inactivo</BadgeInterface> : null}
        {lowStock ? <BadgeInterface tone="warning">Stock bajo</BadgeInterface> : null}
        <div className="ml-auto flex gap-2">
          <ButtonInterface variant="secondary" size="sm" onClick={() => onEdit(product)}>
            Editar
          </ButtonInterface>
          <ButtonInterface variant="danger" size="sm" onClick={() => onDelete(product)}>
            Eliminar
          </ButtonInterface>
        </div>
      </div>

      <CardInterface>
        <h3 className="mb-4 font-display text-base text-brand-fg">Precios</h3>
        <dl className="grid gap-4 sm:grid-cols-3">
          <Row label="Precio de costo" value={formatMoney(product.costPrice)} />
          <Row label="Precio de venta" value={formatMoney(product.salePrice)} />
          <Row label="Margen" value={`${margin} %`} />
          <Row label="IVA" value={`${product.ivaPct} %`} />
        </dl>
      </CardInterface>

      <CardInterface>
        <h3 className="mb-4 font-display text-base text-brand-fg">Stock</h3>
        <dl className="grid gap-4 sm:grid-cols-3">
          <Row label="Stock actual" value={String(product.stock)} />
          <Row label="Stock mínimo" value={String(product.minStock)} />
          <Row label="Unidad" value={product.unit} />
          <Row label="Vencimiento" value={product.expirationDate} />
          <Row label="Lote" value={product.batch} />
        </dl>
      </CardInterface>

      <CardInterface>
        <h3 className="mb-4 font-display text-base text-brand-fg">Datos generales</h3>
        <dl className="grid gap-4 sm:grid-cols-3">
          <Row label="Código" value={product.code} />
          <Row label="Código de barras" value={product.barcode} />
          <Row label="Marca" value={product.brand} />
          <Row label="Proveedor (ID)" value={product.supplierId} />
        </dl>
      </CardInterface>

      {product.notes ? (
        <CardInterface>
          <h3 className="mb-2 font-display text-base text-brand-fg">Observaciones</h3>
          <p className="whitespace-pre-line text-sm text-ink">{product.notes}</p>
        </CardInterface>
      ) : null}
    </div>
  );
}
