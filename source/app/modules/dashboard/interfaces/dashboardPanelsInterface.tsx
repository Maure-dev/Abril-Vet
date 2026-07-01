import CardInterface from "@app/modules/main/interfaces/cardInterface";
import EmptyStateInterface from "@app/modules/main/interfaces/emptyStateInterface";
import { Bed, Calendar, Clock, Syringe } from "lucide-react";

const PANELS = [
  { key: "today", title: "Agenda del día", icon: Calendar },
  { key: "next", title: "Próximos turnos", icon: Clock },
  { key: "vaccines", title: "Vacunas pendientes", icon: Syringe },
  { key: "hospitalized", title: "Pacientes internados", icon: Bed }
];

// Paneles resumen del panel de inicio (placeholder hasta conectar cada dominio).
export default function DashboardPanelsInterface() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {PANELS.map((panel) => (
        <CardInterface key={panel.key}>
          <h2 className="mb-3 font-display text-base text-brand-fg">{panel.title}</h2>
          <EmptyStateInterface
            icon={panel.icon}
            title="Pendiente de datos"
            description="Se completará al conectar este módulo con la base de datos."
          />
        </CardInterface>
      ))}
    </div>
  );
}
