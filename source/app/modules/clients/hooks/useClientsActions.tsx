import { EMPTY_FORM } from "@app/modules/clients/constants/constants";
import type {
  ClientFormType,
  ClientType,
  StatusFilterType
} from "@app/modules/clients/entities/entities";
import { formFromClient, toClientInput } from "@app/modules/clients/helpers/clientMappers";
import { validateClientForm } from "@app/modules/clients/helpers/validateClientForm";
import {
  createClient,
  deleteClient,
  fetchClients,
  updateClient
} from "@app/modules/clients/services/services";
import { useClientsProvider } from "@app/modules/clients/states/clientsProvider";
import { useNotification } from "@app/modules/main/hooks/useNotification";

export const useClientsActions = () => {
  const { getClientsState, setClientsState } = useClientsProvider();
  const { onNotification } = useNotification();

  // Carga inicial de clientes.
  const handleLoad = async (): Promise<void> => {
    setClientsState((s) => ({ ...s, loading: true }));
    try {
      const items = await fetchClients();
      setClientsState((s) => ({ ...s, items: items, loading: false }));
    } catch {
      onNotification(false, "No se pudieron cargar los clientes.");
      setClientsState((s) => ({ ...s, loading: false }));
    }
  };

  const handleSearch = (query: string): void => {
    setClientsState((s) => ({ ...s, query: query }));
  };

  const handleFilterStatus = (statusFilter: StatusFilterType): void => {
    setClientsState((s) => ({ ...s, statusFilter: statusFilter }));
  };

  // Abre el formulario de alta.
  const handleOpenCreate = (): void => {
    setClientsState((s) => ({
      ...s,
      mode: "create",
      selected: null,
      form: EMPTY_FORM,
      errors: {}
    }));
  };

  // Abre el formulario de edición cargado con el cliente.
  const handleOpenEdit = (client: ClientType): void => {
    setClientsState((s) => ({
      ...s,
      mode: "edit",
      selected: client,
      form: formFromClient(client),
      errors: {}
    }));
  };

  // Abre la ficha (detalle) del cliente.
  const handleOpenDetail = (client: ClientType): void => {
    setClientsState((s) => ({ ...s, mode: "detail", selected: client }));
  };

  // Vuelve a la lista.
  const handleCancel = (): void => {
    setClientsState((s) => ({ ...s, mode: "list", selected: null, errors: {} }));
  };

  const handleChangeField = <K extends keyof ClientFormType>(
    field: K,
    value: ClientFormType[K]
  ): void => {
    setClientsState((s) => ({
      ...s,
      form: { ...s.form, [field]: value },
      errors: { ...s.errors, [field]: undefined }
    }));
  };

  // Alta o edición según el modo.
  const handleSubmit = async (): Promise<void> => {
    const { form, mode, selected } = getClientsState;
    const errors = validateClientForm(form);
    if (Object.keys(errors).length > 0) {
      setClientsState((s) => ({ ...s, errors: errors }));
      return;
    }
    setClientsState((s) => ({ ...s, saving: true }));
    try {
      if (mode === "edit" && selected) {
        await updateClient(selected.id, toClientInput(form));
        onNotification(true, "Cliente actualizado.");
      } else {
        await createClient(toClientInput(form));
        onNotification(true, "Cliente creado.");
      }
      setClientsState((s) => ({ ...s, saving: false, mode: "list", selected: null }));
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo guardar el cliente. Probá de nuevo.");
      setClientsState((s) => ({ ...s, saving: false }));
    }
  };

  // Baja de un cliente.
  const handleDelete = async (client: ClientType): Promise<void> => {
    try {
      await deleteClient(client.id);
      onNotification(true, "Cliente eliminado.");
      setClientsState((s) => ({ ...s, mode: "list", selected: null }));
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo eliminar el cliente.");
    }
  };

  return {
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
  };
};
