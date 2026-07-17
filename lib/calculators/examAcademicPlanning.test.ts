import { describe, expect, it } from "vitest";
import {
  daysToCompleteSyllabus,
  examCountdown,
  studyHours,
} from "./examAcademicPlanning";

describe("examAcademicPlanning", () => {
  it("computes study hours per day", () => {
    const r = studyHours({ chapters: 30, hoursPerChapter: 2, daysAvailable: 20 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.totalHours).toBe(60);
    expect(r.hoursPerDay).toBe(3);
    expect(r.feasible).toBe(true);
  });

  it("buffers syllabus completion days", () => {
    const r = daysToCompleteSyllabus({ topics: 120, topicsPerDay: 5, bufferPercent: 15 });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.baseDays).toBe(24);
    expect(r.bufferedDays).toBeGreaterThanOrEqual(r.baseDays);
  });

  it("counts down to exam date", () => {
    const r = examCountdown({ examDateIso: "2026-12-15", todayIso: "2026-07-17" });
    expect("error" in r).toBe(false);
    if ("error" in r) return;
    expect(r.daysLeft).toBeGreaterThan(0);
    expect(r.status).toBe("upcoming");
  });
});
