import { formatLoanMoney } from "./loanFormat";

export function formatInr(amount: number): string {
  return formatLoanMoney(amount, "INR");
}

export const INDIA_SALARY_URL = {
  A: "a",
  CTC: "c",
  BASIC_PCT: "bp",
  HRA_PCT: "hp",
  RENT: "r",
  METRO: "mt",
  STATE: "st",
  YEARS: "y",
  LEAVE_DAYS: "ld",
  BONUS_PCT: "bn",
  REGIME: "rg",
  SEC80C: "s8",
  DA: "da",
  BASIC: "b",
} as const;

export function parseIndiaSalarySearchParams(sp: Record<string, string | string[] | undefined>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(INDIA_SALARY_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export type TaxRegime = "old" | "new";

export type IndiaState =
  | "maharashtra"
  | "karnataka"
  | "delhi"
  | "tamil-nadu"
  | "telangana"
  | "west-bengal"
  | "gujarat"
  | "other";

const PF_WAGE_CEILING = 15000;
const PF_RATE = 0.12;
const STANDARD_DEDUCTION_NEW = 75000;
const STANDARD_DEDUCTION_OLD = 50000;
const BONUS_WAGE_CEILING = 21000;

export const INDIA_STATES: { id: IndiaState; label: string }[] = [
  { id: "maharashtra", label: "Maharashtra" },
  { id: "karnataka", label: "Karnataka" },
  { id: "delhi", label: "Delhi (NCT)" },
  { id: "tamil-nadu", label: "Tamil Nadu" },
  { id: "telangana", label: "Telangana" },
  { id: "west-bengal", label: "West Bengal" },
  { id: "gujarat", label: "Gujarat" },
  { id: "other", label: "Other / average" },
];

export function pfContribution(basic: number): number {
  return Math.min(basic, PF_WAGE_CEILING) * PF_RATE;
}

export function monthlyProfessionalTax(state: IndiaState): number {
  const map: Record<IndiaState, number> = {
    maharashtra: 200,
    karnataka: 200,
    "tamil-nadu": 200,
    telangana: 200,
    "west-bengal": 200,
    gujarat: 200,
    delhi: 0,
    other: 200,
  };
  return map[state] ?? 200;
}

export function hraExemption(params: {
  basic: number;
  hraReceived: number;
  rentPaid: number;
  metro: boolean;
}): { exemption: number; taxableHra: number; limitingFactor: string } {
  const { basic, hraReceived, rentPaid, metro } = params;
  if (rentPaid <= 0) {
    return { exemption: 0, taxableHra: hraReceived, limitingFactor: "No rent declared" };
  }
  const tenPercentBasic = basic * 0.1;
  const rentMinusTen = Math.max(0, rentPaid - tenPercentBasic);
  const percentOfBasic = basic * (metro ? 0.5 : 0.4);
  const exemption = Math.min(hraReceived, rentMinusTen, percentOfBasic);
  let limitingFactor = "Actual HRA received";
  if (exemption === rentMinusTen) limitingFactor = "Rent paid − 10% of basic";
  else if (exemption === percentOfBasic) limitingFactor = metro ? "50% of basic (metro)" : "40% of basic (non-metro)";
  return { exemption, taxableHra: Math.max(0, hraReceived - exemption), limitingFactor };
}

function progressiveTax(taxable: number, slabs: [number, number][]): number {
  if (taxable <= 0) return 0;
  let tax = 0;
  let prev = 0;
  for (const [limit, rate] of slabs) {
    if (taxable <= prev) break;
    const slice = Math.min(taxable, limit) - prev;
    if (slice > 0) tax += slice * rate;
    prev = limit;
  }
  return tax;
}

export function annualIncomeTaxNewRegime(annualIncome: number): number {
  const taxable = Math.max(0, annualIncome - STANDARD_DEDUCTION_NEW);
  const taxBeforeRebate = progressiveTax(taxable, [
    [300000, 0],
    [700000, 0.05],
    [1000000, 0.1],
    [1200000, 0.15],
    [1500000, 0.2],
    [Number.POSITIVE_INFINITY, 0.3],
  ]);
  const rebate = taxable <= 700000 ? taxBeforeRebate : 0;
  const netTax = Math.max(0, taxBeforeRebate - rebate);
  return netTax * 1.04;
}

export function annualIncomeTaxOldRegime(params: {
  annualIncome: number;
  sec80c?: number;
  hraExemptionAnnual?: number;
}): number {
  const sec80c = Math.min(params.sec80c ?? 0, 150000);
  const hra = params.hraExemptionAnnual ?? 0;
  const taxable = Math.max(0, params.annualIncome - STANDARD_DEDUCTION_OLD - sec80c - hra);
  const taxBeforeRebate = progressiveTax(taxable, [
    [250000, 0],
    [500000, 0.05],
    [1000000, 0.2],
    [Number.POSITIVE_INFINITY, 0.3],
  ]);
  const rebate = taxable <= 500000 ? Math.min(12500, taxBeforeRebate) : 0;
  const netTax = Math.max(0, taxBeforeRebate - rebate);
  return netTax * 1.04;
}

export function compareTaxRegimes(params: {
  annualIncome: number;
  sec80c?: number;
  hraExemptionAnnual?: number;
}): {
  newRegime: { annualTax: number; monthlyTax: number; taxableIncome: number };
  oldRegime: { annualTax: number; monthlyTax: number; taxableIncome: number };
  better: TaxRegime | "tie";
  savings: number;
} {
  const taxableNew = Math.max(0, params.annualIncome - STANDARD_DEDUCTION_NEW);
  const sec80c = Math.min(params.sec80c ?? 0, 150000);
  const hra = params.hraExemptionAnnual ?? 0;
  const taxableOld = Math.max(0, params.annualIncome - STANDARD_DEDUCTION_OLD - sec80c - hra);
  const newTax = annualIncomeTaxNewRegime(params.annualIncome);
  const oldTax = annualIncomeTaxOldRegime(params);
  const savings = Math.abs(newTax - oldTax);
  let better: TaxRegime | "tie" = "tie";
  if (newTax < oldTax - 1) better = "new";
  else if (oldTax < newTax - 1) better = "old";
  return {
    newRegime: { annualTax: newTax, monthlyTax: newTax / 12, taxableIncome: taxableNew },
    oldRegime: { annualTax: oldTax, monthlyTax: oldTax / 12, taxableIncome: taxableOld },
    better,
    savings,
  };
}

export function basicFromCtc(monthlyCtc: number, basicPercent: number): number {
  return monthlyCtc * (basicPercent / 100);
}

export function indiaSalaryBreakdown(params: {
  monthlyCtc: number;
  basicPercent?: number;
  hraPercentOfBasic?: number;
  rentPaid?: number;
  metro?: boolean;
  state?: IndiaState;
  regime?: TaxRegime;
  sec80c?: number;
}): {
  monthlyCtc: number;
  basic: number;
  hra: number;
  specialAllowance: number;
  grossMonthly: number;
  employeePf: number;
  employerPf: number;
  professionalTax: number;
  hraExemptionMonthly: number;
  incomeTaxMonthly: number;
  inHandMonthly: number;
  annualInHand: number;
  annualCtc: number;
} | { error: string } {
  const basicPercent = params.basicPercent ?? 40;
  const hraPercentOfBasic = params.hraPercentOfBasic ?? 50;
  if (basicPercent <= 0 || basicPercent > 100) return { error: "Basic % must be between 1 and 100." };

  const basic = basicFromCtc(params.monthlyCtc, basicPercent);
  const employerPf = pfContribution(basic);
  const employeePf = pfContribution(basic);
  const hra = basic * (hraPercentOfBasic / 100);
  const specialAllowance = params.monthlyCtc - basic - hra - employerPf;
  if (specialAllowance < 0) {
    return { error: "CTC is too low for this basic/HRA split after employer PF." };
  }
  const grossMonthly = basic + hra + specialAllowance;
  const hraResult = hraExemption({
    basic,
    hraReceived: hra,
    rentPaid: params.rentPaid ?? 0,
    metro: params.metro ?? true,
  });
  const annualGross = grossMonthly * 12;
  const regime = params.regime ?? "new";
  const annualTax =
    regime === "old"
      ? annualIncomeTaxOldRegime({
          annualIncome: annualGross,
          sec80c: params.sec80c,
          hraExemptionAnnual: hraResult.exemption * 12,
        })
      : annualIncomeTaxNewRegime(annualGross);
  const professionalTax = monthlyProfessionalTax(params.state ?? "maharashtra");
  const incomeTaxMonthly = annualTax / 12;
  const inHandMonthly = grossMonthly - employeePf - professionalTax - incomeTaxMonthly;

  return {
    monthlyCtc: params.monthlyCtc,
    basic,
    hra,
    specialAllowance,
    grossMonthly,
    employeePf,
    employerPf,
    professionalTax,
    hraExemptionMonthly: hraResult.exemption,
    incomeTaxMonthly,
    inHandMonthly,
    annualInHand: inHandMonthly * 12,
    annualCtc: params.monthlyCtc * 12,
  };
}

export function gratuityAmount(params: {
  lastDrawnMonthly: number;
  yearsOfService: number;
}): { amount: number; capped: boolean; cap: number } | { error: string } {
  if (params.yearsOfService <= 0) return { error: "Years of service must be positive." };
  if (params.lastDrawnMonthly <= 0) return { error: "Last drawn salary must be positive." };
  const cap = 2000000;
  const raw = ((params.lastDrawnMonthly * 15) / 26) * params.yearsOfService;
  const capped = raw > cap;
  return { amount: Math.min(raw, cap), capped, cap };
}

export function leaveEncashment(params: {
  basicPlusDa: number;
  leaveDays: number;
}): { amount: number; dailyRate: number } | { error: string } {
  if (params.basicPlusDa <= 0) return { error: "Basic + DA must be positive." };
  if (params.leaveDays <= 0) return { error: "Leave days must be positive." };
  const dailyRate = params.basicPlusDa / 30;
  return { amount: dailyRate * params.leaveDays, dailyRate };
}

export function statutoryBonus(params: {
  basicPlusDa: number;
  bonusPercent?: number;
}): { monthlyBonus: number; annualBonus: number; calculationBase: number } | { error: string } {
  if (params.basicPlusDa <= 0) return { error: "Basic + DA must be positive." };
  const pct = params.bonusPercent ?? 8.33;
  if (pct <= 0 || pct > 20) return { error: "Bonus % must be between 0 and 20 (statutory max)." };
  const calculationBase = Math.min(params.basicPlusDa, BONUS_WAGE_CEILING);
  const monthlyBonus = calculationBase * (pct / 100);
  return { monthlyBonus, annualBonus: monthlyBonus * 12, calculationBase };
}
