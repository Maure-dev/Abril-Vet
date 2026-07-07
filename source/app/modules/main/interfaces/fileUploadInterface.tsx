import type { AttachmentType } from "@app/modules/main/entities/entities";
import { toAttachment } from "@app/modules/main/helpers/toAttachment";
import { isUploadConfigured, uploadFile } from "@app/modules/main/services/fileUpload";
import { useId, useState } from "react";
import IconInterface from "./iconInterface";
import { Paperclip, Trash2 } from "./icons";

type Props = {
  label: string;
  value: AttachmentType[];
  onChange: (files: AttachmentType[]) => void;
  // Carpeta en Cloudinary (ej. "patients", "studies") para organizar.
  folder?: string;
  // Tipos aceptados (ej. "image/*"). Por defecto acepta cualquiera.
  accept?: string;
  // Si es false, reemplaza (un solo archivo). Por defecto acumula.
  multiple?: boolean;
  hint?: string;
};

// Subida de archivos a Cloudinary (imágenes, PDFs, videos, audio) con estado de carga y lista
// de adjuntos. Compartido por historia clínica, estudios, cirugías y foto de paciente.
export default function FileUploadInterface({
  label,
  value,
  onChange,
  folder,
  accept,
  multiple = true,
  hint
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const id = useId();
  const configured = isUploadConfigured();

  const handleSelect = async (fileList: FileList | null): Promise<void> => {
    if (!fileList || fileList.length === 0) {
      return;
    }
    setUploading(true);
    setError("");
    try {
      const uploaded: AttachmentType[] = [];
      for (const file of Array.from(fileList)) {
        const result = await uploadFile(file, folder);
        uploaded.push(toAttachment(result));
      }
      onChange(multiple ? [...value, ...uploaded] : uploaded.slice(-1));
    } catch {
      setError("No se pudo subir el archivo. Reintentá.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (url: string): void => {
    onChange(value.filter((file) => file.url !== url));
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink">{label}</span>

      {value.length > 0 ? (
        <ul className="flex flex-col gap-1">
          {value.map((file) => (
            <li
              key={file.url}
              className="flex items-center gap-2 rounded-buttons border border-line bg-surface px-3 py-2 text-sm"
            >
              <IconInterface icon={Paperclip} size="sm" className="shrink-0 text-ink-soft" />
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 truncate text-brand-fg hover:underline"
              >
                {file.name}
              </a>
              <button
                type="button"
                aria-label={`Quitar ${file.name}`}
                onClick={() => handleRemove(file.url)}
                className="text-ink-soft hover:text-error"
              >
                <IconInterface icon={Trash2} size="sm" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {configured ? (
        <label
          htmlFor={id}
          className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-buttons border border-dashed border-line px-3 py-2 text-sm text-ink-soft transition-colors hover:border-brand hover:text-brand-fg"
        >
          <IconInterface icon={Paperclip} size="sm" />
          {uploading ? "Subiendo..." : "Adjuntar archivo"}
          <input
            id={id}
            type="file"
            accept={accept}
            multiple={multiple}
            disabled={uploading}
            onChange={(e) => handleSelect(e.target.files)}
            className="hidden"
          />
        </label>
      ) : (
        <p className="text-xs text-ink-soft">
          La subida de archivos requiere configurar Cloudinary (variables ENV_CLOUDINARY_*).
        </p>
      )}

      {hint ? <p className="text-xs text-ink-soft">{hint}</p> : null}
      {error ? (
        <p role="alert" className="text-xs text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
