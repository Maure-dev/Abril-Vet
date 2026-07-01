import { useEffect } from "react";
import { useLocation } from "react-router";

// Lleva el scroll al inicio en cada cambio de ruta (las SPA no lo hacen por defecto).
export function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
}
