import { sortAppointmentsByDate } from "@app/modules/appointments/helpers/sortAppointmentsByDate";
import { buildAppointment } from "@app/modules/appointments/tests/factories";
import { describe, expect, it } from "vitest";

const later = buildAppointment({ id: "later", date: "2026-07-10T15:00" });
const earlier = buildAppointment({ id: "earlier", date: "2026-07-10T09:00" });
const middle = buildAppointment({ id: "middle", date: "2026-07-10T12:00" });

describe("sortAppointmentsByDate", () => {
  it("ordena ascendentemente por fecha/hora", () => {
    const result = sortAppointmentsByDate([later, earlier, middle]);
    expect(result.map((a) => a.id)).toEqual(["earlier", "middle", "later"]);
  });

  it("no muta el arreglo original", () => {
    const input = [later, earlier];
    sortAppointmentsByDate(input);
    expect(input.map((a) => a.id)).toEqual(["later", "earlier"]);
  });
});
