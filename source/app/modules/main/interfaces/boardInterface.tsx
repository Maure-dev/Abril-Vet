import { type ReactNode, useState } from "react";

type ColumnType = { key: string; label: string };

type Props<T> = {
  columns: ColumnType[];
  items: T[];
  getId: (item: T) => string;
  getColumn: (item: T) => string;
  renderCard: (item: T) => ReactNode;
  onMove: (id: string, columnKey: string) => void;
  emptyLabel?: string;
};

// Tablero kanban genérico con arrastrar y soltar (como un tablero de Jira): las columnas son los
// estados y al soltar una tarjeta en otra columna se dispara onMove(id, columna). Reutilizable por
// cualquier módulo con flujo por estados (turnos, compras, estudios, etc.).
export default function BoardInterface<T>({
  columns,
  items,
  getId,
  getColumn,
  renderCard,
  onMove,
  emptyLabel = "Vacío"
}: Props<T>) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [overColumn, setOverColumn] = useState<string | null>(null);

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {columns.map((column) => {
        const columnItems = items.filter((item) => getColumn(item) === column.key);
        const isOver = overColumn === column.key;
        return (
          <div
            key={column.key}
            onDragOver={(e) => {
              e.preventDefault();
              setOverColumn(column.key);
            }}
            onDragLeave={() =>
              setOverColumn((current) => (current === column.key ? null : current))
            }
            onDrop={(e) => {
              e.preventDefault();
              if (dragId) {
                onMove(dragId, column.key);
              }
              setDragId(null);
              setOverColumn(null);
            }}
            className={`flex min-h-[8rem] flex-col gap-2 rounded-card border p-3 transition-colors ${
              isOver ? "border-brand bg-brand-tint/40" : "border-line bg-surface-muted"
            }`}
          >
            <p className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-ink-soft">
              {column.label}
              <span className="rounded-full bg-surface px-2 py-0.5 text-ink">
                {columnItems.length}
              </span>
            </p>
            {columnItems.length === 0 ? (
              <p className="py-4 text-center text-xs text-ink-soft/70">{emptyLabel}</p>
            ) : (
              columnItems.map((item) => (
                <div
                  key={getId(item)}
                  draggable
                  onDragStart={() => setDragId(getId(item))}
                  onDragEnd={() => {
                    setDragId(null);
                    setOverColumn(null);
                  }}
                  className="cursor-grab rounded-buttons border border-line bg-surface p-3 shadow-soft active:cursor-grabbing"
                >
                  {renderCard(item)}
                </div>
              ))
            )}
          </div>
        );
      })}
    </div>
  );
}
