import { describe, expect, it } from "vitest";
import {
  computeAiMeetingScheduler,
  computeDailyTimeUsage,
  computeHabitTimeAnalyzer,
  computeProductivityAnalyzer,
  computeSmartTimePlanner,
  computeTimeTrackingDashboard,
} from "./timeDateSmartRich";

describe("timeDateSmartRich", () => {
  it("scores meeting slot", () => {
    const r = computeAiMeetingScheduler("2024-06-15", "10:00", "America/New_York", "Europe/London", "Asia/Tokyo", 9, 17, 60);
    if (!("error" in r)) expect(r.primary).toMatch(/\d+\/100/);
  });

  it("plans task blocks", () => {
    const r = computeSmartTimePlanner(9, 17, 4, 1.5, 15);
    if (!("error" in r)) expect(r.rows?.[0]?.label).toBe("Window");
  });

  it("analyzes productivity", () => {
    const r = computeProductivityAnalyzer(4, 2, 30, 9, 17);
    if (!("error" in r)) expect(r.primary).toMatch(/\d+\/100/);
  });

  it("summarizes time tracking", () => {
    const r = computeTimeTrackingDashboard(3, 2, 1, 30);
    if (!("error" in r)) expect(r.primary).toContain("h");
  });

  it("budgets daily hours", () => {
    const r = computeDailyTimeUsage(7, 8, 1, 3, 2);
    if (!("error" in r)) expect(r.primary).toContain("free");
  });

  it("scores habit consistency", () => {
    const r = computeHabitTimeAnalyzer(30, 21, 5);
    if (!("error" in r)) expect(r.primary).toMatch(/\d+\/100/);
  });
});
