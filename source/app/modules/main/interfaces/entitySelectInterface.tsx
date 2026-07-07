import type { OptionType } from "@app/modules/main/entities/entities";
import { filterOptions } from "@app/modules/main/helpers/filterOptions";
import { Check, ChevronDown, Search } from "@app/modules/main/interfaces/icons";
import { useEffect, useId, useRef, useState } from "react";
import IconInterface from "./iconInterface";
import { controlClass } from "./inputInterface";

type Props = {
  label: string;
  value: string;
  onChange: (id: string) => void;
  options: OptionType[];
  loading?: boolean;
  required?: boolean;
  error?: string;
  placeholder?: string;
  // Texto cuando la colección no tiene datos cargados todavía.
  emptyHint?: string;
  // Permite dejar la selección vacía (agrega una opción para limpiarla).
  clearable?: boolean;
  clearLabel?: string;
};

// Selector de entidad relacionada: carga opciones automáticamente (vía useEntityOptions) y permite
// filtrar por texto + elegir, en vez de tipear el ID a mano. Combobox accesible y controlado.
export default function EntitySelectInterface({
  label,
  value,
  onChange,
  options,
  loading = false,
  required = false,
  error,
  placeholder = "Seleccioná una opción",
  emptyHint = "No hay opciones cargadas todavía",
  clearable = false,
  clearLabel = "Sin asignar"
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const errorId = `${id}-error`;
  const selected = options.find((option) => option.id === value) ?? null;
  const visible = filterOptions(options, query);

  // Cerrar al clickear fuera.
  useEffect(() => {
    if (!open) {
      return;
    }
    function handleDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleDown);
    return () => document.removeEventListener("mousedown", handleDown);
  }, [open]);

  const pick = (optionId: string): void => {
    onChange(optionId);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="flex flex-col gap-1.5" ref={containerRef}>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {required ? <span className="text-brand-fg"> *</span> : null}
      </label>
      <div className="relative">
        <button
          type="button"
          id={id}
          onClick={() => setOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-invalid={error ? true : undefined}
          className={`${controlClass} flex items-center justify-between gap-2 text-left`}
        >
          <span className={selected ? "truncate text-ink" : "truncate text-ink-soft/60"}>
            {loading ? "Cargando..." : selected ? selected.label : placeholder}
          </span>
          <IconInterface icon={ChevronDown} size="sm" className="shrink-0 text-ink-soft" />
        </button>

        {open ? (
          <div className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-buttons border border-line bg-surface shadow-soft">
            <div className="sticky top-0 flex items-center gap-2 border-b border-line bg-surface px-2 py-1.5">
              <IconInterface icon={Search} size="sm" className="text-ink-soft" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filtrar..."
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft/60"
              />
            </div>

            {clearable && query.trim() === "" ? (
              <button
                type="button"
                onClick={() => pick("")}
                className={`flex w-full items-center justify-between gap-2 border-b border-line px-3 py-2 text-left text-sm hover:bg-surface-muted ${
                  value === "" ? "text-brand-fg" : "text-ink-soft"
                }`}
              >
                <span>{clearLabel}</span>
                {value === "" ? <IconInterface icon={Check} size="sm" /> : null}
              </button>
            ) : null}

            {visible.length === 0 ? (
              <p className="px-3 py-3 text-sm text-ink-soft">
                {options.length === 0 ? emptyHint : "Sin coincidencias"}
              </p>
            ) : (
              <ul>
                {visible.map((option) => (
                  <li key={option.id}>
                    <button
                      type="button"
                      onClick={() => pick(option.id)}
                      className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-surface-muted ${
                        option.id === value ? "text-brand-fg" : "text-ink"
                      }`}
                    >
                      <span className="flex flex-col">
                        <span>{option.label}</span>
                        {option.sublabel ? (
                          <span className="text-xs text-ink-soft">{option.sublabel}</span>
                        ) : null}
                      </span>
                      {option.id === value ? <IconInterface icon={Check} size="sm" /> : null}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}
      </div>
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
