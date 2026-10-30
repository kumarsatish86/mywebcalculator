"use client";

import type { HrPayrollSlug } from "@/lib/calculators/hrPayroll";
import type { HrAttendanceSlug } from "@/lib/calculators/hrAttendance";
import type { HrLeaveSlug } from "@/lib/calculators/hrLeave";
import type { HrProductivitySlug } from "@/lib/calculators/hrProductivity";
import type { HrCostSlug } from "@/lib/calculators/hrCost";
import type { HrAttritionSlug } from "@/lib/calculators/hrAttrition";
import type { HrWorkforceSlug } from "@/lib/calculators/hrWorkforce";
import type { HrComplianceSlug } from "@/lib/calculators/hrCompliance";
import type { HrBonusSlug } from "@/lib/calculators/hrBonus";
import type { HrSchedulingSlug } from "@/lib/calculators/hrScheduling";
import type { HrAiSlug } from "@/lib/calculators/hrAi";
import { HrPayrollCalculatorHost } from "./HrPayrollCalculatorHost";
import { HrAttendanceCalculatorHost } from "./HrAttendanceCalculatorHost";
import { HrLeaveCalculatorHost } from "./HrLeaveCalculatorHost";
import { HrProductivityCalculatorHost } from "./HrProductivityCalculatorHost";
import { HrCostCalculatorHost } from "./HrCostCalculatorHost";
import { HrAttritionCalculatorHost } from "./HrAttritionCalculatorHost";
import { HrWorkforceCalculatorHost } from "./HrWorkforceCalculatorHost";
import { HrComplianceCalculatorHost } from "./HrComplianceCalculatorHost";
import { HrBonusCalculatorHost } from "./HrBonusCalculatorHost";
import { HrSchedulingCalculatorHost } from "./HrSchedulingCalculatorHost";
import { HrAiCalculatorHost } from "./HrAiCalculatorHost";

const PAYROLL = new Set<string>([
  "hr-salary-annual-monthly-hourly-calculator",
  "hr-in-hand-salary-calculator",
  "hr-net-salary-calculator",
  "hr-gross-salary-calculator",
  "hr-salary-breakdown-calculator",
  "hr-payroll-calculator",
  "hr-payslip-generator-tool",
  "hr-payroll-tax-calculator",
  "hr-overtime-pay-calculator",
  "hr-holiday-pay-calculator",
  "hr-income-tax-calculator",
  "hr-pf-provident-fund-calculator",
  "hr-esi-calculator",
  "hr-professional-tax-calculator",
  "hr-tds-calculator",
] satisfies HrPayrollSlug[]);

const ATTENDANCE = new Set<string>([
  "hr-work-hours-calculator",
  "hr-timesheet-calculator",
  "hr-weekly-hours-calculator",
  "hr-monthly-work-hours-calculator",
  "hr-attendance-percentage-calculator",
  "hr-leave-balance-calculator",
  "hr-absence-impact-calculator",
  "hr-overtime-hours-calculator",
  "hr-shift-calculator-day-night",
  "hr-break-time-calculator",
  "hr-productivity-time-loss-calculator",
] satisfies HrAttendanceSlug[]);

const LEAVE = new Set<string>([
  "hr-leave-accrual-calculator",
  "hr-annual-leave-calculator",
  "hr-sick-leave-calculator",
  "hr-pto-calculator",
  "hr-vacation-balance-calculator",
  "hr-leave-encashment-calculator",
] satisfies HrLeaveSlug[]);

const PRODUCTIVITY = new Set<string>([
  "hr-employee-productivity-calculator",
  "hr-task-completion-rate-calculator",
  "hr-efficiency-calculator",
  "hr-output-per-hour-calculator",
  "hr-team-efficiency-calculator",
  "hr-workforce-productivity-calculator",
  "hr-utilization-rate-calculator",
  "hr-kpi-calculator",
  "hr-performance-score-calculator",
  "hr-target-achievement-calculator",
] satisfies HrProductivitySlug[]);

const COST = new Set<string>([
  "hr-ctc-calculator",
  "hr-employee-cost-calculator",
  "hr-hiring-cost-calculator",
  "hr-cost-per-hire-calculator",
  "hr-employee-turnover-cost-calculator",
  "hr-time-to-hire-calculator",
  "hr-offer-acceptance-rate-calculator",
  "hr-recruitment-roi-calculator",
] satisfies HrCostSlug[]);

const ATTRITION = new Set<string>([
  "hr-attrition-rate-calculator",
  "hr-employee-retention-rate-calculator",
  "hr-churn-rate-hr-calculator",
  "hr-employee-stability-index-calculator",
] satisfies HrAttritionSlug[]);

const WORKFORCE = new Set<string>([
  "hr-headcount-calculator",
  "hr-workforce-planning-calculator",
  "hr-staffing-needs-calculator",
  "hr-workload-distribution-calculator",
] satisfies HrWorkforceSlug[]);

const COMPLIANCE = new Set<string>([
  "hr-gratuity-calculator",
  "hr-notice-period-calculator",
  "hr-severance-pay-calculator",
  "hr-final-settlement-calculator",
] satisfies HrComplianceSlug[]);

const BONUS = new Set<string>([
  "hr-bonus-calculator",
  "hr-incentive-calculator",
  "hr-commission-calculator",
  "hr-sales-incentive-calculator",
] satisfies HrBonusSlug[]);

const SCHEDULING = new Set<string>([
  "hr-shift-planning-calculator",
  "hr-rotational-shift-calculator",
  "hr-staffing-coverage-calculator",
  "hr-shift-differential-pay-calculator",
] satisfies HrSchedulingSlug[]);

const AI = new Set<string>([
  "hr-ai-salary-benchmark-calculator",
  "hr-ai-workforce-optimization-tool",
  "hr-ai-productivity-analyzer",
  "hr-ai-hiring-decision-score-tool",
] satisfies HrAiSlug[]);

export function HrCalculatorRouter({ slug }: { slug: string }) {
  if (PAYROLL.has(slug)) return <HrPayrollCalculatorHost slug={slug} />;
  if (ATTENDANCE.has(slug)) return <HrAttendanceCalculatorHost slug={slug} />;
  if (LEAVE.has(slug)) return <HrLeaveCalculatorHost slug={slug} />;
  if (PRODUCTIVITY.has(slug)) return <HrProductivityCalculatorHost slug={slug} />;
  if (COST.has(slug)) return <HrCostCalculatorHost slug={slug} />;
  if (ATTRITION.has(slug)) return <HrAttritionCalculatorHost slug={slug} />;
  if (WORKFORCE.has(slug)) return <HrWorkforceCalculatorHost slug={slug} />;
  if (COMPLIANCE.has(slug)) return <HrComplianceCalculatorHost slug={slug} />;
  if (BONUS.has(slug)) return <HrBonusCalculatorHost slug={slug} />;
  if (SCHEDULING.has(slug)) return <HrSchedulingCalculatorHost slug={slug} />;
  if (AI.has(slug)) return <HrAiCalculatorHost slug={slug} />;
  return <HrPayrollCalculatorHost slug={slug} />;
}
