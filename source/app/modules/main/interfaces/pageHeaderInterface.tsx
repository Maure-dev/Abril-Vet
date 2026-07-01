import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  // Acciones a la derecha del título (botones, filtros, etc.).
  actions?: ReactNode;
};

// Encabezado de página compartido (título + subtítulo + acciones). Usado por todos los módulos.
export default function PageHeaderInterface({ title, subtitle, actions }: Props) {
  return (
    <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl text-brand-fg">{title}</h1>
        {subtitle ? <p className="text-sm text-ink-soft">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}
