import { useNotification } from "@app/modules/main/hooks/useNotification";
import { EMPTY_FORM, METRIC_ORDER } from "@app/modules/reports/constants/constants";
import type {
  MetricKeyType,
  MetricToneType,
  ReportMetricType,
  ReportsFormType
} from "@app/modules/reports/entities/entities";
import {
  buildMetrics,
  formFromMetric,
  toMetricInput
} from "@app/modules/reports/helpers/reportMappers";
import { validateReportsForm } from "@app/modules/reports/helpers/validateReportsForm";
import {
  createReport,
  deleteReport,
  fetchMetricCount,
  updateReport
} from "@app/modules/reports/services/services";
import { useReportsProvider } from "@app/modules/reports/states/reportsProvider";

export const useReportsActions = () => {
  const { getReportsState, setReportsState } = useReportsProvider();
  const { onNotification } = useNotification();

  // Carga las métricas contando cada colección. Si Firestore no está disponible o falla,
  // deja las métricas en 0 y no rompe la vista (dashboard tolerante a fallos).
  const handleLoad = async (): Promise<void> => {
    setReportsState((s) => ({ ...s, loading: true }));
    try {
      const counts: Partial<Record<MetricKeyType, number>> = {};
      for (const key of METRIC_ORDER) {
        counts[key] = await fetchMetricCount(key);
      }
      setReportsState((s) => ({ ...s, metrics: buildMetrics(counts), loading: false }));
    } catch {
      onNotification(false, "No se pudieron cargar las métricas. Se muestran en 0.");
      setReportsState((s) => ({ ...s, metrics: buildMetrics({}), loading: false }));
    }
  };

  const handleSearch = (query: string): void => {
    setReportsState((s) => ({ ...s, query: query }));
  };

  const handleFilterTone = (toneFilter: MetricToneType | "all"): void => {
    setReportsState((s) => ({ ...s, toneFilter: toneFilter }));
  };

  // Abre el formulario de alta de un reporte guardado.
  const handleOpenCreate = (): void => {
    setReportsState((s) => ({
      ...s,
      mode: "create",
      selected: null,
      form: EMPTY_FORM,
      errors: {}
    }));
  };

  // Abre el formulario de edición cargado con la métrica seleccionada.
  const handleOpenEdit = (metric: ReportMetricType): void => {
    setReportsState((s) => ({
      ...s,
      mode: "edit",
      selected: metric,
      form: formFromMetric(metric),
      errors: {}
    }));
  };

  // Abre la ficha (detalle) de la métrica.
  const handleOpenDetail = (metric: ReportMetricType): void => {
    setReportsState((s) => ({ ...s, mode: "detail", selected: metric }));
  };

  // Vuelve a la lista.
  const handleCancel = (): void => {
    setReportsState((s) => ({ ...s, mode: "list", selected: null, errors: {} }));
  };

  const handleChangeField = <K extends keyof ReportsFormType>(
    field: K,
    value: ReportsFormType[K]
  ): void => {
    setReportsState((s) => ({
      ...s,
      form: { ...s.form, [field]: value },
      errors: { ...s.errors, [field]: undefined }
    }));
  };

  // Alta o edición del reporte guardado según el modo.
  const handleSubmit = async (): Promise<void> => {
    const { form, mode, selected } = getReportsState;
    const errors = validateReportsForm(form);
    if (Object.keys(errors).length > 0) {
      setReportsState((s) => ({ ...s, errors: errors }));
      return;
    }
    setReportsState((s) => ({ ...s, saving: true }));
    try {
      if (mode === "edit" && selected) {
        await updateReport(selected.key, toMetricInput(form));
        onNotification(true, "Reporte actualizado.");
      } else {
        await createReport(toMetricInput(form));
        onNotification(true, "Reporte creado.");
      }
      setReportsState((s) => ({ ...s, saving: false, mode: "list", selected: null }));
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo guardar el reporte. Probá de nuevo.");
      setReportsState((s) => ({ ...s, saving: false }));
    }
  };

  // Baja de un reporte guardado.
  const handleDelete = async (metric: ReportMetricType): Promise<void> => {
    try {
      await deleteReport(metric.key);
      onNotification(true, "Reporte eliminado.");
      setReportsState((s) => ({ ...s, mode: "list", selected: null }));
      await handleLoad();
    } catch {
      onNotification(false, "No se pudo eliminar el reporte.");
    }
  };

  return {
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
  };
};
