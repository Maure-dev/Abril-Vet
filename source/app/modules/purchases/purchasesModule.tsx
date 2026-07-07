import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { filterPurchases } from "@app/modules/purchases/helpers/filterPurchases";
import { usePurchasesActions } from "@app/modules/purchases/hooks/usePurchasesActions";
import PurchasesDetailInterface from "@app/modules/purchases/interfaces/purchasesDetailInterface";
import PurchasesFormInterface from "@app/modules/purchases/interfaces/purchasesFormInterface";
import PurchasesListInterface from "@app/modules/purchases/interfaces/purchasesListInterface";
import { usePurchasesProvider } from "@app/modules/purchases/states/purchasesProvider";
import { useEffect } from "react";

export default function PurchasesModule() {
  const { getPurchasesState } = usePurchasesProvider();
  const {
    handleLoad,
    handleSearch,
    handleFilterStatus,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDetail,
    handleCancel,
    handleChangeField,
    handleAddItem,
    handleRemoveItem,
    handleChangeItem,
    handleSubmit,
    handleQuickStatus,
    handleDelete
  } = usePurchasesActions();
  const state = getPurchasesState;
  const visible = filterPurchases(state.items, state.query, state.statusFilter);

  useDocumentHead({
    title: "Compras",
    description: "Órdenes de compra a proveedores y recepción de mercadería."
  });

  useEffect(() => {
    handleLoad();
  }, []);

  return (
    <section>
      <PageHeaderInterface
        title="Compras"
        subtitle="Órdenes de compra a proveedores, con ítems, costos y estado."
      />

      {state.mode === "detail" && state.selected ? (
        <PurchasesDetailInterface
          purchase={state.selected}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onBack={handleCancel}
        />
      ) : null}

      {state.mode === "create" || state.mode === "edit" ? (
        <PurchasesFormInterface
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
        <PurchasesListInterface
          items={visible}
          query={state.query}
          statusFilter={state.statusFilter}
          onSearch={handleSearch}
          onFilterStatus={handleFilterStatus}
          onOpenCreate={handleOpenCreate}
          onOpenDetail={handleOpenDetail}
          onOpenEdit={handleOpenEdit}
          onQuickStatus={handleQuickStatus}
        />
      ) : null}
    </section>
  );
}
