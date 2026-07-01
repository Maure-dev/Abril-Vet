import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import "@fontsource-variable/inter";
import "@fontsource-variable/plus-jakarta-sans";
import "./index.css";
import AppointmentsModuleProvider from "@app/modules/appointments/appointmentsModuleProvider";
import AuthModuleProvider from "@app/modules/auth/authModuleProvider";
import BillingModuleProvider from "@app/modules/billing/billingModuleProvider";
import CashRegisterModuleProvider from "@app/modules/cashRegister/cashRegisterModuleProvider";
import ClientsModuleProvider from "@app/modules/clients/clientsModuleProvider";
import DashboardModuleProvider from "@app/modules/dashboard/dashboardModuleProvider";
import HospitalizationsModuleProvider from "@app/modules/hospitalizations/hospitalizationsModuleProvider";
import InventoryModuleProvider from "@app/modules/inventory/inventoryModuleProvider";
import AppLayoutInterface from "@app/modules/main/interfaces/appLayoutInterface";
import RequireAuthInterface from "@app/modules/main/interfaces/requireAuthInterface";
import MainModuleProvider from "@app/modules/main/mainModuleProvider";
import MedicalRecordsModuleProvider from "@app/modules/medicalRecords/medicalRecordsModuleProvider";
import PatientsModuleProvider from "@app/modules/patients/patientsModuleProvider";
import ProductsModuleProvider from "@app/modules/products/productsModuleProvider";
import PurchasesModuleProvider from "@app/modules/purchases/purchasesModuleProvider";
import RemindersModuleProvider from "@app/modules/reminders/remindersModuleProvider";
import ReportsModuleProvider from "@app/modules/reports/reportsModuleProvider";
import SalesModuleProvider from "@app/modules/sales/salesModuleProvider";
import StaffModuleProvider from "@app/modules/staff/staffModuleProvider";
import StudiesModuleProvider from "@app/modules/studies/studiesModuleProvider";
import SurgeriesModuleProvider from "@app/modules/surgeries/surgeriesModuleProvider";
import VaccinationsModuleProvider from "@app/modules/vaccinations/vaccinationsModuleProvider";

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("No se encontró el elemento root");
}

ReactDOM.createRoot(rootEl).render(
  <BrowserRouter>
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
            {/* Clínica */}
            <Route path="/clientes" element={<ClientsModuleProvider />} />
            <Route path="/pacientes" element={<PatientsModuleProvider />} />
            <Route path="/agenda" element={<AppointmentsModuleProvider />} />
            <Route path="/historia-clinica" element={<MedicalRecordsModuleProvider />} />
            <Route path="/vacunacion" element={<VaccinationsModuleProvider />} />
            <Route path="/recordatorios" element={<RemindersModuleProvider />} />
            <Route path="/estudios" element={<StudiesModuleProvider />} />
            <Route path="/cirugias" element={<SurgeriesModuleProvider />} />
            <Route path="/internaciones" element={<HospitalizationsModuleProvider />} />
            {/* Comercial */}
            <Route path="/ventas" element={<SalesModuleProvider />} />
            <Route path="/facturacion" element={<BillingModuleProvider />} />
            <Route path="/productos" element={<ProductsModuleProvider />} />
            <Route path="/inventario" element={<InventoryModuleProvider />} />
            <Route path="/compras" element={<PurchasesModuleProvider />} />
            <Route path="/caja" element={<CashRegisterModuleProvider />} />
            <Route path="/reportes" element={<ReportsModuleProvider />} />
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
  </BrowserRouter>
);
