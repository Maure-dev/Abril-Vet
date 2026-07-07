import type { MonthlyRevenueType } from "@app/modules/reports/entities/entities";

const money = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0
});

// Etiqueta compacta arriba de cada barra (para que entre): $12k, $500, etc.
function compact(value: number): string {
  return value >= 1000 ? `$${Math.round(value / 1000)}k` : `$${value}`;
}

type Props = { data: MonthlyRevenueType[] };

// Barras de facturación por mes: una sola serie (hue de marca, adapta a claro/oscuro), valor
// compacto arriba, mes abajo y monto completo al pasar el mouse. Sin librería de gráficos.
export default function ReportsRevenueChartInterface({ data }: Props) {
  const max = Math.max(1, ...data.map((bucket) => bucket.total));
  const hasData = data.some((bucket) => bucket.total > 0);

  return (
    <div className="rounded-card border border-line bg-surface p-5 shadow-card">
      <h3 className="mb-4 font-display text-base text-brand-fg">Facturación por mes</h3>
      {!hasData ? (
        <p className="text-sm text-ink-soft">Todavía no hay ventas registradas.</p>
      ) : (
        <div className="flex h-48 items-end gap-3">
          {data.map((bucket) => {
            const pct = Math.round((bucket.total / max) * 100);
            return (
              <div key={bucket.key} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs font-medium text-ink">
                  {bucket.total > 0 ? compact(bucket.total) : ""}
                </span>
                <div className="flex w-full flex-1 items-end">
                  <div
                    title={`${bucket.label}: ${money.format(bucket.total)}`}
                    style={{ height: `${Math.max(pct, 2)}%` }}
                    className="w-full rounded-t bg-brand"
                  />
                </div>
                <span className="text-xs uppercase text-ink-soft">{bucket.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
