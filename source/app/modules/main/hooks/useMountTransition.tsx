import { useEffect, useState } from "react";

type TransitionState = "open" | "closed";

// Mantiene un elemento montado durante su animación de salida.
// Devuelve `mounted` (si renderizar) y `state` para usar con clases data-[state=...].
export function useMountTransition(isOpen: boolean, durationMs = 220) {
  const [mounted, setMounted] = useState(isOpen);
  const [state, setState] = useState<TransitionState>(isOpen ? "open" : "closed");

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // Siguiente frame: pasar a "open" para que la transición de entrada se dispare.
      const raf = requestAnimationFrame(() => setState("open"));
      return () => cancelAnimationFrame(raf);
    }
    setState("closed");
    const timer = setTimeout(() => setMounted(false), durationMs);
    return () => clearTimeout(timer);
  }, [isOpen, durationMs]);

  return { mounted: mounted, state: state };
}
