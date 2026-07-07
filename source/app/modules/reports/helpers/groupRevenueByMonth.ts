import type { MonthlyRevenueType, SaleForReportType } from "@app/modules/reports/entities/entities";

const MONTH_NAMES = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic"
];

// Suma las ventas por mes para los últimos `months` meses (incluyendo el de `reference`).
// `reference` es yyyy-mm-dd. Puro y testeable (no usa new Date()); parsea por componentes.
export function groupRevenueByMonth(
  sales: SaleForReportType[],
  reference: string,
  months: number
): MonthlyRevenueType[] {
  const [year, month] = reference.split("-").map(Number); // month 1-12
  const baseIndex = year * 12 + (month - 1);
  const buckets: MonthlyRevenueType[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const monthCount = baseIndex - i;
    const bucketYear = Math.floor(monthCount / 12);
    const bucketMonth = monthCount % 12; // 0-11
    const key = `${bucketYear}-${String(bucketMonth + 1).padStart(2, "0")}`;
    const total = sales
      .filter((sale) => (sale.date || "").slice(0, 7) === key)
      .reduce((sum, sale) => sum + (sale.total || 0), 0);
    buckets.push({ key: key, label: MONTH_NAMES[bucketMonth], total: total });
  }
  return buckets;
}
