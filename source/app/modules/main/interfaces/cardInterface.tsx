import type { HTMLAttributes, ReactNode } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

// Contenedor base (panel/tarjeta) del sistema de diseño.
export default function CardInterface({ children, className = "", ...rest }: Props) {
  return (
    <div
      className={`rounded-card border border-line bg-surface p-5 shadow-card ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
