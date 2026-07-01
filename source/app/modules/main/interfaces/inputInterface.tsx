import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes
} from "react";

// Clase compartida de todos los controles de formulario (resuelve el drift de clases sueltas).
export const controlClass =
  "w-full rounded-buttons border border-line bg-surface px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-brand aria-[invalid=true]:border-error disabled:cursor-not-allowed disabled:opacity-60";

export function InputInterface({ className = "", ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${controlClass} ${className}`} {...rest} />;
}

export function TextareaInterface({
  className = "",
  rows = 4,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={rows} className={`${controlClass} ${className}`} {...rest} />;
}

export function SelectInterface({
  className = "",
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select className={`${controlClass} ${className}`} {...rest}>
      {children}
    </select>
  );
}
