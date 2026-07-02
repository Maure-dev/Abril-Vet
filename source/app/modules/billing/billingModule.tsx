import { filterInvoices } from "@app/modules/billing/helpers/filterInvoices";
import { useBillingActions } from "@app/modules/billing/hooks/useBillingActions";
import BillingDetailInterface from "@app/modules/billing/interfaces/billingDetailInterface";
import BillingFormInterface from "@app/modules/billing/interfaces/billingFormInterface";
import BillingListInterface from "@app/modules/billing/interfaces/billingListInterface";
import { useBillingProvider } from "@app/modules/billing/states/billingProvider";
import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { useEffect } from "react";

export default function BillingModule() {
  const { getBillingState } = useBillingProvider();
  const {
    handleLoad,
    handleSearch,
    handleFilterStatus,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDetail,
    handleCancel,
    handleChangeField,
    handleChangeItem,
    handleAddItem,
    handleRemoveItem,
    handleSubmit,
    handleDelete
  } = useBillingActions();
  const state = getBillingState;
  const visible = filterInvoices(state.items, state.query, state.statusFilter);

  useDocumentHead({
    title: "Facturación",
    description: "Facturación de consultas, servicios y productos."
  });

  useEffect(() => {
    handleLoad();
  }, []);

  return (
    <section>
      <PageHeaderInterface
        title="Facturación"
        subtitle="Facturación de consultas, servicios y productos, con medios de pago y estado de cuenta."
      />

      {state.mode === "detail" && state.selected ? (
        <BillingDetailInterface
          invoice={state.selected}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onBack={handleCancel}
        />
      ) : null}

      {state.mode === "create" || state.mode === "edit" ? (
        <BillingFormInterface
          form={state.form}
          errors={state.errors}
          saving={state.saving}
          isEdit={state.mode === "edit"}
          onChange={handleChangeField}
          onChangeItem={handleChangeItem}
          onAddItem={handleAddItem}
          onRemoveItem={handleRemoveItem}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : null}

      {state.mode === "list" ? (
        <BillingListInterface
          items={visible}
          query={state.query}
          statusFilter={state.statusFilter}
          onSearch={handleSearch}
          onFilterStatus={handleFilterStatus}
          onOpenCreate={handleOpenCreate}
          onOpenDetail={handleOpenDetail}
          onOpenEdit={handleOpenEdit}
        />
      ) : null}
    </section>
  );
}
