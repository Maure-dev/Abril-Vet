import { ROLE_LABELS } from "@app/modules/main/constants/constants";
import type { UserRoleType } from "@app/modules/main/entities/entities";
import { useRouter } from "@app/modules/main/hooks/useRouter";
import { useSession } from "@app/modules/main/hooks/useSession";
import type { LucideIcon } from "@app/modules/main/interfaces/icons";
import {
  BarChart3,
  Bed,
  Bell,
  Boxes,
  Calendar,
  FlaskConical,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  PawPrint,
  Receipt,
  Scissors,
  ShoppingCart,
  Stethoscope,
  Syringe,
  Truck,
  UserCog,
  Users,
  Wallet,
  X
} from "@app/modules/main/interfaces/icons";
import { Suspense, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import ErrorBoundaryInterface from "./errorBoundaryInterface";
import IconInterface from "./iconInterface";
import LoadingInterface from "./loadingInterface";
import LogoInterface from "./logoInterface";
import NotificationInterface from "./notificationInterface";
import SkipLinkInterface from "./skipLinkInterface";
import ThemeToggleInterface from "./themeToggleInterface";

type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
  roles?: UserRoleType[];
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

// Roles por área. Clínica: veterinario y asistente (+ admin). Comercial: recepcionista (+ admin).
// Clientes, pacientes y agenda los ven todos (recepción los crea/agenda; el equipo clínico los usa).
const CLINICAL: UserRoleType[] = ["admin", "vet", "assistant"];
const COMMERCIAL: UserRoleType[] = ["admin", "receptionist"];

// Mapa de navegación de la app. `roles` restringe la visibilidad del ítem (si se omite, lo ven todos).
const NAV_GROUPS: NavGroup[] = [
  {
    title: "Clínica",
    items: [
      { to: "/", label: "Panel", icon: LayoutDashboard, end: true },
      { to: "/clientes", label: "Clientes", icon: Users },
      { to: "/pacientes", label: "Pacientes", icon: PawPrint },
      { to: "/agenda", label: "Agenda", icon: Calendar },
      { to: "/historia-clinica", label: "Historia clínica", icon: Stethoscope, roles: CLINICAL },
      { to: "/vacunacion", label: "Vacunación", icon: Syringe, roles: CLINICAL },
      { to: "/recordatorios", label: "Recordatorios", icon: Bell, roles: CLINICAL },
      { to: "/estudios", label: "Estudios", icon: FlaskConical, roles: CLINICAL },
      { to: "/cirugias", label: "Cirugías", icon: Scissors, roles: CLINICAL },
      { to: "/internaciones", label: "Internaciones", icon: Bed, roles: CLINICAL }
    ]
  },
  {
    title: "Comercial",
    items: [
      { to: "/ventas", label: "Ventas (POS)", icon: ShoppingCart, roles: COMMERCIAL },
      { to: "/facturacion", label: "Facturación", icon: Receipt, roles: COMMERCIAL },
      { to: "/productos", label: "Productos", icon: Package, roles: COMMERCIAL },
      { to: "/inventario", label: "Inventario", icon: Boxes, roles: COMMERCIAL },
      { to: "/compras", label: "Compras", icon: Truck, roles: COMMERCIAL },
      { to: "/caja", label: "Caja", icon: Wallet, roles: COMMERCIAL },
      { to: "/reportes", label: "Reportes", icon: BarChart3, roles: COMMERCIAL }
    ]
  },
  {
    title: "Sistema",
    items: [{ to: "/personal", label: "Personal", icon: UserCog, roles: ["admin"] }]
  }
];

function navLinkClass({ isActive }: { isActive: boolean }): string {
  const base =
    "flex items-center gap-3 rounded-buttons px-3 py-2 text-sm font-medium transition-colors";
  return isActive
    ? `${base} bg-brand-tint text-brand-fg`
    : `${base} text-ink-soft hover:bg-surface-muted hover:text-ink`;
}

// Shell de la aplicación (sidebar + topbar) para las rutas internas protegidas.
export default function AppLayoutInterface() {
  const { pathname } = useLocation();
  const { user, roles, hasRole, logout } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Cerrar el sidebar móvil al navegar.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const groups = NAV_GROUPS.map((g) => ({
    ...g,
    items: g.items.filter((i) => !i.roles || hasRole(i.roles))
  })).filter((g) => g.items.length > 0);

  const handleLogout = async (): Promise<void> => {
    await logout();
    router.navigate("/ingresar");
  };

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <SkipLinkInterface />

      {/* Overlay del sidebar en móvil */}
      {open ? (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      ) : null}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-line bg-surface transition-transform duration-200 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-24 items-center justify-between border-b border-line px-4">
          <LogoInterface className="max-h-60" />
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
            className="text-ink-soft hover:text-ink lg:hidden"
          >
            <IconInterface icon={X} size="md" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {groups.map((group) => (
            <div key={group.title} className="mb-5">
              <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wide text-ink-soft/70">
                {group.title}
              </p>
              <ul className="flex flex-col gap-0.5">
                {group.items.map((item) => (
                  <li key={item.to}>
                    <NavLink to={item.to} end={item.end} className={navLinkClass}>
                      <IconInterface icon={item.icon} size="sm" />
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Columna principal */}
      <div className="flex min-h-screen flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex h-24 items-center gap-3 border-b border-line bg-surface/80 px-4 backdrop-blur">
          <button
            type="button"
            aria-label="Abrir menú"
            onClick={() => setOpen(true)}
            className="text-ink-soft hover:text-ink lg:hidden"
          >
            <IconInterface icon={Menu} size="md" />
          </button>
          <div className="flex-1" />
          <ThemeToggleInterface />
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium leading-tight text-ink">
                  {user.displayName || user.email}
                </p>
                <p className="text-xs leading-tight text-ink-soft">
                  {roles.map((r) => ROLE_LABELS[r]).join(" · ")}
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Cerrar sesión"
                title="Cerrar sesión"
                className="inline-flex h-9 w-9 items-center justify-center rounded-buttons border border-line bg-surface text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink"
              >
                <IconInterface icon={LogOut} size="sm" />
              </button>
            </div>
          ) : null}
        </header>

        <main id="contenido" className="flex-1 p-4 sm:p-6">
          <ErrorBoundaryInterface>
            {/* key por ruta: el contenido entra con un fade sutil al navegar */}
            <div key={pathname} className="mx-auto max-w-6xl animate-fade-in">
              {/* Suspense interno: al navegar, sólo el contenido muestra el loader; el shell persiste */}
              <Suspense fallback={<LoadingInterface />}>
                <Outlet />
              </Suspense>
            </div>
          </ErrorBoundaryInterface>
        </main>
      </div>

      <NotificationInterface />
    </div>
  );
}
