import { sortRecordsByDateDesc } from "@app/modules/medicalRecords/helpers/sortRecordsByDateDesc";
import { buildMedicalRecord } from "@app/modules/medicalRecords/tests/factories";
import { describe, expect, it } from "vitest";

const older = buildMedicalRecord({ id: "1", date: "2026-01-10" });
const newer = buildMedicalRecord({ id: "2", date: "2026-06-01" });
const newest = buildMedicalRecord({ id: "3", date: "2026-12-31" });

describe("sortRecordsByDateDesc", () => {
  it("ordena por fecha descendente (más recientes primero)", () => {
    const result = sortRecordsByDateDesc([older, newest, newer]);
    expect(result.map((r) => r.id)).toEqual(["3", "2", "1"]);
  });

  it("no muta el arreglo original", () => {
    const input = [older, newest, newer];
    sortRecordsByDateDesc(input);
    expect(input.map((r) => r.id)).toEqual(["1", "3", "2"]);
  });

  it("con un solo elemento devuelve el mismo contenido", () => {
    expect(sortRecordsByDateDesc([newer])).toEqual([newer]);
  });
});
