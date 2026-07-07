import {
  ACCOUNT_LIST_LIMIT,
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUS_TONE,
  APPOINTMENT_TYPE_LABELS,
  INVOICE_STATUS_LABELS,
  INVOICE_STATUS_TONE
} from "@app/modules/clients/constants/constants";
import type {
  ClientAccountType,
  ClientAppointmentType,
  ClientInvoiceType,
  ClientSaleType,
  ClientType
} from "@app/modules/clients/entities/entities";
import { formatClientName } from "@app/modules/clients/helpers/formatClientName";
import { formatDate } from "@app/modules/clients/helpers/formatDate";
import { formatMoney } from "@app/modules/clients/helpers/formatMoney";
import { summarizeInvoices } from "@app/modules/clients/helpers/summarizeInvoices";
import { useEntityLookup } from "@app/modules/main/hooks/useEntityLookup";
import { useSession } from "@app/modules/main/hooks/useSession";
import BadgeInterface from "@app/modules/main/interfaces/badgeInterface";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import CardInterface from "@app/modules/main/interfaces/cardInterface";
import DeleteButtonInterface from "@app/modules/main/interfaces/deleteButtonInterface";
import EntityLinkInterface from "@app/modules/main/interfaces/entityLinkInterface";
import {
  ArrowLeft,
  CalendarDays,
  PawPrint,
  Receipt,
  ShoppingCart,
  Wallet
} from "@app/modules/main/interfaces/icons";
import { useEffect } from "react";

type Props = {
  client: ClientType;
  account: ClientAccountType | null;
  accountLoading: boolean;
  onLoadAccount: (clientId: string, includeFinancial: boolean) => void;
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

// Bloque de total (facturado / pagado) del resumen financiero.
function Total({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs uppercase tracking-wide text-ink-soft">{label}</span>
      <span className="font-display text-lg text-ink">{value}</span>
    </div>
  );
}

export default function ClientsDetailInterface({
  client,
  account,
  accountLoading,
  onLoadAccount,
  onEdit,
  onDelete,
  onBack
}: Props) {
  const balanceTone = client.balance < 0 ? "error" : client.balance > 0 ? "success" : "neutral";
  const {
    options: patientOptions,
    loading: patientsLoading,
    getLabel: getPatientLabel
  } = useEntityLookup("patients");
  const pets = patientOptions.filter((p) => p.clientId === client.id);

  // Sólo el personal comercial puede ver/consultar ventas y facturas (colecciones comerciales).
  const { hasRole } = useSession();
  const canViewFinancial = hasRole(["admin", "receptionist"]);

  // Carga el estado de cuenta al abrir la ficha. Sin datos comerciales si no hay rol comercial
  // (así no se disparan queries que las reglas de Firestore rechazarían).
  useEffect(() => {
    onLoadAccount(client.id, canViewFinancial);
  }, [client.id, canViewFinancial]);

  const sales: ClientSaleType[] = account?.sales ?? [];
  const invoices: ClientInvoiceType[] = account?.invoices ?? [];
  const appointments: ClientAppointmentType[] = account?.appointments ?? [];
  const { billed, paid } = summarizeInvoices(invoices);

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
          <DeleteButtonInterface
            onConfirm={() => onDelete(client)}
            message="¿Seguro que querés eliminar este cliente? Esta acción no se puede deshacer."
          />
        </div>
      </div>

      <CardInterface>
        <h3 className="mb-4 font-display text-base text-brand-fg">Contacto</h3>
        <dl className="grid gap-4 sm:grid-cols-3">
          <Row label="Documento (DNI/CUIT)" value={client.docId} />
          <Row label="Teléfono" value={client.phone} />
          <Row label="Email" value={client.email} />
          <Row label="Dirección" value={client.address} />
          <Row label="Ciudad" value={client.city} />
        </dl>
      </CardInterface>

      <CardInterface>
        <h3 className="mb-4 font-display text-base text-brand-fg">Mascotas</h3>
        {patientsLoading ? (
          <p className="text-sm text-ink-soft">Cargando…</p>
        ) : pets.length === 0 ? (
          <p className="text-sm text-ink-soft">Este cliente no tiene mascotas registradas.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {pets.map((pet) => (
              <li key={pet.id} className="flex items-center gap-2">
                <PawPrint className="h-4 w-4 text-brand-fg" strokeWidth={1.6} aria-hidden="true" />
                <EntityLinkInterface kind="patients" id={pet.id} label={pet.label} />
              </li>
            ))}
          </ul>
        )}
      </CardInterface>

      {/* Estado de cuenta financiero: sólo visible para personal comercial. */}
      {canViewFinancial ? (
        <CardInterface>
          <h3 className="mb-4 flex items-center gap-2 font-display text-base text-brand-fg">
            <Wallet className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
            Estado de cuenta
          </h3>

          <div className="mb-5 flex flex-wrap items-end gap-6">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs uppercase tracking-wide text-ink-soft">Saldo</span>
              <BadgeInterface tone={balanceTone} className="text-sm">
                {formatMoney(client.balance)}
              </BadgeInterface>
            </div>
            <Total label="Total facturado" value={formatMoney(billed)} />
            <Total label="Total pagado" value={formatMoney(paid)} />
          </div>

          {accountLoading ? (
            <p className="text-sm text-ink-soft">Cargando estado de cuenta…</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-ink">
                  <ShoppingCart
                    className="h-4 w-4 text-brand-fg"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                  Últimas compras
                </h4>
                {sales.length === 0 ? (
                  <p className="text-sm text-ink-soft">Sin ventas registradas.</p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {sales.slice(0, ACCOUNT_LIST_LIMIT).map((sale) => (
                      <li key={sale.id} className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-ink-soft">{formatDate(sale.date)}</span>
                        <span className="text-ink">{formatMoney(sale.total)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-ink">
                  <Receipt className="h-4 w-4 text-brand-fg" strokeWidth={1.6} aria-hidden="true" />
                  Últimas facturas
                </h4>
                {invoices.length === 0 ? (
                  <p className="text-sm text-ink-soft">Sin facturas registradas.</p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {invoices.slice(0, ACCOUNT_LIST_LIMIT).map((invoice) => (
                      <li
                        key={invoice.id}
                        className="flex items-center justify-between gap-3 text-sm"
                      >
                        <span className="text-ink-soft">{formatDate(invoice.date)}</span>
                        <span className="flex items-center gap-2">
                          <BadgeInterface tone={INVOICE_STATUS_TONE[invoice.status]}>
                            {INVOICE_STATUS_LABELS[invoice.status]}
                          </BadgeInterface>
                          <span className="text-ink">{formatMoney(invoice.total)}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </CardInterface>
      ) : null}

      <CardInterface>
        <h3 className="mb-4 flex items-center gap-2 font-display text-base text-brand-fg">
          <CalendarDays className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
          Últimas visitas
        </h3>
        {accountLoading ? (
          <p className="text-sm text-ink-soft">Cargando…</p>
        ) : appointments.length === 0 ? (
          <p className="text-sm text-ink-soft">Este cliente no tiene turnos registrados.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {appointments.slice(0, ACCOUNT_LIST_LIMIT).map((appointment) => (
              <li key={appointment.id} className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-ink-soft">{formatDate(appointment.date)}</span>
                <EntityLinkInterface
                  kind="patients"
                  id={appointment.patientId}
                  label={getPatientLabel(appointment.patientId)}
                />
                <span className="text-ink">{APPOINTMENT_TYPE_LABELS[appointment.type]}</span>
                <BadgeInterface tone={APPOINTMENT_STATUS_TONE[appointment.status]}>
                  {APPOINTMENT_STATUS_LABELS[appointment.status]}
                </BadgeInterface>
                {appointment.reason ? (
                  <span className="text-ink-soft">— {appointment.reason}</span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
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
