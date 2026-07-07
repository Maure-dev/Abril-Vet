type OptionType = { value: string; label: string };

type Props = {
  value: string;
  options: OptionType[];
  onChange: (value: string) => void;
  ariaLabel?: string;
};

// Combo compacto para cambiar un estado en el acto (sin entrar a editar). Frena la propagación
// para poder usarse dentro de filas clickeables. Reutilizable por cualquier módulo con estado.
export default function StatusSelectInterface({ value, options, onChange, ariaLabel }: Props) {
  return (
    <select
      aria-label={ariaLabel ?? "Cambiar estado"}
      value={value}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => {
        e.stopPropagation();
        onChange(e.target.value);
      }}
      className="rounded-buttons border border-line bg-surface px-2 py-1 text-xs font-medium text-ink transition-colors hover:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
