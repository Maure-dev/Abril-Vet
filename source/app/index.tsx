import LoadingInterface from "@app/modules/main/interfaces/loadingInterface";
import { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import "@fontsource-variable/inter";
import "@fontsource-variable/plus-jakarta-sans";
import "./index.css";
import AppLayoutInterface from "@app/modules/main/interfaces/appLayoutInterface";
import RequireAuthInterface from "@app/modules/main/interfaces/requireAuthInterface";
import MainModuleProvider from "@app/modules/main/mainModuleProvider";

// Shell (layout raíz, guard y gate) eager; cada módulo feature se carga por demanda (code-splitting):
// Vite emite un chunk por módulo, así el bundle inicial no arrastra toda la app.
const AuthModuleProvider = lazy(() => import("@app/modules/auth/authModuleProvider"));
const DashboardModuleProvider = lazy(
  () => import("@app/modules/dashboard/dashboardModuleProvider")
);
const ClientsModuleProvider = lazy(() => import("@app/modules/clients/clientsModuleProvider"));
const PatientsModuleProvider = lazy(() => import("@app/modules/patients/patientsModuleProvider"));
const AppointmentsModuleProvider = lazy(
  () => import("@app/modules/appointments/appointmentsModuleProvider")
);
const MedicalRecordsModuleProvider = lazy(
  () => import("@app/modules/medicalRecords/medicalRecordsModuleProvider")
);
const VaccinationsModuleProvider = lazy(
  () => import("@app/modules/vaccinations/vaccinationsModuleProvider")
);
const RemindersModuleProvider = lazy(
  () => import("@app/modules/reminders/remindersModuleProvider")
);
const StudiesModuleProvider = lazy(() => import("@app/modules/studies/studiesModuleProvider"));
const SurgeriesModuleProvider = lazy(
  () => import("@app/modules/surgeries/surgeriesModuleProvider")
);
const HospitalizationsModuleProvider = lazy(
  () => import("@app/modules/hospitalizations/hospitalizationsModuleProvider")
);
const SalesModuleProvider = lazy(() => import("@app/modules/sales/salesModuleProvider"));
const BillingModuleProvider = lazy(() => import("@app/modules/billing/billingModuleProvider"));
const ProductsModuleProvider = lazy(() => import("@app/modules/products/productsModuleProvider"));
const InventoryModuleProvider = lazy(
  () => import("@app/modules/inventory/inventoryModuleProvider")
);
const PurchasesModuleProvider = lazy(
  () => import("@app/modules/purchases/purchasesModuleProvider")
);
const CashRegisterModuleProvider = lazy(
  () => import("@app/modules/cashRegister/cashRegisterModuleProvider")
);
const ReportsModuleProvider = lazy(() => import("@app/modules/reports/reportsModuleProvider"));
const StaffModuleProvider = lazy(() => import("@app/modules/staff/staffModuleProvider"));
const DewormingsModuleProvider = lazy(
  () => import("@app/modules/dewormings/dewormingsModuleProvider")
);
const SuppliersModuleProvider = lazy(
  () => import("@app/modules/suppliers/suppliersModuleProvider")
);

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("No se encontró el elemento root");
}

ReactDOM.createRoot(rootEl).render(
  <BrowserRouter>
    {/* Suspense externo: cubre el login mientras se carga su chunk (el shell tiene su propio Suspense) */}
    <Suspense fallback={<LoadingInterface size="lg" />}>
      <Routes>
        {/* Layout raíz: estado global (sesión de Firebase Auth) y compuerta de arranque */}
        <Route element={<MainModuleProvider />}>
          {/* Auth público (fuera del shell interno) */}
          <Route path="/ingresar" element={<AuthModuleProvider />} />
          <Route path="/recuperar-clave" element={<AuthModuleProvider />} />

          {/* App interna: requiere sesión y monta el shell (sidebar + topbar) */}
          <Route element={<RequireAuthInterface />}>
            <Route element={<AppLayoutInterface />}>
              <Route index element={<DashboardModuleProvider />} />
              {/* Compartido (todo el personal): recepción crea/agenda, el equipo clínico los usa */}
              <Route path="/clientes" element={<ClientsModuleProvider />} />
              <Route path="/pacientes" element={<PatientsModuleProvider />} />
              <Route path="/agenda" element={<AppointmentsModuleProvider />} />
              {/* Clínica (admin, veterinario, asistente) */}
              <Route element={<RequireAuthInterface roles={["admin", "vet", "assistant"]} />}>
                <Route path="/historia-clinica" element={<MedicalRecordsModuleProvider />} />
                <Route path="/vacunacion" element={<VaccinationsModuleProvider />} />
                <Route path="/desparasitaciones" element={<DewormingsModuleProvider />} />
                <Route path="/recordatorios" element={<RemindersModuleProvider />} />
                <Route path="/estudios" element={<StudiesModuleProvider />} />
                <Route path="/cirugias" element={<SurgeriesModuleProvider />} />
                <Route path="/internaciones" element={<HospitalizationsModuleProvider />} />
              </Route>
              {/* Comercial (admin, recepcionista) */}
              <Route element={<RequireAuthInterface roles={["admin", "receptionist"]} />}>
                <Route path="/ventas" element={<SalesModuleProvider />} />
                <Route path="/facturacion" element={<BillingModuleProvider />} />
                <Route path="/productos" element={<ProductsModuleProvider />} />
                <Route path="/inventario" element={<InventoryModuleProvider />} />
                <Route path="/compras" element={<PurchasesModuleProvider />} />
                <Route path="/proveedores" element={<SuppliersModuleProvider />} />
                <Route path="/caja" element={<CashRegisterModuleProvider />} />
                <Route path="/reportes" element={<ReportsModuleProvider />} />
              </Route>
              {/* Sistema (sólo admin) */}
              <Route element={<RequireAuthInterface roles={["admin"]} />}>
                <Route path="/personal" element={<StaffModuleProvider />} />
              </Route>
            </Route>
          </Route>

          {/* Cualquier otra ruta vuelve al panel */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  </BrowserRouter>
);
