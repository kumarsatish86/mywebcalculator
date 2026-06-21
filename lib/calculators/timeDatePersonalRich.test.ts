import { describe, expect, it } from "vitest";
import {
  computeAnniversary,
  computeBabyAge,
  computeExactAge,
  computeLifePathNumber,
  computeOvulation,
  computePregnancyDueDate,
  computeZodiacSign,
} from "./timeDatePersonalRich";

describe("timeDatePersonalRich", () => {
  it("computes exact age with seconds", () => {
    const r = computeExactAge("1990-06-15", "08:30", "2026-06-20", "12:00");
    expect("error" in r).toBe(false);
    if (!("error" in r)) expect(r.primary).toContain("y");
  });

  it("finds zodiac sign", () => {
    const r = computeZodiacSign("1995-08-21");
    if (!("error" in r)) expect(r.primary).toBe("Leo");
  });

  it("calculates life path number", () => {
    const r = computeLifePathNumber("1990-06-15");
    if (!("error" in r)) expect(r.primary).toMatch(/^\d+$/);
  });

  it("estimates pregnancy due date", () => {
    const r = computePregnancyDueDate("2024-01-01", 28, "2024-06-01");
    if (!("error" in r)) expect(r.rows?.[0]?.value).toContain("w");
  });

  it("estimates ovulation window", () => {
    const r = computeOvulation("2024-06-01", 28);
    if (!("error" in r)) expect(r.primaryLabel).toContain("28-day");
  });

  it("shows baby age in weeks", () => {
    const r = computeBabyAge("2024-01-01", "2024-02-15");
    if (!("error" in r)) expect(r.primary).toMatch(/\d+w/);
  });

  it("counts anniversary years", () => {
    const r = computeAnniversary("2020-06-15", "2026-06-20");
    if (!("error" in r)) expect(r.primary).toContain("years");
  });
});
