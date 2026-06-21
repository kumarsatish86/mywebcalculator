import { describe, expect, it } from "vitest";
import { gregorianToJulianDay, parseUnixTimestamp } from "./timeDateSpecializedCore";
import {
  computeCronSchedule,
  computeIndianPanchang,
  computeIsoDate,
  computeJulianDate,
  computeLogTimestamp,
  computeLunarCalendar,
  computeTimeFormat12h24h,
  computeUnixTimestamp,
} from "./timeDateSpecializedRich";

describe("timeDateSpecializedRich", () => {
  it("computes panchang", () => {
    const r = computeIndianPanchang("2024-06-15");
    if (!("error" in r)) expect(r.primary).toMatch(/Tithi/);
  });

  it("converts to julian day", () => {
    const r = computeJulianDate("2024-01-01", "");
    if (!("error" in r)) expect(Number(r.primary)).toBeGreaterThan(2400000);
    expect(gregorianToJulianDay(2024, 1, 1)).toBeGreaterThan(2400000);
  });

  it("shows lunar phase", () => {
    const r = computeLunarCalendar("2024-06-15");
    if (!("error" in r)) expect(r.primaryLabel).toContain("Lunar day");
  });

  it("parses unix timestamp", () => {
    const d = parseUnixTimestamp("1718448600");
    expect("error" in d).toBe(false);
    const r = computeUnixTimestamp("1718448600", "", "");
    if (!("error" in r)) expect(r.breakdown?.some((b) => b.label === "Seconds")).toBe(true);
  });

  it("generates iso from date", () => {
    const r = computeIsoDate("", "2024-06-15", "10:30");
    if (!("error" in r)) expect(r.primary).toContain("T");
  });

  it("converts 12h to 24h", () => {
    const r = computeTimeFormat12h24h("2:30 PM", true);
    if (!("error" in r)) expect(r.primary).toBe("14:30");
  });

  it("lists cron runs", () => {
    const r = computeCronSchedule("0 9 * * *");
    if (!("error" in r)) expect(r.rows?.length).toBeGreaterThan(0);
  });

  it("parses log iso timestamp", () => {
    const r = computeLogTimestamp("2024-06-15T10:30:00Z", "iso");
    if (!("error" in r)) expect(r.rows?.[0]?.label).toBe("ISO UTC");
  });
});
