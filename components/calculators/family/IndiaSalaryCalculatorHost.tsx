"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  INDIA_SALARY_URL,
  INDIA_STATES,
  basicFromCtc,
  compareTaxRegimes,
  formatInr,
  gratuityAmount,
  hraExemption,
  indiaSalaryBreakdown,
  leaveEncashment,
  monthlyProfessionalTax,
  statutoryBonus,
  type IndiaState,
  type TaxRegime,
} from "@/lib/calculators/salaryIndia";

type IndiaSalarySlug =
  | "salary-calculator-india-full-breakdown"
  | "in-hand-salary-calculator-india"
  | "income-tax-calculator-india-old-vs-new-regime"
  | "hra-calculator"
  | "basic-salary-calculator"
  | "take-home-salary-calculator-india"
  | "salary-breakup-calculator-india"
  | "professional-tax-calculator-state-wise"
  | "gratuity-calculator"
  | "leave-encashment-calculator"
  | "bonus-calculator-india";

type IndiaMode =
  | "fullBreakdown"
  | "inHand"
  | "taxCompare"
  | "hra"
  | "basic"
  | "takeHome"
  | "breakup"
  | "professionalTax"
  | "gratuity"
  | "leaveEncashment"
  | "bonus";

type Config = {
  title: string;
  description: string;
  mode: IndiaMode;
  showCtc?: boolean;
  showBasicPct?: boolean;
  showRent?: boolean;
  showMetro?: boolean;
  showState?: boolean;
  showRegime?: boolean;
  show80c?: boolean;
  showBasicDa?: boolean;
  showYears?: boolean;
  showLeaveDays?: boolean;
  showBonusPct?: boolean;
  showAnnualIncome?: boolean;
  showHraReceived?: boolean;
};

const CONFIG: Record<IndiaSalarySlug, Config> = {
  "salary-calculator-india-full-breakdown": {
    title: "Salary calculator India (full breakdown)",
    description:
      "Estimate monthly CTC split into basic, HRA, allowances, PF, professional tax, and income tax (FY 2025–26 slabs).",
    mode: "fullBreakdown",
    showCtc: true,
    showBasicPct: true,
    showRent: true,
    showMetro: true,
    showState: true,
    showRegime: true,
    show80c: true,
  },
  "in-hand-salary-calculator-india": {
    title: "In-hand salary calculator India",
    description: "Estimate monthly take-home after PF, professional tax, and income tax on your CTC structure.",
    mode: "inHand",
    showCtc: true,
    showBasicPct: true,
    showState: true,
    showRegime: true,
  },
  "income-tax-calculator-india-old-vs-new-regime": {
    title: "Income tax calculator India (old vs new regime)",
    description: "Compare annual income tax under old and new regimes with standard deduction and optional 80C / HRA.",
    mode: "taxCompare",
    showAnnualIncome: true,
    show80c: true,
    showRent: true,
    showMetro: true,
    showBasicDa: true,
    showHraReceived: true,
  },
  "hra-calculator": {
    title: "HRA calculator",
    description: "Calculate HRA tax exemption: minimum of actual HRA, rent minus 10% of basic, and 40%/50% of basic.",
    mode: "hra",
    showBasicDa: true,
    showHraReceived: true,
    showRent: true,
    showMetro: true,
  },
  "basic-salary-calculator": {
    title: "Basic salary calculator",
    description: "Derive basic pay from monthly CTC using a typical basic-as-%-of-CTC split.",
    mode: "basic",
    showCtc: true,
    showBasicPct: true,
  },
  "take-home-salary-calculator-india": {
    title: "Take home salary calculator India",
    description: "Monthly net pay after employee PF, professional tax, and TDS-style income tax estimate.",
    mode: "takeHome",
    showCtc: true,
    showBasicPct: true,
    showState: true,
    showRegime: true,
  },
  "salary-breakup-calculator-india": {
    title: "Salary breakup calculator India",
    description: "Show CTC components: basic, HRA, special allowance, and employer PF load.",
    mode: "breakup",
    showCtc: true,
    showBasicPct: true,
  },
  "professional-tax-calculator-state-wise": {
    title: "Professional tax calculator (state-wise)",
    description: "Look up indicative monthly professional tax for common Indian states (simplified slab).",
    mode: "professionalTax",
    showState: true,
  },
  "gratuity-calculator": {
    title: "Gratuity calculator",
    description: "Payment of Gratuity Act formula: (last drawn salary × 15 ÷ 26) × years, capped at ₹20 lakh.",
    mode: "gratuity",
    showBasicDa: true,
    showYears: true,
  },
  "leave-encashment-calculator": {
    title: "Leave encashment calculator",
    description: "Encash unused leave: (basic + DA) ÷ 30 × number of leave days.",
    mode: "leaveEncashment",
    showBasicDa: true,
    showLeaveDays: true,
  },
  "bonus-calculator-india": {
    title: "Bonus calculator (India)",
    description: "Statutory bonus estimate using Payment of Bonus Act wage ceiling (simplified).",
    mode: "bonus",
    showBasicDa: true,
    showBonusPct: true,
  },
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono text-right">{value}</span>
    </div>
  );
}

function parseState(raw: string): IndiaState {
  const valid = INDIA_STATES.map((s) => s.id);
  return valid.includes(raw as IndiaState) ? (raw as IndiaState) : "maharashtra";
}

function parseRegime(raw: string): TaxRegime {
  return raw === "old" ? "old" : "new";
}

export function IndiaSalaryCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as IndiaSalarySlug] ?? CONFIG["salary-calculator-india-full-breakdown"];

  const [monthlyCtc, setMonthlyCtc] = useState(useLoanInitialInput(INDIA_SALARY_URL.CTC, "100000"));
  const [basicPct, setBasicPct] = useState(useLoanInitialInput(INDIA_SALARY_URL.BASIC_PCT, "40"));
  const [annualIncome, setAnnualIncome] = useState(useLoanInitialInput(INDIA_SALARY_URL.A, "1200000"));
  const [basicDa, setBasicDa] = useState(useLoanInitialInput(INDIA_SALARY_URL.DA, "50000"));
  const [hraReceived, setHraReceived] = useState(useLoanInitialInput(INDIA_SALARY_URL.HRA_PCT, "25000"));
  const [rent, setRent] = useState(useLoanInitialInput(INDIA_SALARY_URL.RENT, "18000"));
  const [metro, setMetro] = useState(useLoanInitialInput(INDIA_SALARY_URL.METRO, "1") !== "0");
  const [state, setState] = useState<IndiaState>(parseState(useLoanInitialInput(INDIA_SALARY_URL.STATE, "maharashtra")));
  const [regime, setRegime] = useState<TaxRegime>(parseRegime(useLoanInitialInput(INDIA_SALARY_URL.REGIME, "new")));
  const [sec80c, setSec80c] = useState(useLoanInitialInput(INDIA_SALARY_URL.SEC80C, "150000"));
  const [years, setYears] = useState(useLoanInitialInput(INDIA_SALARY_URL.YEARS, "5"));
  const [leaveDays, setLeaveDays] = useState(useLoanInitialInput(INDIA_SALARY_URL.LEAVE_DAYS, "10"));
  const [bonusPct, setBonusPct] = useState(useLoanInitialInput(INDIA_SALARY_URL.BONUS_PCT, "8.33"));

  const shareParams = useCallback(
    () => ({
      [INDIA_SALARY_URL.CTC]: monthlyCtc,
      [INDIA_SALARY_URL.BASIC_PCT]: basicPct,
      [INDIA_SALARY_URL.A]: annualIncome,
      [INDIA_SALARY_URL.DA]: basicDa,
      [INDIA_SALARY_URL.HRA_PCT]: hraReceived,
      [INDIA_SALARY_URL.RENT]: rent,
      [INDIA_SALARY_URL.METRO]: metro ? "1" : "0",
      [INDIA_SALARY_URL.STATE]: state,
      [INDIA_SALARY_URL.REGIME]: regime,
      [INDIA_SALARY_URL.SEC80C]: sec80c,
      [INDIA_SALARY_URL.YEARS]: years,
      [INDIA_SALARY_URL.LEAVE_DAYS]: leaveDays,
      [INDIA_SALARY_URL.BONUS_PCT]: bonusPct,
    }),
    [annualIncome, basicDa, basicPct, bonusPct, hraReceived, leaveDays, metro, monthlyCtc, regime, rent, sec80c, state, years],
  );

  useLoanUrlSync(shareParams, [
    monthlyCtc,
    basicPct,
    annualIncome,
    basicDa,
    hraReceived,
    rent,
    metro,
    state,
    regime,
    sec80c,
    years,
    leaveDays,
    bonusPct,
  ]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "fullBreakdown":
      case "inHand":
      case "takeHome":
      case "breakup": {
        const ctc = parsePositive(monthlyCtc, "Monthly CTC");
        const bp = parseAprPercent(basicPct, "Basic %");
        if (!ctc.ok) return { error: ctc.error };
        if (!bp.ok) return { error: bp.error };
        const sec80cVal = parseNonNegative(sec80c, "80C");
        if (!sec80cVal.ok) return { error: sec80cVal.error };
        const rentVal = parseNonNegative(rent, "Rent");
        if (!rentVal.ok) return { error: rentVal.error };
        const breakdown = indiaSalaryBreakdown({
          monthlyCtc: ctc.value,
          basicPercent: bp.value,
          rentPaid: rentVal.value,
          metro,
          state,
          regime,
          sec80c: sec80cVal.value,
        });
        if ("error" in breakdown) return { error: breakdown.error };

        if (config.mode === "breakup") {
          return {
            primary: formatInr(breakdown.monthlyCtc),
            primaryLabel: "Monthly CTC",
            rows: [
              { label: "Basic", value: formatInr(breakdown.basic) },
              { label: "HRA", value: formatInr(breakdown.hra) },
              { label: "Special allowance", value: formatInr(breakdown.specialAllowance) },
              { label: "Gross (employee)", value: formatInr(breakdown.grossMonthly) },
              { label: "Employer PF", value: formatInr(breakdown.employerPf) },
              { label: "Employee PF", value: formatInr(breakdown.employeePf) },
              { label: "Annual CTC", value: formatInr(breakdown.annualCtc) },
            ],
          };
        }

        const primaryLabel =
          config.mode === "inHand" || config.mode === "takeHome" ? "In-hand monthly" : "In-hand monthly";
        const rows =
          config.mode === "fullBreakdown"
            ? [
                { label: "Basic", value: formatInr(breakdown.basic) },
                { label: "HRA", value: formatInr(breakdown.hra) },
                { label: "Special allowance", value: formatInr(breakdown.specialAllowance) },
                { label: "Gross monthly", value: formatInr(breakdown.grossMonthly) },
                { label: "Employee PF", value: formatInr(breakdown.employeePf) },
                { label: "Professional tax", value: formatInr(breakdown.professionalTax) },
                { label: "Income tax (monthly)", value: formatInr(breakdown.incomeTaxMonthly) },
                { label: "In-hand monthly", value: formatInr(breakdown.inHandMonthly) },
                { label: "In-hand annual", value: formatInr(breakdown.annualInHand) },
              ]
            : [
                { label: "Gross monthly", value: formatInr(breakdown.grossMonthly) },
                { label: "Employee PF", value: formatInr(breakdown.employeePf) },
                { label: "Professional tax", value: formatInr(breakdown.professionalTax) },
                { label: "Income tax", value: formatInr(breakdown.incomeTaxMonthly) },
                { label: "In-hand annual", value: formatInr(breakdown.annualInHand) },
              ];

        return {
          primary: formatInr(breakdown.inHandMonthly),
          primaryLabel,
          rows,
        };
      }
      case "basic": {
        const ctc = parsePositive(monthlyCtc, "Monthly CTC");
        const bp = parseAprPercent(basicPct, "Basic %");
        if (!ctc.ok) return { error: ctc.error };
        if (!bp.ok) return { error: bp.error };
        const basic = basicFromCtc(ctc.value, bp.value);
        return {
          primary: formatInr(basic),
          primaryLabel: "Basic salary (monthly)",
          rows: [
            { label: "Monthly CTC", value: formatInr(ctc.value) },
            { label: "Basic % of CTC", value: `${bp.value}%` },
            { label: "Annual basic", value: formatInr(basic * 12) },
          ],
        };
      }
      case "taxCompare": {
        const income = parsePositive(annualIncome, "Annual income");
        const ded = parseNonNegative(sec80c, "80C deduction");
        const basic = parsePositive(basicDa, "Basic salary (monthly)");
        const hra = parseNonNegative(hraReceived, "HRA received (monthly)");
        const rentVal = parseNonNegative(rent, "Rent paid (monthly)");
        if (!income.ok) return { error: income.error };
        if (!ded.ok) return { error: ded.error };
        if (!basic.ok) return { error: basic.error };
        if (!hra.ok) return { error: hra.error };
        if (!rentVal.ok) return { error: rentVal.error };
        const hraResult = hraExemption({
          basic: basic.value,
          hraReceived: hra.value,
          rentPaid: rentVal.value,
          metro,
        });
        const cmp = compareTaxRegimes({
          annualIncome: income.value,
          sec80c: Math.min(ded.value, 150000),
          hraExemptionAnnual: hraResult.exemption * 12,
        });
        const betterLabel =
          cmp.better === "tie"
            ? "Roughly equal"
            : cmp.better === "new"
              ? "New regime lower"
              : "Old regime lower";
        return {
          primary: formatInr(Math.min(cmp.newRegime.annualTax, cmp.oldRegime.annualTax)),
          primaryLabel: "Lower annual tax",
          rows: [
            { label: "New regime tax", value: formatInr(cmp.newRegime.annualTax) },
            { label: "Old regime tax", value: formatInr(cmp.oldRegime.annualTax) },
            { label: "New regime (monthly)", value: formatInr(cmp.newRegime.monthlyTax) },
            { label: "Old regime (monthly)", value: formatInr(cmp.oldRegime.monthlyTax) },
            { label: "Recommendation", value: betterLabel },
            { label: "Tax difference", value: formatInr(cmp.savings) },
          ],
        };
      }
      case "hra": {
        const basic = parsePositive(basicDa, "Basic salary (monthly)");
        const hra = parseNonNegative(hraReceived, "HRA received (monthly)");
        const rentVal = parseNonNegative(rent, "Rent paid (monthly)");
        if (!basic.ok) return { error: basic.error };
        if (!hra.ok) return { error: hra.error };
        if (!rentVal.ok) return { error: rentVal.error };
        const hraResult = hraExemption({
          basic: basic.value,
          hraReceived: hra.value,
          rentPaid: rentVal.value,
          metro,
        });
        return {
          primary: formatInr(hraResult.exemption),
          primaryLabel: "HRA exemption (monthly)",
          rows: [
            { label: "HRA received", value: formatInr(hra.value) },
            { label: "Taxable HRA", value: formatInr(hraResult.taxableHra) },
            { label: "Limiting rule", value: hraResult.limitingFactor },
            { label: "Annual exemption", value: formatInr(hraResult.exemption * 12) },
          ],
        };
      }
      case "professionalTax": {
        const pt = monthlyProfessionalTax(state);
        return {
          primary: formatInr(pt),
          primaryLabel: "Monthly professional tax",
          rows: [
            { label: "State", value: INDIA_STATES.find((s) => s.id === state)?.label ?? state },
            { label: "Annual PT", value: formatInr(pt * 12) },
            { label: "Note", value: "Indicative max/simplified slab" },
          ],
        };
      }
      case "gratuity": {
        const salary = parsePositive(basicDa, "Last drawn salary (basic + DA)");
        const yrs = parsePositive(years, "Years of service");
        if (!salary.ok) return { error: salary.error };
        if (!yrs.ok) return { error: yrs.error };
        const g = gratuityAmount({ lastDrawnMonthly: salary.value, yearsOfService: yrs.value });
        if ("error" in g) return { error: g.error };
        return {
          primary: formatInr(g.amount),
          primaryLabel: "Gratuity payable",
          rows: [
            { label: "Last drawn (monthly)", value: formatInr(salary.value) },
            { label: "Years of service", value: String(yrs.value) },
            { label: "Statutory cap", value: formatInr(g.cap) },
            { label: "Cap applied", value: g.capped ? "Yes" : "No" },
          ],
        };
      }
      case "leaveEncashment": {
        const salary = parsePositive(basicDa, "Basic + DA (monthly)");
        const days = parsePositive(leaveDays, "Leave days");
        if (!salary.ok) return { error: salary.error };
        if (!days.ok) return { error: days.error };
        const enc = leaveEncashment({ basicPlusDa: salary.value, leaveDays: days.value });
        if ("error" in enc) return { error: enc.error };
        return {
          primary: formatInr(enc.amount),
          primaryLabel: "Leave encashment",
          rows: [
            { label: "Daily rate", value: formatInr(enc.dailyRate) },
            { label: "Leave days", value: String(days.value) },
            { label: "Basic + DA", value: formatInr(salary.value) },
          ],
        };
      }
      case "bonus": {
        const salary = parsePositive(basicDa, "Basic + DA (monthly)");
        const pct = parseAprPercent(bonusPct, "Bonus %");
        if (!salary.ok) return { error: salary.error };
        if (!pct.ok) return { error: pct.error };
        const bonus = statutoryBonus({ basicPlusDa: salary.value, bonusPercent: pct.value });
        if ("error" in bonus) return { error: bonus.error };
        return {
          primary: formatInr(bonus.monthlyBonus),
          primaryLabel: "Monthly bonus",
          rows: [
            { label: "Calculation base", value: formatInr(bonus.calculationBase) },
            { label: "Bonus %", value: `${pct.value}%` },
            { label: "Annual bonus", value: formatInr(bonus.annualBonus) },
          ],
        };
      }
      default:
        return { error: "Unknown calculator mode." };
    }
  }, [
    annualIncome,
    basicDa,
    basicPct,
    bonusPct,
    config.mode,
    hraReceived,
    leaveDays,
    metro,
    monthlyCtc,
    regime,
    rent,
    sec80c,
    state,
    years,
  ]);

  const selectCls =
    "mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]";

  return (
    <CalculatorShell
      title={config.title}
      description={config.description}
      result={
        "error" in result ? (
          <p className="text-sm font-medium text-rose-700">{result.error}</p>
        ) : (
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-[var(--muted)]">{result.primaryLabel}</p>
              <p className="font-mono text-3xl font-semibold text-[var(--accent-bright)]">{result.primary}</p>
            </div>
            <div className="grid gap-2 border-t border-[var(--border)] pt-4">
              {result.rows.map((row) => (
                <Row key={row.label} label={row.label} value={row.value} />
              ))}
            </div>
          </div>
        )
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {config.showCtc ? (
          <div>
            <FieldLabel htmlFor="ctc">Monthly CTC (₹)</FieldLabel>
            <FieldInput id="ctc" inputMode="decimal" value={monthlyCtc} onChange={(e) => setMonthlyCtc(e.target.value)} className="mt-2" />
          </div>
        ) : null}

        {config.showAnnualIncome ? (
          <div>
            <FieldLabel htmlFor="annual">Annual gross income (₹)</FieldLabel>
            <FieldInput id="annual" inputMode="decimal" value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} className="mt-2" />
          </div>
        ) : null}

        {config.showBasicPct ? (
          <div>
            <FieldLabel htmlFor="basicPct">Basic as % of CTC</FieldLabel>
            <FieldInput id="basicPct" inputMode="decimal" value={basicPct} onChange={(e) => setBasicPct(e.target.value)} className="mt-2" />
          </div>
        ) : null}

        {config.showBasicDa ? (
          <div>
            <FieldLabel htmlFor="basicDa">Basic / basic + DA (monthly ₹)</FieldLabel>
            <FieldInput id="basicDa" inputMode="decimal" value={basicDa} onChange={(e) => setBasicDa(e.target.value)} className="mt-2" />
          </div>
        ) : null}

        {config.showHraReceived ? (
          <div>
            <FieldLabel htmlFor="hra">HRA received (monthly ₹)</FieldLabel>
            <FieldInput id="hra" inputMode="decimal" value={hraReceived} onChange={(e) => setHraReceived(e.target.value)} className="mt-2" />
          </div>
        ) : null}

        {config.showRent ? (
          <div>
            <FieldLabel htmlFor="rent">Rent paid (monthly ₹)</FieldLabel>
            <FieldInput id="rent" inputMode="decimal" value={rent} onChange={(e) => setRent(e.target.value)} className="mt-2" />
          </div>
        ) : null}

        {config.showMetro ? (
          <div>
            <FieldLabel htmlFor="metro">City type</FieldLabel>
            <select id="metro" value={metro ? "1" : "0"} onChange={(e) => setMetro(e.target.value === "1")} className={selectCls}>
              <option value="1">Metro (50% rule)</option>
              <option value="0">Non-metro (40% rule)</option>
            </select>
          </div>
        ) : null}

        {config.showState ? (
          <div>
            <FieldLabel htmlFor="state">State</FieldLabel>
            <select id="state" value={state} onChange={(e) => setState(parseState(e.target.value))} className={selectCls}>
              {INDIA_STATES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {config.showRegime ? (
          <div>
            <FieldLabel htmlFor="regime">Tax regime</FieldLabel>
            <select id="regime" value={regime} onChange={(e) => setRegime(parseRegime(e.target.value))} className={selectCls}>
              <option value="new">New regime</option>
              <option value="old">Old regime</option>
            </select>
          </div>
        ) : null}

        {config.show80c ? (
          <div>
            <FieldLabel htmlFor="sec80c">80C deduction (annual ₹)</FieldLabel>
            <FieldInput id="sec80c" inputMode="decimal" value={sec80c} onChange={(e) => setSec80c(e.target.value)} className="mt-2" />
          </div>
        ) : null}

        {config.showYears ? (
          <div>
            <FieldLabel htmlFor="years">Years of service</FieldLabel>
            <FieldInput id="years" inputMode="decimal" value={years} onChange={(e) => setYears(e.target.value)} className="mt-2" />
          </div>
        ) : null}

        {config.showLeaveDays ? (
          <div>
            <FieldLabel htmlFor="leaveDays">Leave days to encash</FieldLabel>
            <FieldInput id="leaveDays" inputMode="decimal" value={leaveDays} onChange={(e) => setLeaveDays(e.target.value)} className="mt-2" />
          </div>
        ) : null}

        {config.showBonusPct ? (
          <div>
            <FieldLabel htmlFor="bonusPct">Bonus % (8.33–20)</FieldLabel>
            <FieldInput id="bonusPct" inputMode="decimal" value={bonusPct} onChange={(e) => setBonusPct(e.target.value)} className="mt-2" />
          </div>
        ) : null}
      </div>
    </CalculatorShell>
  );
}
