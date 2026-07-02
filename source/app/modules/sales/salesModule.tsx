import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { filterSales } from "@app/modules/sales/helpers/filterSales";
import { useSalesActions } from "@app/modules/sales/hooks/useSalesActions";
import SalesDetailInterface from "@app/modules/sales/interfaces/salesDetailInterface";
import SalesFormInterface from "@app/modules/sales/interfaces/salesFormInterface";
import SalesListInterface from "@app/modules/sales/interfaces/salesListInterface";
import { useSalesProvider } from "@app/modules/sales/states/salesProvider";
import { useEffect } from "react";

export default function SalesModule() {
  const { getSalesState } = useSalesProvider();
  const {
    handleLoad,
    handleSearch,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDetail,
    handleCancel,
    handleChangeField,
    handleChangeDraft,
    handleAddItem,
    handleRemoveItem,
    handleSubmit,
    handleDelete
  } = useSalesActions();
  const state = getSalesState;
  const visible = filterSales(state.items, state.query);

  useDocumentHead({
    title: "Ventas (POS)",
    description: "Punto de venta integrado: productos y servicios en una sola venta."
  });

  useEffect(() => {
    handleLoad();
  }, []);

  return (
    <section>
      <PageHeaderInterface
        title="Ventas (POS)"
        subtitle="Registrá ventas de productos y servicios y consultá el historial."
      />

      {state.mode === "detail" && state.selected ? (
        <SalesDetailInterface
          sale={state.selected}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onBack={handleCancel}
        />
      ) : null}

      {state.mode === "create" || state.mode === "edit" ? (
        <SalesFormInterface
          form={state.form}
          errors={state.errors}
          saving={state.saving}
          isEdit={state.mode === "edit"}
          onChange={handleChangeField}
          onChangeDraft={handleChangeDraft}
          onAddItem={handleAddItem}
          onRemoveItem={handleRemoveItem}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : null}

      {state.mode === "list" ? (
        <SalesListInterface
          items={visible}
          query={state.query}
          onSearch={handleSearch}
          onOpenCreate={handleOpenCreate}
          onOpenDetail={handleOpenDetail}
          onOpenEdit={handleOpenEdit}
        />
      ) : null}
    </section>
  );
}
