import { mockAxios } from "@app/modules/main/tests/mockAxios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("axios", () => ({ default: mockAxios }));

import { isUploadConfigured, uploadFile } from "@app/modules/main/services/fileUpload";

beforeEach(() => {
  vi.clearAllMocks();
  // Por defecto, "no configurado" (independiente del .env real del entorno).
  vi.stubEnv("ENV_CLOUDINARY_CLOUD_NAME", "");
  vi.stubEnv("ENV_CLOUDINARY_UPLOAD_PRESET", "");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("fileUpload", () => {
  it("no está configurado si faltan las variables de Cloudinary", () => {
    expect(isUploadConfigured()).toBe(false);
  });

  it("lanza 'upload-unavailable' si no está configurado", async () => {
    await expect(uploadFile(new File(["x"], "foto.png"))).rejects.toThrow("upload-unavailable");
    expect(mockAxios.post).not.toHaveBeenCalled();
  });

  it("sube a Cloudinary y mapea la respuesta", async () => {
    vi.stubEnv("ENV_CLOUDINARY_CLOUD_NAME", "demo");
    vi.stubEnv("ENV_CLOUDINARY_UPLOAD_PRESET", "unsigned");
    mockAxios.post.mockResolvedValue({
      data: {
        secure_url: "https://res.cloudinary.com/demo/image/upload/foto.png",
        public_id: "patients/foto",
        format: "png",
        bytes: 1024,
        resource_type: "image",
        original_filename: "foto"
      }
    });

    const result = await uploadFile(new File(["x"], "foto.png"), "patients");

    expect(isUploadConfigured()).toBe(true);
    expect(mockAxios.post).toHaveBeenCalledTimes(1);
    expect(result.url).toBe("https://res.cloudinary.com/demo/image/upload/foto.png");
    expect(result.publicId).toBe("patients/foto");
    expect(result.format).toBe("png");
  });
});
