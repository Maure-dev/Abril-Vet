import { cloneElement, type ReactElement, useId } from "react";

type Props = {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  // Un único control (Input/Textarea/Select). Field le inyecta id + aria de validación.
  children: ReactElement<Record<string, unknown>>;
};

// Campo de formulario accesible: asocia label ↔ control y anuncia el error (role="alert").
export default function FieldInterface({ label, error, hint, required, children }: Props) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;

  const control = cloneElement(children, {
    id: id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy
  });

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {required ? <span className="text-brand-fg"> *</span> : null}
      </label>
      {control}
      {hint && !error ? (
        <p id={hintId} className="text-xs text-ink-soft">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
