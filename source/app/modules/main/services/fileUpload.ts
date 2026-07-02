import type { UploadedFileType } from "@app/modules/main/entities/entities";
import axios from "axios";

// Subida de archivos a Cloudinary (tier gratuito), reemplazo de Firebase Storage (que exige Blaze).
// Usa un "unsigned upload preset": la subida va directo desde el navegador, sin backend ni secretos.
// Configuración: Cloudinary Console → Settings → Upload → Add upload preset (Signing Mode: Unsigned).
// El endpoint /auto/upload acepta imágenes y archivos (PDF, resultados de laboratorio, etc.).

// Respuesta relevante de la API de Cloudinary (snake_case, como la devuelve el servicio).
type CloudinaryResponseType = {
  secure_url: string;
  public_id: string;
  format: string;
  bytes: number;
  resource_type: string;
  original_filename: string;
};

// ¿Están las variables de entorno de Cloudinary configuradas?
export function isUploadConfigured(): boolean {
  return Boolean(
    import.meta.env.ENV_CLOUDINARY_CLOUD_NAME && import.meta.env.ENV_CLOUDINARY_UPLOAD_PRESET
  );
}

// Sube un archivo y devuelve sus datos. Lanza si no está configurado (el hook captura y notifica).
// `folder` organiza los archivos en Cloudinary (por ejemplo "patients", "studies").
export async function uploadFile(file: File, folder?: string): Promise<UploadedFileType> {
  const cloudName = import.meta.env.ENV_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.ENV_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !uploadPreset) {
    throw new Error("upload-unavailable");
  }

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", uploadPreset);
  if (folder) {
    form.append("folder", folder);
  }

  const response = await axios.post<CloudinaryResponseType>(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    form
  );
  const data = response.data;

  return {
    url: data.secure_url,
    publicId: data.public_id,
    format: data.format,
    bytes: data.bytes,
    resourceType: data.resource_type,
    name: data.original_filename
  };
}
