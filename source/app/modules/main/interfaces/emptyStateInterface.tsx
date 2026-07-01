import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import IconInterface from "./iconInterface";

type Props = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  // Acción opcional (por ejemplo, un botón "Nuevo").
  action?: ReactNode;
};

// Estado vacío compartido (listas sin datos, secciones en construcción).
export default function EmptyStateInterface({ icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-card border border-dashed border-line bg-surface-muted px-6 py-12 text-center">
      {icon ? (
        <span className="rounded-full bg-brand-tint p-3 text-brand-fg">
          <IconInterface icon={icon} size="lg" />
        </span>
      ) : null}
      <h2 className="font-display text-lg text-ink">{title}</h2>
      {description ? <p className="max-w-md text-sm text-ink-soft">{description}</p> : null}
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
