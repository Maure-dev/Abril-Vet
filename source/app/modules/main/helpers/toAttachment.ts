import type { AttachmentType, UploadedFileType } from "@app/modules/main/entities/entities";

// Mapea el resultado de una subida (Cloudinary) al adjunto que se guarda en Firestore.
export function toAttachment(file: UploadedFileType): AttachmentType {
  return {
    url: file.url,
    name: file.name || "archivo",
    contentType: file.resourceType || file.format || "",
    sizeBytes: file.bytes,
    uploadedAt: new Date().toISOString()
  };
}
