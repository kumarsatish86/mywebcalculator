import { describe, expect, it } from "vitest";
import { computeHrPayroll, HR_PAYROLL_SLUGS } from "./hrPayroll";
import { computeHrAttendance, HR_ATTENDANCE_SLUGS } from "./hrAttendance";
import { computeHrLeave, HR_LEAVE_SLUGS } from "./hrLeave";
import { computeHrProductivity, HR_PRODUCTIVITY_SLUGS } from "./hrProductivity";
import { computeHrCost, HR_COST_SLUGS } from "./hrCost";
import { computeHrAttrition, HR_ATTRITION_SLUGS } from "./hrAttrition";
import { computeHrWorkforce, HR_WORKFORCE_SLUGS } from "./hrWorkforce";
import { computeHrCompliance, HR_COMPLIANCE_SLUGS } from "./hrCompliance";
import { computeHrBonus, HR_BONUS_SLUGS } from "./hrBonus";
import { computeHrScheduling, HR_SCHEDULING_SLUGS } from "./hrScheduling";
import { computeHrAi, HR_AI_SLUGS } from "./hrAi";

const ALL = [
  ...HR_PAYROLL_SLUGS,
  ...HR_ATTENDANCE_SLUGS,
  ...HR_LEAVE_SLUGS,
  ...HR_PRODUCTIVITY_SLUGS,
  ...HR_COST_SLUGS,
  ...HR_ATTRITION_SLUGS,
  ...HR_WORKFORCE_SLUGS,
  ...HR_COMPLIANCE_SLUGS,
  ...HR_BONUS_SLUGS,
  ...HR_SCHEDULING_SLUGS,
  ...HR_AI_SLUGS,
];

describe("hr engines smoke", () => {
  it("covers all 74 slugs", () => {
    expect(ALL.length).toBe(74);
    expect(new Set(ALL).size).toBe(74);
  });

  it("payroll section ok", () => {
    for (const slug of HR_PAYROLL_SLUGS) {
      const r = computeHrPayroll(slug, {
        annual: 1200000,
        monthly: 100000,
        hourly: 500,
        hoursPerWeek: 40,
        weeksPerYear: 52,
        gross: 100000,
        basic: 40000,
        hra: 20000,
        allowance: 40000,
        pfPct: 12,
        taxPct: 5,
        otherDeduction: 200,
        employerLoadPct: 10,
        otHours: 10,
        otMultiplier: 1.5,
        holidayDays: 2,
        dailyRate: 3000,
        pfWages: 15000,
        usePfCeiling: 1,
        esiWages: 20000,
        ptAmount: 200,
        tdsPct: 10,
        annualTax: 120000,
      });
      expect(r.ok, slug).toBe(true);
    }
  });

  it("attendance section ok", () => {
    for (const slug of HR_ATTENDANCE_SLUGS) {
      const r = computeHrAttendance(slug, {
        startHour: 9,
        endHour: 18,
        breakMinutes: 60,
        days: 5,
        hoursPerDay: 8,
        hoursMon: 8,
        hoursTue: 8,
        hoursWed: 8,
        hoursThu: 8,
        hoursFri: 8,
        hoursSat: 0,
        hoursSun: 0,
        presentDays: 20,
        workingDays: 22,
        leaveEntitled: 18,
        leaveUsed: 4,
        dailyCost: 2000,
        absentDays: 2,
        scheduledHours: 40,
        actualHours: 45,
        shiftHours: 8,
        nightPremiumPct: 10,
        idleMinutes: 30,
        productiveHours: 8,
      });
      expect(r.ok, slug).toBe(true);
    }
  });

  it("leave section ok", () => {
    for (const slug of HR_LEAVE_SLUGS) {
      const r = computeHrLeave(slug, {
        monthsWorked: 12,
        accrualPerMonth: 1.5,
        annualEntitlement: 18,
        used: 3,
        carried: 2,
        sickEntitlement: 12,
        sickUsed: 1,
        ptoAccrualRate: 0.05,
        hoursWorked: 160,
        basicPlusDa: 50000,
        leaveDays: 5,
      });
      expect(r.ok, slug).toBe(true);
    }
  });

  it("productivity section ok", () => {
    for (const slug of HR_PRODUCTIVITY_SLUGS) {
      const r = computeHrProductivity(slug, {
        output: 100,
        hours: 40,
        completed: 8,
        totalTasks: 10,
        standardOutput: 80,
        actualOutput: 90,
        teamOutput: 400,
        teamHours: 160,
        headcount: 4,
        billableHours: 140,
        availableHours: 160,
        actual: 90,
        target: 100,
        weight1: 1,
        score1: 80,
        weight2: 1,
        score2: 70,
        weight3: 1,
        score3: 90,
      });
      expect(r.ok, slug).toBe(true);
    }
  });

  it("cost section ok", () => {
    for (const slug of HR_COST_SLUGS) {
      const r = computeHrCost(slug, {
        grossMonthly: 100000,
        employerBenefitsPct: 12,
        overheadPct: 10,
        agencyFees: 50000,
        adsCost: 20000,
        recruiterCost: 30000,
        hires: 2,
        salaryAnnual: 1200000,
        replacementMultiplier: 0.5,
        openings: 3,
        daysOpen: 90,
        offersMade: 10,
        offersAccepted: 7,
        recruitSpend: 100000,
        valueHired: 500000,
        employerPf: 1800,
      });
      expect(r.ok, slug).toBe(true);
    }
  });

  it("attrition section ok", () => {
    for (const slug of HR_ATTRITION_SLUGS) {
      const r = computeHrAttrition(slug, {
        separations: 10,
        avgHeadcount: 100,
        beginningHeadcount: 100,
        endingHeadcount: 95,
        retained: 90,
        employeesOneYearPlus: 80,
        headcountYearAgo: 100,
      });
      expect(r.ok, slug).toBe(true);
    }
  });

  it("workforce section ok", () => {
    for (const slug of HR_WORKFORCE_SLUGS) {
      const r = computeHrWorkforce(slug, {
        currentHeadcount: 50,
        hires: 5,
        exits: 3,
        demandUnits: 1000,
        productivityPerFte: 50,
        attritionPct: 10,
        growthPct: 5,
        totalWorkload: 1000,
        capacityPerPerson: 40,
        teamSize: 25,
      });
      expect(r.ok, slug).toBe(true);
    }
  });

  it("compliance section ok", () => {
    for (const slug of HR_COMPLIANCE_SLUGS) {
      const r = computeHrCompliance(slug, {
        lastDrawnMonthly: 50000,
        yearsOfService: 10,
        noticeDaysRequired: 30,
        noticeDaysServed: 10,
        dailyGross: 2000,
        monthlyGross: 60000,
        severanceMonths: 2,
        leaveEncashment: 10000,
        bonusDue: 5000,
        otherDues: 2000,
        recoveries: 1000,
      });
      expect(r.ok, slug).toBe(true);
    }
  });

  it("bonus section ok", () => {
    for (const slug of HR_BONUS_SLUGS) {
      const r = computeHrBonus(slug, {
        basicPlusDa: 40000,
        bonusPct: 8.33,
        targetBonus: 50000,
        achievementPct: 110,
        sales: 1000000,
        commissionPct: 5,
        tier2Sales: 200000,
        tier2Pct: 7,
        baseIncentive: 20000,
        multiplier: 1.1,
      });
      expect(r.ok, slug).toBe(true);
    }
  });

  it("scheduling section ok", () => {
    for (const slug of HR_SCHEDULING_SLUGS) {
      const r = computeHrScheduling(slug, {
        hoursCoverageNeeded: 24,
        shiftLengthHours: 8,
        peoplePerShift: 2,
        shiftsPerDay: 3,
        daysInCycle: 21,
        peopleInRoster: 9,
        seatsNeeded: 10,
        staffAvailable: 9,
        baseHourly: 200,
        differentialPct: 15,
        shiftHours: 8,
        rotationTeams: 3,
      });
      expect(r.ok, slug).toBe(true);
    }
  });

  it("ai section ok", () => {
    for (const slug of HR_AI_SLUGS) {
      const r = computeHrAi(slug, {
        offerAnnual: 1500000,
        marketMedian: 1400000,
        marketP25: 1200000,
        marketP75: 1700000,
        currentFte: 40,
        demandFte: 45,
        overtimeHours: 200,
        idlePct: 5,
        output: 1000,
        hours: 160,
        peerOutputPerHour: 6,
        skillScore: 80,
        cultureScore: 75,
        experienceScore: 70,
        compensationFit: 85,
      });
      expect(r.ok, slug).toBe(true);
    }
  });

  it("PF teaching ceiling", () => {
    const r = computeHrPayroll("hr-pf-provident-fund-calculator", { basic: 50000, usePfCeiling: 1 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.amount).toBe(1800);
  });

  it("gratuity formula", () => {
    const r = computeHrCompliance("hr-gratuity-calculator", { lastDrawnMonthly: 26000, yearsOfService: 10 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.amount2).toBeCloseTo(((26000 * 15) / 26) * 10);
  });
});
