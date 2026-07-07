import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { filterSuppliers } from "@app/modules/suppliers/helpers/filterSuppliers";
import { useSuppliersActions } from "@app/modules/suppliers/hooks/useSuppliersActions";
import SupplierDetailInterface from "@app/modules/suppliers/interfaces/supplierDetailInterface";
import SupplierFormInterface from "@app/modules/suppliers/interfaces/supplierFormInterface";
import SuppliersListInterface from "@app/modules/suppliers/interfaces/suppliersListInterface";
import { useSuppliersProvider } from "@app/modules/suppliers/states/suppliersProvider";
import { useEffect } from "react";

export default function SuppliersModule() {
  const { getSuppliersState } = useSuppliersProvider();
  const {
    handleLoad,
    handleSearch,
    handleFilterStatus,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDetail,
    handleCancel,
    handleChangeField,
    handleSubmit,
    handleDelete
  } = useSuppliersActions();
  const state = getSuppliersState;
  const visible = filterSuppliers(state.items, state.query, state.statusFilter);

  useDocumentHead({
    title: "Proveedores",
    description: "Directorio de proveedores de la veterinaria."
  });

  useEffect(() => {
    handleLoad();
  }, []);

  return (
    <section>
      <PageHeaderInterface
        title="Proveedores"
        subtitle="Directorio de proveedores y sus datos de contacto."
      />

      {state.mode === "detail" && state.selected ? (
        <SupplierDetailInterface
          supplier={state.selected}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onBack={handleCancel}
        />
      ) : null}

      {state.mode === "create" || state.mode === "edit" ? (
        <SupplierFormInterface
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
        <SuppliersListInterface
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
