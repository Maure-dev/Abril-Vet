import { filterClients } from "@app/modules/clients/helpers/filterClients";
import { useClientsActions } from "@app/modules/clients/hooks/useClientsActions";
import ClientsDetailInterface from "@app/modules/clients/interfaces/clientsDetailInterface";
import ClientsFormInterface from "@app/modules/clients/interfaces/clientsFormInterface";
import ClientsListInterface from "@app/modules/clients/interfaces/clientsListInterface";
import { useClientsProvider } from "@app/modules/clients/states/clientsProvider";
import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { useEffect } from "react";

export default function ClientsModule() {
  const { getClientsState } = useClientsProvider();
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
  } = useClientsActions();
  const state = getClientsState;
  const visible = filterClients(state.items, state.query, state.statusFilter);

  useDocumentHead({
    title: "Clientes",
    description: "Clientes de la veterinaria y sus datos de contacto."
  });

  useEffect(() => {
    handleLoad();
  }, []);

  return (
    <section>
      <PageHeaderInterface
        title="Clientes"
        subtitle="Clientes de la veterinaria, sus datos de contacto y su cuenta corriente."
      />

      {state.mode === "detail" && state.selected ? (
        <ClientsDetailInterface
          client={state.selected}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onBack={handleCancel}
        />
      ) : null}

      {state.mode === "create" || state.mode === "edit" ? (
        <ClientsFormInterface
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
        <ClientsListInterface
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
