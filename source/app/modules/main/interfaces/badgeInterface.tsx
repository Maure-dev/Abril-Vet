import type { ReactNode } from "react";

type Tone = "neutral" | "brand" | "success" | "warning" | "error" | "info" | "gold";

type Props = {
  tone?: Tone;
  children: ReactNode;
  className?: string;
};

// Fondos tenues + texto de contraste por tono. Usado para estados (turno, stock, pago, etc.).
const TONE = {
  neutral: "bg-surface-muted text-ink-soft",
  brand: "bg-brand-tint text-brand-fg",
  success: "bg-success-tint text-success",
  warning: "bg-warning-tint text-warning",
  error: "bg-error-tint text-error",
  info: "bg-info-tint text-info",
  gold: "bg-gold/25 text-gold-fg"
};

// Pastilla de estado compartida.
export default function BadgeInterface({ tone = "neutral", children, className = "" }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${TONE[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
