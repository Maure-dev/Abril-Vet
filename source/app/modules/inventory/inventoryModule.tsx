import { filterMovements } from "@app/modules/inventory/helpers/filterMovements";
import { useInventoryActions } from "@app/modules/inventory/hooks/useInventoryActions";
import InventoryDetailInterface from "@app/modules/inventory/interfaces/inventoryDetailInterface";
import InventoryFormInterface from "@app/modules/inventory/interfaces/inventoryFormInterface";
import InventoryListInterface from "@app/modules/inventory/interfaces/inventoryListInterface";
import { useInventoryProvider } from "@app/modules/inventory/states/inventoryProvider";
import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { useEffect } from "react";

export default function InventoryModule() {
  const { getInventoryState } = useInventoryProvider();
  const {
    handleLoad,
    handleSearch,
    handleFilterType,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDetail,
    handleCancel,
    handleChangeField,
    handleSubmit,
    handleDelete
  } = useInventoryActions();
  const state = getInventoryState;
  const visible = filterMovements(state.items, state.query, state.typeFilter);

  useDocumentHead({
    title: "Inventario",
    description: "Control de stock: entradas, salidas, ajustes y transferencias."
  });

  useEffect(() => {
    handleLoad();
  }, []);

  return (
    <section>
      <PageHeaderInterface
        title="Inventario"
        subtitle="Movimientos de stock: entradas, salidas, ajustes y transferencias."
      />

      {state.mode === "detail" && state.selected ? (
        <InventoryDetailInterface
          movement={state.selected}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onBack={handleCancel}
        />
      ) : null}

      {state.mode === "create" || state.mode === "edit" ? (
        <InventoryFormInterface
          form={state.form}
          errors={state.errors}
          saving={state.saving}
          isEdit={state.mode === "edit"}
          onChange={handleChangeField}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : null}

      {state.mode === "list" ? (
        <InventoryListInterface
          items={visible}
          query={state.query}
          typeFilter={state.typeFilter}
          onSearch={handleSearch}
          onFilterType={handleFilterType}
          onOpenCreate={handleOpenCreate}
          onOpenDetail={handleOpenDetail}
          onOpenEdit={handleOpenEdit}
        />
      ) : null}
    </section>
  );
}
