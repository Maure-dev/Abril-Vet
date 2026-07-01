import { PawPrint } from "lucide-react";
import { Link } from "react-router";
import IconInterface from "./iconInterface";

type Props = {
  // En sidebars colapsados se puede ocultar el texto y dejar sólo el ícono.
  compact?: boolean;
  className?: string;
};

// Marca de Abril Vet (ícono + wordmark). Enlaza al inicio.
export default function LogoInterface({ compact = false, className = "" }: Props) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2 ${className}`}>
      <span className="grid h-9 w-9 place-items-center rounded-buttons bg-brand text-white">
        <IconInterface icon={PawPrint} size="md" label="Abril Vet" />
      </span>
      {!compact ? (
        <span className="font-display text-lg font-semibold leading-none text-ink">
          Abril <span className="text-brand-fg">Vet</span>
        </span>
      ) : null}
    </Link>
  );
}
