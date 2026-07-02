import type { ClientType } from "@app/modules/clients/entities/entities";
import { formatClientName } from "@app/modules/clients/helpers/formatClientName";
import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import CardInterface from "@app/modules/main/interfaces/cardInterface";
import { ArrowLeft } from "@app/modules/main/interfaces/icons";

type Props = {
  client: ClientType;
  onEdit: (client: ClientType) => void;
  onDelete: (client: ClientType) => void;
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

// Saldo (ARS entero) formateado en pesos argentinos. Positivo = a favor, negativo = deuda.
function formatBalance(balance: number): string {
  const formatted = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(Math.abs(balance));
  if (balance < 0) {
    return `-${formatted}`;
  }
  return formatted;
}

export default function ClientsDetailInterface({ client, onEdit, onDelete, onBack }: Props) {
  const balanceTone = client.balance < 0 ? "error" : client.balance > 0 ? "success" : "neutral";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <ButtonInterface variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
          Volver
        </ButtonInterface>
        <h2 className="font-display text-xl text-ink">{formatClientName(client)}</h2>
        {client.isActive ? (
          <BadgeInterface tone="success">Activo</BadgeInterface>
        ) : (
          <BadgeInterface tone="neutral">Inactivo</BadgeInterface>
        )}
        <div className="ml-auto flex gap-2">
          <ButtonInterface variant="secondary" size="sm" onClick={() => onEdit(client)}>
            Editar
          </ButtonInterface>
          <ButtonInterface variant="danger" size="sm" onClick={() => onDelete(client)}>
            Eliminar
          </ButtonInterface>
        </div>
      </div>

      <CardInterface>
        <h3 className="mb-4 font-display text-base text-brand-fg">Contacto</h3>
        <dl className="grid gap-4 sm:grid-cols-3">
          <Row label="Documento (DNI/CUIT)" value={client.docId} />
          <Row label="Teléfono" value={client.phone} />
          <Row label="WhatsApp" value={client.whatsapp} />
          <Row label="Email" value={client.email} />
          <Row label="Dirección" value={client.address} />
          <Row label="Ciudad" value={client.city} />
        </dl>
      </CardInterface>

      <CardInterface>
        <h3 className="mb-4 font-display text-base text-brand-fg">Cuenta corriente</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-ink-soft">Saldo</span>
          <BadgeInterface tone={balanceTone}>{formatBalance(client.balance)}</BadgeInterface>
        </div>
      </CardInterface>

      {client.notes ? (
        <CardInterface>
          <h3 className="mb-2 font-display text-base text-brand-fg">Observaciones</h3>
          <p className="whitespace-pre-line text-sm text-ink">{client.notes}</p>
        </CardInterface>
      ) : null}
    </div>
  );
}
