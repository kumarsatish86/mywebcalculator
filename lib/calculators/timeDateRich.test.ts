import { describe, expect, it } from "vitest";
import { diffDays, isLeapYear, parseLocalDate } from "./timeDateCore";
import {
  computeAge,
  computeDaysBetween,
  computeLeapYear,
  computeMinutesToHours,
  computeNextBirthday,
  computeTimeDifference,
  computeWeeksBetween,
} from "./timeDateRich";

describe("timeDateRich", () => {
  it("computes age parts", () => {
    const r = computeAge("1990-06-15", "2026-06-20");
    expect("error" in r).toBe(false);
    if (!("error" in r)) expect(r.primary).toContain("y");
  });

  it("counts days between", () => {
    const a = parseLocalDate("2024-01-01")!;
    const b = parseLocalDate("2024-01-11")!;
    expect(diffDays(a, b)).toBe(10);
    const r = computeDaysBetween("2024-01-01", "2024-01-11");
    if (!("error" in r)) expect(r.primary).toBe("10");
  });

  it("computes weeks with remainder", () => {
    const r = computeWeeksBetween("2024-01-01", "2024-01-15");
    if (!("error" in r)) expect(r.primary).toBe("2 weeks");
  });

  it("diffs clock times", () => {
    const r = computeTimeDifference("09:00", "17:30");
    if (!("error" in r)) expect(r.primary).toContain("8h");
  });

  it("converts minutes to hours", () => {
    const r = computeMinutesToHours(150);
    if (!("error" in r)) expect(r.primary).toContain("2h");
  });

  it("detects leap years", () => {
    expect(isLeapYear(2024)).toBe(true);
    const r = computeLeapYear(2024);
    if (!("error" in r)) expect(r.primary).toBe("Leap year");
  });

  it("finds next birthday", () => {
    const r = computeNextBirthday("1995-08-21");
    if (!("error" in r)) expect(r.primary).toMatch(/\d+ days/);
  });
});
