import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import EmptyStateInterface from "@app/modules/main/interfaces/emptyStateInterface";
import { Pencil, Stethoscope } from "@app/modules/main/interfaces/icons";
import { InputInterface } from "@app/modules/main/interfaces/inputInterface";
import type { MedicalRecordType } from "@app/modules/medicalRecords/entities/entities";

type Props = {
  items: MedicalRecordType[];
  query: string;
  patientFilter: string;
  onSearch: (query: string) => void;
  onFilterPatient: (patientId: string) => void;
  onOpenCreate: () => void;
  onOpenDetail: (record: MedicalRecordType) => void;
  onOpenEdit: (record: MedicalRecordType) => void;
};

export default function MedicalRecordsListInterface({
  items,
  query,
  patientFilter,
  onSearch,
  onFilterPatient,
  onOpenCreate,
  onOpenDetail,
  onOpenEdit
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <InputInterface
          type="search"
          placeholder="Buscar por motivo o diagnóstico..."
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <InputInterface
          type="text"
          placeholder="Filtrar por paciente (ID)"
          value={patientFilter}
          onChange={(e) => onFilterPatient(e.target.value)}
          className="sm:max-w-[14rem]"
        />
        <div className="sm:ml-auto">
          <ButtonInterface onClick={onOpenCreate}>Nuevo registro</ButtonInterface>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyStateInterface
          icon={Stethoscope}
          title="No hay registros para mostrar"
          description="Cargá el primer registro clínico o ajustá la búsqueda y el filtro por paciente."
          action={<ButtonInterface onClick={onOpenCreate}>Nuevo registro</ButtonInterface>}
        />
      ) : (
        <div className="overflow-x-auto rounded-card border border-line bg-surface shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-semibold">Fecha</th>
                <th className="px-4 py-3 font-semibold">Paciente</th>
                <th className="px-4 py-3 font-semibold">Motivo</th>
                <th className="px-4 py-3 font-semibold">Diagnóstico</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((record) => (
                <tr
                  key={record.id}
                  className="cursor-pointer border-b border-line/60 last:border-0 hover:bg-surface-muted"
                  onClick={() => onOpenDetail(record)}
                >
                  <td className="px-4 py-3 font-medium text-ink">{record.date || "—"}</td>
                  <td className="px-4 py-3 text-ink-soft">{record.patientId || "—"}</td>
                  <td className="px-4 py-3 text-ink-soft">{record.reason || "—"}</td>
                  <td className="px-4 py-3 text-ink-soft">{record.diagnosis || "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      aria-label={`Editar registro del ${record.date}`}
                      className="inline-flex items-center gap-1 rounded-buttons px-2 py-1 text-xs text-brand-fg hover:bg-brand-tint"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEdit(record);
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
