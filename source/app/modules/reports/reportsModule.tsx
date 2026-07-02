import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import LoadingInterface from "@app/modules/main/interfaces/loadingInterface";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { filterMetrics } from "@app/modules/reports/helpers/filterMetrics";
import { useReportsActions } from "@app/modules/reports/hooks/useReportsActions";
import ReportsBarsInterface from "@app/modules/reports/interfaces/reportsBarsInterface";
import ReportsDetailInterface from "@app/modules/reports/interfaces/reportsDetailInterface";
import ReportsFormInterface from "@app/modules/reports/interfaces/reportsFormInterface";
import ReportsKpisInterface from "@app/modules/reports/interfaces/reportsKpisInterface";
import ReportsListInterface from "@app/modules/reports/interfaces/reportsListInterface";
import { useReportsProvider } from "@app/modules/reports/states/reportsProvider";
import { useEffect } from "react";

export default function ReportsModule() {
  const { getReportsState } = useReportsProvider();
  const {
    handleLoad,
    handleSearch,
    handleFilterTone,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDetail,
    handleCancel,
    handleChangeField,
    handleSubmit,
    handleDelete
  } = useReportsActions();
  const state = getReportsState;
  const visible = filterMetrics(state.metrics, state.query, state.toneFilter);

  useDocumentHead({
    title: "Reportes",
    description: "Reportes y estadísticas clínicas y comerciales."
  });

  useEffect(() => {
    handleLoad();
  }, []);

  return (
    <section>
      <PageHeaderInterface
        title="Reportes"
        subtitle="Indicadores de clientes, pacientes, turnos y ventas."
      />

      {state.mode === "detail" && state.selected ? (
        <ReportsDetailInterface
          metric={state.selected}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onBack={handleCancel}
        />
      ) : null}

      {state.mode === "create" || state.mode === "edit" ? (
        <ReportsFormInterface
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
        state.loading ? (
          <LoadingInterface />
        ) : (
          <div className="flex flex-col gap-6">
            <ReportsKpisInterface metrics={state.metrics} onOpenDetail={handleOpenDetail} />
            <ReportsBarsInterface metrics={state.metrics} />
            <ReportsListInterface
              metrics={visible}
              query={state.query}
              toneFilter={state.toneFilter}
              onSearch={handleSearch}
              onFilterTone={handleFilterTone}
              onOpenCreate={handleOpenCreate}
              onOpenDetail={handleOpenDetail}
              onOpenEdit={handleOpenEdit}
            />
          </div>
        )
      ) : null}
    </section>
  );
}
