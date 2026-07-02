import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { filterStaff } from "@app/modules/staff/helpers/filterStaff";
import { useStaffActions } from "@app/modules/staff/hooks/useStaffActions";
import StaffDetailInterface from "@app/modules/staff/interfaces/staffDetailInterface";
import StaffFormInterface from "@app/modules/staff/interfaces/staffFormInterface";
import StaffListInterface from "@app/modules/staff/interfaces/staffListInterface";
import { useStaffProvider } from "@app/modules/staff/states/staffProvider";
import { useEffect } from "react";

export default function StaffModule() {
  const { getStaffState } = useStaffProvider();
  const {
    handleLoad,
    handleSearch,
    handleFilterRole,
    handleFilterStatus,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDetail,
    handleCancel,
    handleChangeField,
    handleSubmit,
    handleResetPassword,
    handleToggleActive,
    handleSendInvite,
    handleDelete
  } = useStaffActions();
  const state = getStaffState;
  const visible = filterStaff(state.items, state.query, state.roleFilter, state.statusFilter);

  useDocumentHead({
    title: "Personal",
    description: "Directorio del personal de la veterinaria."
  });

  useEffect(() => {
    handleLoad();
  }, []);

  return (
    <section>
      <PageHeaderInterface
        title="Personal"
        subtitle="Directorio del personal de la veterinaria: datos de contacto, rol y estado."
      />

      {state.mode === "list" ? (
        <p className="mb-4 rounded-card border border-line bg-surface-muted px-4 py-3 text-sm text-ink-soft">
          Desde acá se crea el usuario y su acceso a Firebase Auth, se cambia la contraseña y se
          habilita o deshabilita el acceso. El primer administrador se crea una única vez con el
          script scripts/setUserRole.mjs.
        </p>
      ) : null}

      {state.mode === "detail" && state.selected ? (
        <StaffDetailInterface
          staff={state.selected}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onBack={handleCancel}
          onResetPassword={handleResetPassword}
          onSendInvite={handleSendInvite}
          onToggleActive={handleToggleActive}
        />
      ) : null}

      {state.mode === "create" || state.mode === "edit" ? (
        <StaffFormInterface
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
        <StaffListInterface
          items={visible}
          query={state.query}
          roleFilter={state.roleFilter}
          statusFilter={state.statusFilter}
          onSearch={handleSearch}
          onFilterRole={handleFilterRole}
          onFilterStatus={handleFilterStatus}
          onOpenCreate={handleOpenCreate}
          onOpenDetail={handleOpenDetail}
          onOpenEdit={handleOpenEdit}
        />
      ) : null}
    </section>
  );
}
