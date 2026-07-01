import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router";

type Variant = "primary" | "secondary" | "ghost" | "success" | "danger";
type Size = "sm" | "md" | "lg";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  loading?: boolean;
  className?: string;
  children: ReactNode;
};

// Se puede usar como <button> (default) o como <Link> (pasando `to`).
type Props =
  | (CommonProps & { to: string; onClick?: () => void })
  | (CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { to?: undefined });

const VARIANT = {
  primary: "bg-brand text-white hover:bg-brand-hover",
  secondary: "border border-brand text-brand-fg hover:bg-brand-tint",
  ghost: "text-ink-soft hover:text-ink hover:bg-surface-muted",
  success: "bg-success text-white hover:brightness-110",
  danger: "bg-error text-white hover:brightness-110"
};

const SIZE = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base"
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-buttons font-medium transition-[background-color,color,transform,box-shadow,filter] duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100";

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
  );
}

// Botón base del sistema de diseño (con estados de carga y press, y modo enlace).
export default function ButtonInterface(props: Props) {
  const {
    variant = "primary",
    size = "md",
    block = false,
    loading = false,
    className = ""
  } = props;
  const cls = [BASE, VARIANT[variant], SIZE[size], block ? "w-full" : "", className]
    .filter(Boolean)
    .join(" ");
  const inner = (
    <>
      {loading ? <Spinner /> : null}
      {props.children}
    </>
  );

  if ("to" in props && typeof props.to === "string") {
    const { to, onClick } = props as CommonProps & { to: string; onClick?: () => void };
    return (
      <Link to={to} onClick={onClick} className={cls}>
        {inner}
      </Link>
    );
  }

  const {
    variant: _v,
    size: _s,
    block: _b,
    loading: _l,
    className: _c,
    children: _ch,
    to: _t,
    type = "button",
    disabled,
    ...rest
  } = props as CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { to?: string };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cls}
      {...rest}
    >
      {inner}
    </button>
  );
}
