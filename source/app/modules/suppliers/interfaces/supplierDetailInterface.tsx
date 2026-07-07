import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import CardInterface from "@app/modules/main/interfaces/cardInterface";
import DeleteButtonInterface from "@app/modules/main/interfaces/deleteButtonInterface";
import type { SupplierType } from "@app/modules/suppliers/entities/entities";

type Props = {
  supplier: SupplierType;
  onEdit: (supplier: SupplierType) => void;
  onDelete: (supplier: SupplierType) => void;
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

export default function SupplierDetailInterface({ supplier, onEdit, onDelete, onBack }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <ButtonInterface variant="ghost" size="sm" onClick={onBack}>
          ← Volver
        </ButtonInterface>
        <h2 className="font-display text-xl text-ink">{supplier.name}</h2>
        <BadgeInterface tone={supplier.isActive ? "success" : "neutral"}>
          {supplier.isActive ? "Activo" : "Inactivo"}
        </BadgeInterface>
        <div className="ml-auto flex gap-2">
          <ButtonInterface variant="secondary" size="sm" onClick={() => onEdit(supplier)}>
            Editar
          </ButtonInterface>
          <DeleteButtonInterface
            onConfirm={() => onDelete(supplier)}
            message="¿Seguro que querés eliminar este proveedor? Esta acción no se puede deshacer."
          />
        </div>
      </div>

      <CardInterface>
        <h3 className="mb-4 font-display text-base text-brand-fg">Datos de contacto</h3>
        <dl className="grid gap-4 sm:grid-cols-3">
          <Row label="Persona de contacto" value={supplier.contactName} />
          <Row label="Email" value={supplier.email} />
          <Row label="Teléfono" value={supplier.phone} />
          <Row label="CUIT" value={supplier.cuit} />
          <Row label="Dirección" value={supplier.address} />
          <Row label="Estado" value={supplier.isActive ? "Activo" : "Inactivo"} />
        </dl>
      </CardInterface>

      {supplier.notes ? (
        <CardInterface>
          <h3 className="mb-2 font-display text-base text-brand-fg">Observaciones</h3>
          <p className="whitespace-pre-line text-sm text-ink">{supplier.notes}</p>
        </CardInterface>
      ) : null}
    </div>
  );
}
