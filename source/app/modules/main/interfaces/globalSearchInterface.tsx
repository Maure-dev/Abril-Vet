import type { GlobalResultType } from "@app/modules/main/entities/entities";
import { useRouter } from "@app/modules/main/hooks/useRouter";
import { PawPrint, Search, Users } from "@app/modules/main/interfaces/icons";
import { searchAll } from "@app/modules/main/services/globalSearch";
import { useEffect, useId, useRef, useState } from "react";
import IconInterface from "./iconInterface";

// Búsqueda global del topbar: escribís y saltás directo a la ficha del cliente o paciente.
export default function GlobalSearchInterface() {
  const { navigate } = useRouter();
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<GlobalResultType[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const id = useId();

  // Busca con un pequeño debounce al tipear.
  useEffect(() => {
    if (term.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    let active = true;
    const timer = setTimeout(() => {
      searchAll(term)
        .then((found) => {
          if (active) {
            setResults(found);
            setLoading(false);
          }
        })
        .catch(() => {
          if (active) {
            setResults([]);
            setLoading(false);
          }
        });
    }, 250);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [term]);

  // Cierra al clickear fuera.
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

  const go = (result: GlobalResultType): void => {
    const route = result.kind === "client" ? "/clientes" : "/pacientes";
    navigate(`${route}?id=${encodeURIComponent(result.id)}`);
    setOpen(false);
    setTerm("");
    setResults([]);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex items-center gap-2 rounded-buttons border border-line bg-surface px-3 py-2">
        <IconInterface icon={Search} size="sm" className="text-ink-soft" />
        <input
          id={id}
          type="search"
          value={term}
          onChange={(e) => {
            setTerm(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Buscar cliente o paciente..."
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft/60"
        />
      </div>

      {open && term.trim().length >= 2 ? (
        <div className="absolute z-30 mt-1 max-h-80 w-full overflow-auto rounded-buttons border border-line bg-surface shadow-soft">
          {loading ? (
            <p className="px-3 py-3 text-sm text-ink-soft">Buscando...</p>
          ) : results.length === 0 ? (
            <p className="px-3 py-3 text-sm text-ink-soft">Sin resultados</p>
          ) : (
            <ul>
              {results.map((result) => (
                <li key={`${result.kind}-${result.id}`}>
                  <button
                    type="button"
                    onClick={() => go(result)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-surface-muted"
                  >
                    <IconInterface
                      icon={result.kind === "client" ? Users : PawPrint}
                      size="sm"
                      className="shrink-0 text-ink-soft"
                    />
                    <span className="flex flex-col">
                      <span className="text-ink">{result.label}</span>
                      <span className="text-xs text-ink-soft">
                        {result.kind === "client" ? "Cliente" : "Paciente"}
                        {result.sublabel ? ` · ${result.sublabel}` : ""}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
