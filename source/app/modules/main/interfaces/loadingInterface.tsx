type Props = {
  size?: "sm" | "md" | "lg";
};

const SIZE_CLASS = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12"
};

// Spinner de carga compartido.
export default function LoadingInterface({ size = "md" }: Props) {
  return (
    <div className="flex items-center justify-center p-6">
      <div
        role="status"
        aria-label="Cargando"
        className={`${SIZE_CLASS[size]} animate-spin rounded-full border-2 border-line border-t-brand`}
      />
    </div>
  );
}
