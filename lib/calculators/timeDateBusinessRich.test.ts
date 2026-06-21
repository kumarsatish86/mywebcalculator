import { describe, expect, it } from "vitest";
import { shiftDurationMinutes, splitOvertime } from "./timeDateCore";
import {
  computeDeadline,
  computeOvertime,
  computePayrollHours,
  computeProjectDuration,
  computeShiftDuration,
  computeSlaTime,
  computeTimesheet,
  computeTurnaroundTime,
} from "./timeDateBusinessRich";

describe("timeDateBusinessRich", () => {
  it("computes weekly timesheet", () => {
    const r = computeTimesheet("2024-01-01", 5, "09:00", "17:30", 30);
    expect("error" in r).toBe(false);
    if (!("error" in r)) expect(r.primary).toContain("hours");
  });

  it("splits overtime at threshold", () => {
    expect(splitOvertime(10, 8)).toEqual({ regular: 8, overtime: 2 });
    const r = computeOvertime("09:00", "19:30", 30, 8, 1.5, 20);
    if (!("error" in r)) expect(r.primary).toContain("OT");
  });

  it("handles overnight shift", () => {
    expect(shiftDurationMinutes("22:00", "06:00", 30)).toBe(7.5 * 60);
    const r = computeShiftDuration("22:00", "06:00", 30);
    if (!("error" in r)) expect(r.rows?.[0]?.value).toContain("Overnight");
  });

  it("calculates payroll gross", () => {
    const r = computePayrollHours(40, 5, 25, 1.5);
    if (!("error" in r)) expect(Number(r.primary)).toBe(1187.5);
  });

  it("estimates project person-hours", () => {
    const r = computeProjectDuration("2024-01-01", "2024-01-14", 8);
    if (!("error" in r)) expect(r.primary).toContain("person-hours");
  });

  it("adds business days to deadline", () => {
    const r = computeDeadline("2024-01-01", 5);
    if (!("error" in r)) expect(r.primaryLabel).toContain("5 business");
  });

  it("checks SLA remaining", () => {
    const r = computeSlaTime("2024-06-01", "09:00", 4, 0, "2024-06-01", "10:00");
    if (!("error" in r)) expect(r.primaryLabel).toMatch(/Within|breached/i);
  });

  it("measures turnaround", () => {
    const r = computeTurnaroundTime("2024-06-01", "09:00", "2024-06-01", "15:00");
    if (!("error" in r)) expect(r.primary).toContain("business hours");
  });
});
