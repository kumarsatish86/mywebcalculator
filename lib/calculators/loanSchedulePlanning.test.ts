import { describe, expect, it } from "vitest";
import {
  buildEmiSchedule,
  buildLoanTimeline,
  buildMonthlyBreakdown,
  buildPaymentCalendar,
  parseIsoDate,
  parsePaymentDay,
} from "./loanSchedulePlanning";

describe("loanSchedulePlanning", () => {
  it("builds an EMI schedule summary", () => {
    const result = buildEmiSchedule({ principal: 25000, apr: 6.5, termMonths: 60 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.rows).toHaveLength(60);
    expect(result.totalInterest).toBeGreaterThan(0);
    expect(result.emi).toBeGreaterThan(0);
  });

  it("breaks down a selected month", () => {
    const result = buildMonthlyBreakdown({
      principal: 25000,
      apr: 6.5,
      termMonths: 60,
      month: 1,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.openingBalance).toBe(25000);
    expect(result.interestSharePercent + result.principalSharePercent).toBeCloseTo(100, 5);
    expect(result.principal).toBeGreaterThan(result.interest);
  });

  it("builds loan timeline milestones", () => {
    const start = parseIsoDate("2026-01-05");
    expect("error" in start).toBe(false);
    if ("error" in start) return;
    const result = buildLoanTimeline({
      principal: 25000,
      apr: 6.5,
      termMonths: 60,
      startDate: start.date,
      paymentDay: 5,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.milestones.length).toBeGreaterThanOrEqual(5);
    expect(result.milestones[0]?.label).toBe("First EMI");
    expect(result.milestones.at(-1)?.label).toBe("Final EMI");
  });

  it("builds payment calendar entries", () => {
    const start = parseIsoDate("2026-03-10");
    expect("error" in start).toBe(false);
    if ("error" in start) return;
    const day = parsePaymentDay("10");
    expect("error" in day).toBe(false);
    if ("error" in day) return;
    const result = buildPaymentCalendar({
      principal: 25000,
      apr: 6.5,
      termMonths: 12,
      startDate: start.date,
      paymentDay: day.day,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.entries).toHaveLength(12);
    expect(result.entries[0]?.dateLabel).toContain("10 Mar 2026");
  });

  it("validates payment day", () => {
    expect("error" in parsePaymentDay("29")).toBe(true);
    expect("error" in parsePaymentDay("0")).toBe(true);
  });
});
