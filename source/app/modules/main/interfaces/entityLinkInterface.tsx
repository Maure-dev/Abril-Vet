import type { LookupKindType } from "@app/modules/main/entities/entities";
import { useRouter } from "@app/modules/main/hooks/useRouter";

// Rutas con detalle navegable por ?id=. Clientes y pacientes (accesibles a todo el personal).
// Otras entidades (vet, producto) se muestran como texto.
const ROUTES: Partial<Record<LookupKindType, string>> = {
  clients: "/clientes",
  patients: "/pacientes"
};

type Props = {
  kind: LookupKindType;
  id: string;
  label: string;
  // Texto a mostrar si no hay etiqueta resuelta todavía.
  fallback?: string;
};

// Nombre de una entidad relacionada; si su detalle es navegable, es un link que abre esa ficha.
export default function EntityLinkInterface({ kind, id, label, fallback = "—" }: Props) {
  const { navigate } = useRouter();
  const route = ROUTES[kind];
  const text = label || fallback;

  if (!id || !route || !label) {
    return <span className="text-ink">{text}</span>;
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        navigate(`${route}?id=${encodeURIComponent(id)}`);
      }}
      className="rounded text-left font-medium text-brand-fg hover:underline"
    >
      {text}
    </button>
  );
}
