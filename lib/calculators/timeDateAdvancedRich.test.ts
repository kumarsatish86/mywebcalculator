import { describe, expect, it } from "vitest";
import { countWeekdaysInclusive, parseLocalDate } from "./timeDateCore";
import {
  computeAddDaysToDate,
  computeBusinessDays,
  computeTimeUntil,
  computeTimeZoneDifference,
  computeWeekNumber,
  computeWorkingDays,
} from "./timeDateAdvancedRich";

describe("timeDateAdvancedRich", () => {
  it("adds calendar days", () => {
    const r = computeAddDaysToDate("2024-01-01", 10);
    expect("error" in r).toBe(false);
    if (!("error" in r)) expect(r.primaryLabel).toContain("10");
  });

  it("counts business days in January 2024", () => {
    const a = parseLocalDate("2024-01-01")!;
    const b = parseLocalDate("2024-01-31")!;
    const { weekdays } = countWeekdaysInclusive(a, b);
    const r = computeBusinessDays("2024-01-01", "2024-01-31");
    if (!("error" in r)) expect(r.primary).toBe(`${weekdays} business days`);
  });

  it("computes working days share", () => {
    const r = computeWorkingDays("2024-01-01", "2024-01-07");
    if (!("error" in r)) expect(r.primary).toContain("working days");
  });

  it("returns ISO week number", () => {
    const r = computeWeekNumber("2024-01-15");
    if (!("error" in r)) expect(r.primary).toMatch(/^Week \d+/);
  });

  it("diffs time zones", () => {
    const r = computeTimeZoneDifference("UTC", "Asia/Kolkata", "2024-06-15");
    if (!("error" in r)) expect(r.primary).toContain("hours");
  });

  it("counts days until future date", () => {
    const r = computeTimeUntil("2026-12-31", "2026-01-01");
    if (!("error" in r)) expect(r.primary).toMatch(/\d+ days/);
  });
});
