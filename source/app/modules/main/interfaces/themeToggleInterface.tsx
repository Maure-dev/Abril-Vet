import { useTheme } from "@app/modules/main/hooks/useTheme";
import { Moon, Sun } from "lucide-react";
import IconInterface from "./iconInterface";

// Botón para alternar modo claro/oscuro (usa el hook compartido useTheme).
export default function ThemeToggleInterface() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      title={isDark ? "Modo claro" : "Modo oscuro"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-buttons border border-line bg-surface text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink"
    >
      <IconInterface icon={isDark ? Sun : Moon} size="sm" />
    </button>
  );
}
