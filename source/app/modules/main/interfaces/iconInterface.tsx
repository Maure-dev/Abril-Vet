import type { LucideIcon } from "lucide-react";

type Size = "sm" | "md" | "lg";

type Props = {
  icon: LucideIcon;
  size?: Size;
  className?: string;
  // Si se pasa `label`, el ícono es informativo (accesible); si no, es decorativo.
  label?: string;
};

// Tamaños en rem (Tailwind) para respetar la convención no-px del proyecto.
const SIZE = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6" };

// Wrapper de íconos (lucide): unifica tamaño, grosor de trazo y accesibilidad.
// Uso: import { PawPrint } from "lucide-react";  <IconInterface icon={PawPrint} />
export default function IconInterface({ icon: Icon, size = "md", className = "", label }: Props) {
  return (
    <Icon
      strokeWidth={1.6}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
      className={`${SIZE[size]} ${className}`}
    />
  );
}
