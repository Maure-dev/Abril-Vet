import { Component, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

// Límite de errores global. Punto de enganche para reporte (Sentry/log) más adelante.
export default class ErrorBoundaryInterface extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown): void {
    console.error("ErrorBoundary:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center gap-3 p-6 text-center">
          <h1 className="font-display text-2xl text-ink">Algo salió mal</h1>
          <p className="text-ink-soft">
            Ocurrió un error inesperado. Por favor, recargá la página.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
