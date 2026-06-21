import { describe, expect, it } from "vitest";
import {
  computeDaysAlive,
  computeDaysUntilNewYear,
  computeDaysUntilWeekend,
  computeLoveDuration,
  computeSleepBestTime,
} from "./timeDateFunRich";

describe("timeDateFunRich", () => {
  it("counts days until weekend from Wednesday", () => {
    const r = computeDaysUntilWeekend("2024-06-12");
    if (!("error" in r)) expect(r.primary).toMatch(/\d+ day/);
  });

  it("counts days until new year", () => {
    const r = computeDaysUntilNewYear("2024-12-01");
    if (!("error" in r)) expect(r.primary).toMatch(/\d+ days/);
  });

  it("counts days alive", () => {
    const r = computeDaysAlive("1990-06-15", "2024-06-15");
    if (!("error" in r)) expect(Number(r.primary.replace(/,/g, ""))).toBeGreaterThan(10000);
  });

  it("suggests sleep times from wake time", () => {
    const r = computeSleepBestTime("07:00", true, 3);
    if (!("error" in r)) expect(r.rows?.length).toBe(3);
  });

  it("computes love duration", () => {
    const r = computeLoveDuration("2020-02-14", "2024-06-20");
    if (!("error" in r)) expect(r.primary).toContain("y");
  });
});
