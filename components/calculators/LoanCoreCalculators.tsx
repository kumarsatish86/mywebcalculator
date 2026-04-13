"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { LOAN_URL } from "@/lib/calculators/loanUrlParams";
import { CalculatorShell, type CalculatorShellProps } from "@/components/CalculatorShell";
import { useLoanCalcPrefs } from "@/components/calculators/LoanCalcPrefsContext";
import { LoanCalculatorChrome } from "@/components/calculators/LoanCalculatorChrome";
import { LoanToolBar } from "@/components/calculators/LoanToolBar";
import { mwcTrack } from "@/lib/analytics/mwcTrack";
import { FieldInput, FieldLabel } from "@/components/fields";
import { FlatVsReducingComparisonMini } from "@/components/calculator-content/charts/FlatVsReducingComparisonMini";
import { UserLoanBalanceMini } from "@/components/calculator-content/charts/UserLoanBalanceMini";
import {
  annualRatePercentFromEmi,
  compareFlatVsReducing,
  principalFromEmi,
  termYearsFromEmi,
  totalInterestOnly,
} from "@/lib/calculators/emiInverse";
import { formatLoanMoney } from "@/lib/calculators/loanFormat";
import { amortizationRowsToCsv, buildLoanCsvMetadata, downloadTextFile } from "@/lib/calculators/loanCsv";
import {
  parseAprPercent,
  parseNonNegative,
  parsePositive,
  parseTermToMonths,
  termMonthsHint,
} from "@/lib/calculators/loanInputParse";
import {
  amortizationSchedule,
  amortizationTotals,
  monthlyLoanPayment,
  type AmortizationRow,
  type LoanTermInput,
} from "@/lib/calculators/loanPayment";
import { roundCurrency } from "@/lib/calculators/roundMoney";
import { simulateLoanWithOptions } from "@/lib/calculators/loanSimulation";

const AMORT_PREVIEW = 24;

function LoanShell({
  children,
  toolId,
  onReset,
  getSummary,
  showBankRounding = false,
  getShareSearchParams,
  onPrintSchedule,
}: {
  children: ReactNode;
  toolId: string;
  onReset?: () => void;
  getSummary?: () => string;
  showBankRounding?: boolean;
  getShareSearchParams?: () => Record<string, string | undefined>;
  onPrintSchedule?: () => void;
}) {
  const toolbar = (
    <LoanToolBar
      variant="inline"
      analyticsId={toolId}
      onReset={onReset}
      getSummary={getSummary}
      showBankRounding={showBankRounding}
      getShareSearchParams={getShareSearchParams}
      onPrintSchedule={onPrintSchedule}
    />
  );
  const onlyChild = Children.only(children);
  const rendered =
    isValidElement(onlyChild) && onlyChild.type === CalculatorShell
      ? cloneElement(onlyChild as ReactElement<CalculatorShellProps>, { toolbar })
      : onlyChild;

  return (
    <>
      <LoanCalculatorChrome />
      {rendered}
    </>
  );
}

function formatTenureLabel(monthsFloat: number): string {
  if (!Number.isFinite(monthsFloat)) return "—";
  const totalM = Math.round(monthsFloat);
  const y = Math.floor(totalM / 12);
  const m = totalM % 12;
  const yrPart = (monthsFloat / 12).toFixed(2);
  if (y === 0) return `${totalM} mo (${yrPart} yr)`;
  if (m === 0) return `${y} yr (${yrPart} yr)`;
  return `${y} yr ${m} mo (${yrPart} yr)`;
}

function ReducingEmiForm({
  toolId,
  title,
  description,
}: {
  toolId: string;
  title: string;
  description: string;
}) {
  const { currency, termMode, bankPennyRounding } = useLoanCalcPrefs();
  const [principal, setPrincipal] = useState(useLoanInitialInput(LOAN_URL.P, "25000"));
  const [apr, setApr] = useState(useLoanInitialInput(LOAN_URL.A, "6.5"));
  const [termRaw, setTermRaw] = useState(useLoanInitialInput(LOAN_URL.T, "5"));
  const [extra, setExtra] = useState(useLoanInitialInput(LOAN_URL.X, "0"));
  const [stepUp, setStepUp] = useState(useLoanInitialInput(LOAN_URL.U, "0"));
  const [advOpen, setAdvOpen] = useState(false);

  const shareParams = useCallback(
    () => ({
      [LOAN_URL.P]: principal,
      [LOAN_URL.A]: apr,
      [LOAN_URL.T]: termRaw,
      [LOAN_URL.X]: extra,
      [LOAN_URL.U]: stepUp,
    }),
    [principal, apr, termRaw, extra, stepUp],
  );
  useLoanUrlSync(shareParams, [principal, apr, termRaw, extra, stepUp, currency, termMode, bankPennyRounding]);

  useEffect(() => {
    if (!advOpen) return;
    window.setTimeout(() => {
      document.getElementById(`${toolId}-adv-x`)?.focus();
    }, 0);
  }, [advOpen, toolId]);

  const formErrorId = `${toolId}-form-error`;

  const parsed = useMemo(() => {
    const p0 = parsePositive(principal, "Principal");
    const a0 = parseAprPercent(apr, "APR");
    const t0 = parseTermToMonths(termRaw, termMode, "Loan term");
    const ex0 =
      extra.trim() === "" ? { ok: true as const, value: 0 } : parseNonNegative(extra, "Extra principal");
    const su0 =
      stepUp.trim() === "" ? { ok: true as const, value: 0 } : parseAprPercent(stepUp, "Step-up %");

    if (!p0.ok) return { baseError: p0.error };
    if (!a0.ok) return { baseError: a0.error };
    if (!t0.ok) return { baseError: t0.error };
    if (!ex0.ok) return { baseError: ex0.error };
    if (!su0.ok) return { baseError: su0.error };
    const exVal = ex0.value;
    const suVal = su0.value;

    const termMonths = t0.value;
    const term: LoanTermInput = { termMonths };

    const base = monthlyLoanPayment({
      principal: p0.value,
      annualRatePercent: a0.value,
      termMonths,
    });
    if ("error" in base) return { baseError: base.error };

    const contractualEmi = bankPennyRounding ? roundCurrency(base.payment) : base.payment;

    const useSim = exVal > 0 || suVal !== 0;
    if (!useSim) {
      if (bankPennyRounding) {
        const sched = amortizationSchedule(p0.value, a0.value, term, undefined, true);
        if ("error" in sched) return { baseError: sched.error };
        const t = amortizationTotals(sched);
        return {
          baseError: null,
          termMonths,
          term,
          display: {
            kind: "closed" as const,
            payment: t.firstPayment,
            totalPaid: t.totalPaid,
            totalInterest: t.totalInterest,
            months: sched.length,
          },
          chart: { principal: p0.value, apr: a0.value, term, series: undefined as undefined },
        };
      }
      return {
        baseError: null,
        termMonths,
        term,
        display: {
          kind: "closed" as const,
          payment: base.payment,
          totalPaid: base.totalPaid,
          totalInterest: base.totalInterest,
          months: base.termMonths,
        },
        chart: { principal: p0.value, apr: a0.value, term, series: undefined as undefined },
      };
    }

    const sim = simulateLoanWithOptions({
      principal: p0.value,
      annualRatePercent: a0.value,
      contractualEmi,
      extraPrincipalMonthly: exVal,
      stepUpPercentPerYear: suVal,
      bankPennyRounding,
    });
    if ("error" in sim) return { baseError: sim.error };

    const baseTotalInterest = bankPennyRounding
      ? (() => {
          const s = amortizationSchedule(p0.value, a0.value, term, undefined, true);
          return "error" in s ? base.totalInterest : amortizationTotals(s).totalInterest;
        })()
      : base.totalInterest;

    return {
      baseError: null,
      termMonths,
      term,
      display: {
        kind: "sim" as const,
        payment: contractualEmi,
        totalPaid: sim.totalPaid,
        totalInterest: sim.totalInterest,
        months: sim.monthCount,
        baseMonths: base.termMonths,
        baseTotalInterest,
      },
      chart: {
        principal: p0.value,
        apr: a0.value,
        term,
        series: sim.rows.map((r) => ({ month: r.month, balance: r.balance })),
      },
    };
  }, [principal, apr, termRaw, termMode, extra, stepUp, bankPennyRounding]);

  const hint = termMonthsHint(termMode, termRaw);
  const fieldInvalid = Boolean(parsed.baseError);

  return (
    <LoanShell
      toolId={toolId}
      showBankRounding
      getShareSearchParams={shareParams}
      onReset={() => {
        setPrincipal("25000");
        setApr("6.5");
        setTermRaw("5");
        setExtra("0");
        setStepUp("0");
        setAdvOpen(false);
      }}
      getSummary={() => {
        if (parsed.baseError) return `${title} — ${parsed.baseError}`;
        if (!parsed.display) return `${title} — enter principal, APR, and term.`;
        const d = parsed.display;
        return [
          title,
          `EMI ${formatLoanMoney(d.payment, currency)}`,
          `Total paid ${formatLoanMoney(d.totalPaid, currency)}`,
          `Total interest ${formatLoanMoney(d.totalInterest, currency)}`,
          `Payoff ${d.months} months`,
          `Principal ${principal}, APR ${apr}%, term ${termRaw}${termMode === "years" ? " yr" : " mo"}`,
        ].join(" · ");
      }}
    >
      <CalculatorShell
        title={title}
        description={description}
        resultKey={`${principal}-${apr}-${termRaw}-${extra}-${stepUp}-${currency}`}
        result={
          parsed.baseError ? (
            <p id={`${toolId}-result-error`} className="text-sm font-medium text-rose-700" role="alert">
              {parsed.baseError}
            </p>
          ) : parsed.display ? (
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-[var(--muted)]">Contractual monthly EMI</p>
                <p className="font-mono text-3xl font-semibold text-[var(--accent-bright)]">
                  {formatLoanMoney(parsed.display.payment, currency)}
                </p>
              </div>
              {parsed.display.kind === "sim" ? (
                <div className="space-y-2 text-xs text-[var(--muted)]">
                  <p>
                    With prepayment / step-up, payoff in <strong>{parsed.display.months}</strong> months. Totals
                    include all payments until the loan closes.
                  </p>
                  {bankPennyRounding && parsed.display.months !== parsed.display.baseMonths ? (
                    <p className="rounded-lg border border-amber-500/35 bg-amber-500/10 px-2 py-2 text-amber-950">
                      Simulated payoff is longer than the base contract tenor because cent rounding on each row
                      can leave a small residual until one more payment clears it.
                    </p>
                  ) : null}
                  <div className="grid gap-2 sm:grid-cols-3">
                    <p className="rounded-lg border border-[var(--border)] bg-[var(--surface)]/50 px-2 py-1">
                      Base tenor: <span className="font-medium text-[var(--text)]">{parsed.display.baseMonths} mo</span>
                    </p>
                    <p className="rounded-lg border border-[var(--border)] bg-[var(--surface)]/50 px-2 py-1">
                      New tenor: <span className="font-medium text-[var(--text)]">{parsed.display.months} mo</span>
                    </p>
                    <p className="rounded-lg border border-[var(--border)] bg-[var(--surface)]/50 px-2 py-1">
                      Interest saved:{" "}
                      <span className="font-medium text-[var(--text)]">
                        {formatLoanMoney(parsed.display.baseTotalInterest - parsed.display.totalInterest, currency)}
                      </span>
                    </p>
                  </div>
                </div>
              ) : null}
              <div className="grid gap-2 border-t border-[var(--border)] pt-4">
                <div className="flex justify-between gap-4">
                  <span className="text-[var(--muted)]">Total paid</span>
                  <span className="font-mono text-[var(--text)]">
                    {formatLoanMoney(parsed.display.totalPaid, currency)}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[var(--muted)]">Total interest</span>
                  <span className="font-mono text-[var(--text)]">
                    {formatLoanMoney(parsed.display.totalInterest, currency)}
                  </span>
                </div>
              </div>
            </div>
          ) : null
        }
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <FieldLabel htmlFor={`${toolId}-p`}>Principal</FieldLabel>
            <FieldInput
              id={`${toolId}-p`}
              inputMode="decimal"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="mt-2"
              aria-invalid={fieldInvalid}
              aria-describedby={fieldInvalid ? formErrorId : undefined}
            />
          </div>
          <div>
            <FieldLabel htmlFor={`${toolId}-apr`}>APR % (reducing)</FieldLabel>
            <FieldInput
              id={`${toolId}-apr`}
              inputMode="decimal"
              value={apr}
              onChange={(e) => setApr(e.target.value)}
              className="mt-2"
              aria-invalid={fieldInvalid}
              aria-describedby={fieldInvalid ? formErrorId : undefined}
            />
          </div>
          <div>
            <FieldLabel htmlFor={`${toolId}-y`}>{termMode === "years" ? "Term (years)" : "Term (months)"}</FieldLabel>
            <FieldInput
              id={`${toolId}-y`}
              inputMode="decimal"
              value={termRaw}
              onChange={(e) => setTermRaw(e.target.value)}
              className="mt-2"
              aria-invalid={fieldInvalid}
              aria-describedby={fieldInvalid ? formErrorId : undefined}
            />
            {hint ? <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p> : null}
          </div>
        </div>
        {parsed.baseError ? (
          <p id={formErrorId} role="alert" className="mt-2 text-sm text-rose-700">
            {parsed.baseError}
          </p>
        ) : null}

        <div className="mt-4">
          <button
            type="button"
            id={`${toolId}-adv-toggle`}
            aria-expanded={advOpen}
            aria-controls={`${toolId}-adv-panel`}
            onClick={() => {
              setAdvOpen((o) => {
                const next = !o;
                if (next) mwcTrack("loan_advanced_open", { tool: toolId });
                return next;
              });
            }}
            className="text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-bright)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded"
          >
            {advOpen ? "▼ Hide" : "▶"} Advanced: extra principal & step-up EMI
          </button>
          {advOpen ? (
            <div
              id={`${toolId}-adv-panel`}
              role="region"
              aria-label="Advanced loan options"
              className="mt-3 grid gap-4 sm:grid-cols-2 rounded-xl border border-[var(--border)] bg-[var(--input-bg)]/20 p-4"
            >
              <div>
                <FieldLabel htmlFor={`${toolId}-adv-x`}>Extra principal / month</FieldLabel>
                <FieldInput
                  id={`${toolId}-adv-x`}
                  inputMode="decimal"
                  value={extra}
                  onChange={(e) => setExtra(e.target.value)}
                  className="mt-2"
                  placeholder="0"
                  aria-invalid={fieldInvalid}
                  aria-describedby={fieldInvalid ? formErrorId : undefined}
                />
                <p className="mt-1 text-xs text-[var(--muted)]">Added to each payment after interest.</p>
              </div>
              <div>
                <FieldLabel htmlFor={`${toolId}-adv-su`}>EMI step-up % / year</FieldLabel>
                <FieldInput
                  id={`${toolId}-adv-su`}
                  inputMode="decimal"
                  value={stepUp}
                  onChange={(e) => setStepUp(e.target.value)}
                  className="mt-2"
                  placeholder="0"
                  aria-invalid={fieldInvalid}
                  aria-describedby={fieldInvalid ? formErrorId : undefined}
                />
                <p className="mt-1 text-xs text-[var(--muted)]">Contractual EMI multiplies every 12 months.</p>
              </div>
            </div>
          ) : null}
        </div>

        {parsed.chart && !parsed.baseError ? (
          <UserLoanBalanceMini
            principal={parsed.chart.principal}
            apr={parsed.chart.apr}
            term={parsed.chart.term}
            currency={currency}
            balanceSeries={parsed.chart.series}
            bankPennyRounding={bankPennyRounding}
          />
        ) : null}
      </CalculatorShell>
    </LoanShell>
  );
}

export function EmiCalculatorUniversal() {
  return (
    <ReducingEmiForm
      toolId="emi-calculator-universal"
      title="EMI calculator (universal)"
      description="Fixed-rate reducing-balance loan: EMI, totals, optional monthly prepayment, and optional annual EMI step-up."
    />
  );
}

export function LoanEmiCalculator() {
  return (
    <ReducingEmiForm
      toolId="loan-emi-calculator"
      title="Loan EMI calculator"
      description="Standard amortizing EMI with currency and term controls, plus optional prepayment and step-up modeling."
    />
  );
}

export function ReducingBalanceEmiCalculator() {
  return (
    <ReducingEmiForm
      toolId="reducing-balance-emi-calculator"
      title="Reducing balance EMI calculator"
      description="Interest on outstanding principal each month—the usual retail loan model—with advanced payoff options."
    />
  );
}

export function InterestRateCalculator() {
  return <InterestRateBody />;
}

function InterestRateBody() {
  const irToolId = "interest-rate-calculator";
  const { currency, termMode, bankPennyRounding } = useLoanCalcPrefs();
  const [principal, setPrincipal] = useState(useLoanInitialInput(LOAN_URL.P, "25000"));
  const [emi, setEmi] = useState(useLoanInitialInput(LOAN_URL.E, "488"));
  const [termRaw, setTermRaw] = useState(useLoanInitialInput(LOAN_URL.T, "5"));

  const shareParams = useCallback(
    () => ({
      [LOAN_URL.P]: principal,
      [LOAN_URL.E]: emi,
      [LOAN_URL.T]: termRaw,
    }),
    [principal, emi, termRaw],
  );
  useLoanUrlSync(shareParams, [principal, emi, termRaw, currency, termMode, bankPennyRounding]);

  const parsed = useMemo(() => {
    const p0 = parsePositive(principal, "Principal");
    const e0 = parsePositive(emi, "EMI");
    const t0 = parseTermToMonths(termRaw, termMode, "Loan term");
    if (!p0.ok) return { err: p0.error };
    if (!e0.ok) return { err: e0.error };
    if (!t0.ok) return { err: t0.error };
    const r = annualRatePercentFromEmi(p0.value, e0.value, t0.value);
    if ("error" in r) return { err: r.error };
    return { err: null as string | null, apr: r.annualRatePercent, months: t0.value };
  }, [principal, emi, termRaw, termMode]);

  const hint = termMonthsHint(termMode, termRaw);
  const fieldInvalid = Boolean(parsed.err);
  const formErrorId = `${irToolId}-form-error`;

  return (
    <LoanShell
      toolId={irToolId}
      getShareSearchParams={shareParams}
      onReset={() => {
        setPrincipal("25000");
        setEmi("488");
        setTermRaw("5");
      }}
      getSummary={() =>
        parsed.err
          ? `Interest rate calculator — ${parsed.err}`
          : `Interest rate calculator — implied nominal APR ${parsed.apr!.toFixed(4)}% over ${parsed.months} payments. Principal ${principal}, EMI ${emi}, term ${termRaw}${termMode === "years" ? " yr" : " mo"}.`
      }
    >
      <CalculatorShell
        title="Interest rate calculator"
        description="Solve for nominal annual APR from principal, monthly payment, and term (reducing balance, monthly compounding)."
        resultKey={`${principal}-${emi}-${termRaw}`}
        result={
          parsed.err ? (
            <p id={`${irToolId}-result-error`} role="alert" className="text-sm font-medium text-rose-700">
              {parsed.err}
            </p>
          ) : (
            <div className="space-y-2 text-sm">
              <p className="text-[var(--muted)]">Implied APR (nominal, monthly compounding)</p>
              <p className="font-mono text-3xl font-semibold text-[var(--accent-bright)]">
                {parsed.apr!.toFixed(4)}%
              </p>
              <p className="text-xs text-[var(--muted)]">Based on {parsed.months} equal monthly payments.</p>
            </div>
          )
        }
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <FieldLabel htmlFor={`${irToolId}-p`}>Principal ({currency})</FieldLabel>
            <FieldInput
              id={`${irToolId}-p`}
              inputMode="decimal"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="mt-2"
              aria-invalid={fieldInvalid}
              aria-describedby={fieldInvalid ? formErrorId : undefined}
            />
          </div>
          <div>
            <FieldLabel htmlFor={`${irToolId}-emi`}>Monthly EMI ({currency})</FieldLabel>
            <FieldInput
              id={`${irToolId}-emi`}
              inputMode="decimal"
              value={emi}
              onChange={(e) => setEmi(e.target.value)}
              className="mt-2"
              aria-invalid={fieldInvalid}
              aria-describedby={fieldInvalid ? formErrorId : undefined}
            />
          </div>
          <div>
            <FieldLabel htmlFor={`${irToolId}-t`}>{termMode === "years" ? "Term (years)" : "Term (months)"}</FieldLabel>
            <FieldInput
              id={`${irToolId}-t`}
              inputMode="decimal"
              value={termRaw}
              onChange={(e) => setTermRaw(e.target.value)}
              className="mt-2"
              aria-invalid={fieldInvalid}
              aria-describedby={fieldInvalid ? formErrorId : undefined}
            />
            {hint ? <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p> : null}
          </div>
        </div>
        {parsed.err ? (
          <p id={formErrorId} role="alert" className="mt-2 text-sm text-rose-700">
            {parsed.err}
          </p>
        ) : null}
      </CalculatorShell>
    </LoanShell>
  );
}

export function LoanAmountCalculator() {
  return <LoanAmountBody />;
}

function LoanAmountBody() {
  const laToolId = "loan-amount-calculator";
  const { currency, termMode, bankPennyRounding } = useLoanCalcPrefs();
  const [emi, setEmi] = useState(useLoanInitialInput(LOAN_URL.E, "500"));
  const [apr, setApr] = useState(useLoanInitialInput(LOAN_URL.A, "6.5"));
  const [termRaw, setTermRaw] = useState(useLoanInitialInput(LOAN_URL.T, "5"));

  const shareParams = useCallback(
    () => ({
      [LOAN_URL.E]: emi,
      [LOAN_URL.A]: apr,
      [LOAN_URL.T]: termRaw,
    }),
    [emi, apr, termRaw],
  );
  useLoanUrlSync(shareParams, [emi, apr, termRaw, currency, termMode, bankPennyRounding]);

  const parsed = useMemo(() => {
    const e0 = parsePositive(emi, "EMI");
    const a0 = parseAprPercent(apr, "APR");
    const t0 = parseTermToMonths(termRaw, termMode, "Loan term");
    if (!e0.ok) return { err: e0.error };
    if (!a0.ok) return { err: a0.error };
    if (!t0.ok) return { err: t0.error };
    const r = principalFromEmi(e0.value, a0.value, t0.value);
    if ("error" in r) return { err: r.error };
    return { err: null as string | null, principal: r.principal };
  }, [emi, apr, termRaw, termMode]);

  const hint = termMonthsHint(termMode, termRaw);
  const fieldInvalid = Boolean(parsed.err);
  const formErrorId = `${laToolId}-form-error`;

  return (
    <LoanShell
      toolId={laToolId}
      getShareSearchParams={shareParams}
      onReset={() => {
        setEmi("500");
        setApr("6.5");
        setTermRaw("5");
      }}
      getSummary={() =>
        parsed.err
          ? `Loan amount calculator — ${parsed.err}`
          : `Loan amount calculator — principal ${formatLoanMoney(parsed.principal!, currency)} at EMI ${emi}, APR ${apr}%, term ${termRaw}${termMode === "years" ? " yr" : " mo"}.`
      }
    >
      <CalculatorShell
        title="Loan amount calculator"
        description="Maximum principal for a target EMI, APR, and term (standard amortization)."
        resultKey={`${emi}-${apr}-${termRaw}`}
        result={
          parsed.err ? (
            <p id={`${laToolId}-result-error`} role="alert" className="text-sm font-medium text-rose-700">
              {parsed.err}
            </p>
          ) : (
            <div className="space-y-2 text-sm">
              <p className="text-[var(--muted)]">Loan principal</p>
              <p className="font-mono text-3xl font-semibold text-[var(--accent-bright)]">
                {formatLoanMoney(parsed.principal!, currency)}
              </p>
            </div>
          )
        }
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <FieldLabel htmlFor={`${laToolId}-emi`}>Monthly EMI ({currency})</FieldLabel>
            <FieldInput
              id={`${laToolId}-emi`}
              inputMode="decimal"
              value={emi}
              onChange={(e) => setEmi(e.target.value)}
              className="mt-2"
              aria-invalid={fieldInvalid}
              aria-describedby={fieldInvalid ? formErrorId : undefined}
            />
          </div>
          <div>
            <FieldLabel htmlFor={`${laToolId}-apr`}>APR %</FieldLabel>
            <FieldInput
              id={`${laToolId}-apr`}
              inputMode="decimal"
              value={apr}
              onChange={(e) => setApr(e.target.value)}
              className="mt-2"
              aria-invalid={fieldInvalid}
              aria-describedby={fieldInvalid ? formErrorId : undefined}
            />
          </div>
          <div>
            <FieldLabel htmlFor={`${laToolId}-t`}>{termMode === "years" ? "Term (years)" : "Term (months)"}</FieldLabel>
            <FieldInput
              id={`${laToolId}-t`}
              inputMode="decimal"
              value={termRaw}
              onChange={(e) => setTermRaw(e.target.value)}
              className="mt-2"
              aria-invalid={fieldInvalid}
              aria-describedby={fieldInvalid ? formErrorId : undefined}
            />
            {hint ? <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p> : null}
          </div>
        </div>
        {parsed.err ? (
          <p id={formErrorId} role="alert" className="mt-2 text-sm text-rose-700">
            {parsed.err}
          </p>
        ) : null}
      </CalculatorShell>
    </LoanShell>
  );
}

export function LoanTenureCalculator() {
  return <LoanTenureBody />;
}

function LoanTenureBody() {
  const ltToolId = "loan-tenure-calculator";
  const { currency, termMode, bankPennyRounding } = useLoanCalcPrefs();
  const [principal, setPrincipal] = useState(useLoanInitialInput(LOAN_URL.P, "25000"));
  const [emi, setEmi] = useState(useLoanInitialInput(LOAN_URL.E, "500"));
  const [apr, setApr] = useState(useLoanInitialInput(LOAN_URL.A, "6.5"));

  const shareParams = useCallback(
    () => ({
      [LOAN_URL.P]: principal,
      [LOAN_URL.E]: emi,
      [LOAN_URL.A]: apr,
    }),
    [principal, emi, apr],
  );
  useLoanUrlSync(shareParams, [principal, emi, apr, currency, termMode, bankPennyRounding]);

  const tenureResult = useMemo(() => {
    const p0 = parsePositive(principal, "Principal");
    const e0 = parsePositive(emi, "EMI");
    const a0 = parseAprPercent(apr, "APR");
    if (!p0.ok) return { error: p0.error };
    if (!e0.ok) return { error: e0.error };
    if (!a0.ok) return { error: a0.error };
    const t = termYearsFromEmi(p0.value, e0.value, a0.value);
    if ("error" in t) return { error: t.error };
    return { data: t };
  }, [principal, emi, apr]);

  const fieldInvalid = "error" in tenureResult;
  const formErrorId = `${ltToolId}-form-error`;

  return (
    <LoanShell
      toolId={ltToolId}
      getShareSearchParams={shareParams}
      onReset={() => {
        setPrincipal("25000");
        setEmi("500");
        setApr("6.5");
      }}
      getSummary={() =>
        "error" in tenureResult
          ? `Loan tenure calculator — ${tenureResult.error}`
          : `Loan tenure calculator — ${formatTenureLabel(tenureResult.data.months)} to payoff at EMI ${emi}, principal ${principal}, APR ${apr}%.`
      }
    >
      <CalculatorShell
        title="Loan tenure calculator"
        description="Months to repay a fixed EMI on a reducing-balance loan (closed-form)."
        resultKey={`${principal}-${emi}-${apr}`}
        result={
          "error" in tenureResult ? (
            <p id={`${ltToolId}-result-error`} role="alert" className="text-sm font-medium text-rose-700">
              {tenureResult.error}
            </p>
          ) : (
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-[var(--muted)]">Time to payoff</p>
                <p className="font-mono text-2xl font-semibold text-[var(--accent-bright)]">
                  {formatTenureLabel(tenureResult.data.months)}
                </p>
              </div>
              <p className="text-xs text-[var(--muted)]">
                ≈ <strong>{Math.round(tenureResult.data.months)}</strong> equal monthly payments at this EMI
                (model uses continuous month count; your lender may round).
              </p>
            </div>
          )
        }
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <FieldLabel htmlFor={`${ltToolId}-p`}>Principal ({currency})</FieldLabel>
            <FieldInput
              id={`${ltToolId}-p`}
              inputMode="decimal"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="mt-2"
              aria-invalid={fieldInvalid}
              aria-describedby={fieldInvalid ? formErrorId : undefined}
            />
          </div>
          <div>
            <FieldLabel htmlFor={`${ltToolId}-emi`}>Monthly EMI ({currency})</FieldLabel>
            <FieldInput
              id={`${ltToolId}-emi`}
              inputMode="decimal"
              value={emi}
              onChange={(e) => setEmi(e.target.value)}
              className="mt-2"
              aria-invalid={fieldInvalid}
              aria-describedby={fieldInvalid ? formErrorId : undefined}
            />
          </div>
          <div>
            <FieldLabel htmlFor={`${ltToolId}-apr`}>APR %</FieldLabel>
            <FieldInput
              id={`${ltToolId}-apr`}
              inputMode="decimal"
              value={apr}
              onChange={(e) => setApr(e.target.value)}
              className="mt-2"
              aria-invalid={fieldInvalid}
              aria-describedby={fieldInvalid ? formErrorId : undefined}
            />
          </div>
        </div>
        {"error" in tenureResult ? (
          <p id={formErrorId} role="alert" className="mt-2 text-sm text-rose-700">
            {tenureResult.error}
          </p>
        ) : null}
      </CalculatorShell>
    </LoanShell>
  );
}

export function TotalInterestPayableCalculator() {
  return <TotalInterestBody />;
}

function TotalInterestBody() {
  const { currency, termMode, bankPennyRounding } = useLoanCalcPrefs();
  const [principal, setPrincipal] = useState(useLoanInitialInput(LOAN_URL.P, "25000"));
  const [apr, setApr] = useState(useLoanInitialInput(LOAN_URL.A, "6.5"));
  const [termRaw, setTermRaw] = useState(useLoanInitialInput(LOAN_URL.T, "5"));
  const [extra, setExtra] = useState(useLoanInitialInput(LOAN_URL.X, "0"));
  const [stepUp, setStepUp] = useState(useLoanInitialInput(LOAN_URL.U, "0"));
  const [advOpen, setAdvOpen] = useState(false);
  const tiToolId = "total-interest-payable-calculator";

  const shareParams = useCallback(
    () => ({
      [LOAN_URL.P]: principal,
      [LOAN_URL.A]: apr,
      [LOAN_URL.T]: termRaw,
      [LOAN_URL.X]: extra,
      [LOAN_URL.U]: stepUp,
    }),
    [principal, apr, termRaw, extra, stepUp],
  );
  useLoanUrlSync(shareParams, [principal, apr, termRaw, extra, stepUp, currency, termMode, bankPennyRounding]);

  useEffect(() => {
    if (!advOpen) return;
    window.setTimeout(() => {
      document.getElementById(`${tiToolId}-adv-x`)?.focus();
    }, 0);
  }, [advOpen, tiToolId]);

  const formErrorId = `${tiToolId}-form-error`;

  const parsed = useMemo(() => {
    const p0 = parsePositive(principal, "Principal");
    const a0 = parseAprPercent(apr, "APR");
    const t0 = parseTermToMonths(termRaw, termMode, "Loan term");
    const ex0 =
      extra.trim() === "" ? { ok: true as const, value: 0 } : parseNonNegative(extra, "Extra principal");
    if (!ex0.ok) return { err: ex0.error };
    const su0 =
      stepUp.trim() === "" ? { ok: true as const, value: 0 } : parseAprPercent(stepUp, "Step-up %");
    if (!su0.ok) return { err: su0.error };

    if (!p0.ok) return { err: p0.error };
    if (!a0.ok) return { err: a0.error };
    if (!t0.ok) return { err: t0.error };

    const termMonths = t0.value;
    const term: LoanTermInput = { termMonths };
    const base = monthlyLoanPayment({ principal: p0.value, annualRatePercent: a0.value, termMonths });
    if ("error" in base) return { err: base.error };

    const contractualEmi = bankPennyRounding ? roundCurrency(base.payment) : base.payment;

    const useSim = ex0.value > 0 || su0.value !== 0;
    if (!useSim) {
      if (bankPennyRounding) {
        const sched = amortizationSchedule(p0.value, a0.value, term, undefined, true);
        if ("error" in sched) return { err: sched.error };
        const ttot = amortizationTotals(sched);
        return {
          err: null as string | null,
          emi: ttot.firstPayment,
          totalPaid: ttot.totalPaid,
          totalInterest: ttot.totalInterest,
          months: sched.length,
          baseMonths: sched.length,
          baseTotalInterest: ttot.totalInterest,
          term,
          chartP: p0.value,
          chartApr: a0.value,
          series: undefined as undefined,
        };
      }
      const r = totalInterestOnly({
        principal: p0.value,
        annualRatePercent: a0.value,
        termMonths,
      });
      if ("error" in r) return { err: r.error };
      return {
        err: null as string | null,
        emi: r.emi,
        totalPaid: r.totalPaid,
        totalInterest: r.totalInterest,
        months: r.termMonths,
        baseMonths: r.termMonths,
        baseTotalInterest: r.totalInterest,
        term,
        chartP: p0.value,
        chartApr: a0.value,
        series: undefined as undefined,
      };
    }

    const sim = simulateLoanWithOptions({
      principal: p0.value,
      annualRatePercent: a0.value,
      contractualEmi,
      extraPrincipalMonthly: ex0.value,
      stepUpPercentPerYear: su0.value,
      bankPennyRounding,
    });
    if ("error" in sim) return { err: sim.error };

    const baseTotalInterest = bankPennyRounding
      ? (() => {
          const s = amortizationSchedule(p0.value, a0.value, term, undefined, true);
          return "error" in s ? base.totalInterest : amortizationTotals(s).totalInterest;
        })()
      : base.totalInterest;

    return {
      err: null as string | null,
      emi: contractualEmi,
      totalPaid: sim.totalPaid,
      totalInterest: sim.totalInterest,
      months: sim.monthCount,
      baseMonths: base.termMonths,
      baseTotalInterest,
      term,
      chartP: p0.value,
      chartApr: a0.value,
      series: sim.rows.map((r) => ({ month: r.month, balance: r.balance })),
    };
  }, [principal, apr, termRaw, termMode, extra, stepUp, bankPennyRounding]);

  const hint = termMonthsHint(termMode, termRaw);
  const showChart =
    !parsed.err && parsed.chartP != null && parsed.chartApr != null && parsed.term != null;
  const fieldInvalid = Boolean(parsed.err);
  const simTenorMismatch =
    !parsed.err &&
    bankPennyRounding &&
    parsed.baseMonths != null &&
    parsed.months !== parsed.baseMonths &&
    (Number(extra) > 0 || (stepUp.trim() !== "" && Number(stepUp) !== 0));

  return (
    <LoanShell
      toolId={tiToolId}
      showBankRounding
      getShareSearchParams={shareParams}
      onReset={() => {
        setPrincipal("25000");
        setApr("6.5");
        setTermRaw("5");
        setExtra("0");
        setStepUp("0");
        setAdvOpen(false);
      }}
      getSummary={() =>
        parsed.err
          ? `Total interest payable — ${parsed.err}`
          : `Total interest payable — ${formatLoanMoney(parsed.totalInterest!, currency)} interest, ${formatLoanMoney(parsed.totalPaid!, currency)} total paid, EMI ${formatLoanMoney(parsed.emi!, currency)}, ${parsed.months} months. Principal ${principal}, APR ${apr}%.`
      }
    >
      <CalculatorShell
        title="Total interest payable calculator"
        description="Lifetime interest and total cash outflow—with optional prepayment and EMI step-up."
        resultKey={`${principal}-${apr}-${termRaw}-${extra}-${stepUp}`}
        result={
          parsed.err ? (
            <p id={`${tiToolId}-result-error`} role="alert" className="text-sm font-medium text-rose-700">
              {parsed.err}
            </p>
          ) : (
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-[var(--muted)]">Total interest</p>
                <p className="font-mono text-3xl font-semibold text-[var(--accent-bright)]">
                  {formatLoanMoney(parsed.totalInterest!, currency)}
                </p>
              </div>
              <div className="grid gap-2 border-t border-[var(--border)] pt-4">
                <div className="flex justify-between gap-4">
                  <span className="text-[var(--muted)]">
                    Contractual EMI{stepUp.trim() !== "" && Number(stepUp) !== 0 ? " (year-1 base)" : ""}
                  </span>
                  <span className="font-mono text-[var(--text)]">{formatLoanMoney(parsed.emi!, currency)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[var(--muted)]">Total paid</span>
                  <span className="font-mono text-[var(--text)]">
                    {formatLoanMoney(parsed.totalPaid!, currency)}
                  </span>
                </div>
              </div>
              {simTenorMismatch ? (
                <p className="rounded-lg border border-amber-500/35 bg-amber-500/10 px-2 py-2 text-xs text-amber-950">
                  Payoff months exceed the original contract tenor because penny rounding on the simulated
                  schedule can require an extra payment to clear the last cents.
                </p>
              ) : null}
              {parsed.baseMonths != null ? (
                <div className="grid gap-2 sm:grid-cols-3">
                  <p className="rounded-lg border border-[var(--border)] bg-[var(--surface)]/50 px-2 py-1 text-xs">
                    Base tenor: <span className="font-medium text-[var(--text)]">{parsed.baseMonths} mo</span>
                  </p>
                  <p className="rounded-lg border border-[var(--border)] bg-[var(--surface)]/50 px-2 py-1 text-xs">
                    New tenor: <span className="font-medium text-[var(--text)]">{parsed.months} mo</span>
                  </p>
                  <p className="rounded-lg border border-[var(--border)] bg-[var(--surface)]/50 px-2 py-1 text-xs">
                    Interest saved:{" "}
                    <span className="font-medium text-[var(--text)]">
                      {formatLoanMoney(parsed.baseTotalInterest! - parsed.totalInterest!, currency)}
                    </span>
                  </p>
                </div>
              ) : null}
            </div>
          )
        }
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <FieldLabel htmlFor={`${tiToolId}-p`}>Principal</FieldLabel>
            <FieldInput
              id={`${tiToolId}-p`}
              inputMode="decimal"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="mt-2"
              aria-invalid={fieldInvalid}
              aria-describedby={fieldInvalid ? formErrorId : undefined}
            />
          </div>
          <div>
            <FieldLabel htmlFor={`${tiToolId}-apr`}>APR %</FieldLabel>
            <FieldInput
              id={`${tiToolId}-apr`}
              inputMode="decimal"
              value={apr}
              onChange={(e) => setApr(e.target.value)}
              className="mt-2"
              aria-invalid={fieldInvalid}
              aria-describedby={fieldInvalid ? formErrorId : undefined}
            />
          </div>
          <div>
            <FieldLabel htmlFor={`${tiToolId}-t`}>{termMode === "years" ? "Term (years)" : "Term (months)"}</FieldLabel>
            <FieldInput
              id={`${tiToolId}-t`}
              inputMode="decimal"
              value={termRaw}
              onChange={(e) => setTermRaw(e.target.value)}
              className="mt-2"
              aria-invalid={fieldInvalid}
              aria-describedby={fieldInvalid ? formErrorId : undefined}
            />
            {hint ? <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p> : null}
          </div>
        </div>
        {parsed.err ? (
          <p id={formErrorId} role="alert" className="mt-2 text-sm text-rose-700">
            {parsed.err}
          </p>
        ) : null}

        <div className="mt-4">
          <button
            type="button"
            id={`${tiToolId}-adv-toggle`}
            aria-expanded={advOpen}
            aria-controls={`${tiToolId}-adv-panel`}
            onClick={() => {
              setAdvOpen((o) => {
                const next = !o;
                if (next) mwcTrack("loan_advanced_open", { tool: tiToolId });
                return next;
              });
            }}
            className="text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-bright)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded"
          >
            {advOpen ? "▼ Hide" : "▶"} Advanced: prepayment & step-up
          </button>
          {advOpen ? (
            <div
              id={`${tiToolId}-adv-panel`}
              role="region"
              aria-label="Prepayment and EMI step-up"
              className="mt-3 grid gap-4 sm:grid-cols-2 rounded-xl border border-[var(--border)] bg-[var(--input-bg)]/20 p-4"
            >
              <div>
                <FieldLabel htmlFor={`${tiToolId}-adv-x`}>Extra principal / month</FieldLabel>
                <FieldInput
                  id={`${tiToolId}-adv-x`}
                  inputMode="decimal"
                  value={extra}
                  onChange={(e) => setExtra(e.target.value)}
                  className="mt-2"
                  placeholder="0"
                  aria-invalid={fieldInvalid}
                  aria-describedby={fieldInvalid ? formErrorId : undefined}
                />
              </div>
              <div>
                <FieldLabel htmlFor={`${tiToolId}-adv-su`}>EMI step-up % / year</FieldLabel>
                <FieldInput
                  id={`${tiToolId}-adv-su`}
                  inputMode="decimal"
                  value={stepUp}
                  onChange={(e) => setStepUp(e.target.value)}
                  className="mt-2"
                  placeholder="0"
                  aria-invalid={fieldInvalid}
                  aria-describedby={fieldInvalid ? formErrorId : undefined}
                />
              </div>
            </div>
          ) : null}
        </div>

        {showChart ? (
          <UserLoanBalanceMini
            principal={parsed.chartP!}
            apr={parsed.chartApr!}
            term={parsed.term!}
            currency={currency}
            balanceSeries={parsed.series}
            bankPennyRounding={bankPennyRounding}
          />
        ) : null}
      </CalculatorShell>
    </LoanShell>
  );
}

export function LoanAmortizationCalculator() {
  return <LoanAmortizationBody />;
}

function LoanAmortizationBody() {
  const { currency, termMode, bankPennyRounding } = useLoanCalcPrefs();
  const [principal, setPrincipal] = useState(useLoanInitialInput(LOAN_URL.P, "25000"));
  const [apr, setApr] = useState(useLoanInitialInput(LOAN_URL.A, "6.5"));
  const [termRaw, setTermRaw] = useState(useLoanInitialInput(LOAN_URL.T, "5"));
  const [extra, setExtra] = useState(useLoanInitialInput(LOAN_URL.X, "0"));
  const [stepUp, setStepUp] = useState(useLoanInitialInput(LOAN_URL.U, "0"));
  const [advOpen, setAdvOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const amToolId = "loan-amortization-calculator";

  const shareParams = useCallback(
    () => ({
      [LOAN_URL.P]: principal,
      [LOAN_URL.A]: apr,
      [LOAN_URL.T]: termRaw,
      [LOAN_URL.X]: extra,
      [LOAN_URL.U]: stepUp,
    }),
    [principal, apr, termRaw, extra, stepUp],
  );
  useLoanUrlSync(shareParams, [principal, apr, termRaw, extra, stepUp, currency, termMode, bankPennyRounding]);

  useEffect(() => {
    if (!advOpen) return;
    window.setTimeout(() => {
      document.getElementById(`${amToolId}-adv-x`)?.focus();
    }, 0);
  }, [advOpen, amToolId]);

  const formErrorId = `${amToolId}-form-error`;

  const parsed = useMemo(() => {
    const p0 = parsePositive(principal, "Principal");
    const a0 = parseAprPercent(apr, "APR");
    const t0 = parseTermToMonths(termRaw, termMode, "Loan term");
    const ex0 =
      extra.trim() === "" ? { ok: true as const, value: 0 } : parseNonNegative(extra, "Extra principal");
    if (!ex0.ok) return { err: ex0.error };
    const su0 =
      stepUp.trim() === "" ? { ok: true as const, value: 0 } : parseAprPercent(stepUp, "Step-up %");
    if (!su0.ok) return { err: su0.error };

    if (!p0.ok) return { err: p0.error };
    if (!a0.ok) return { err: a0.error };
    if (!t0.ok) return { err: t0.error };

    const termMonths = t0.value;
    const term: LoanTermInput = { termMonths };
    const base = monthlyLoanPayment({ principal: p0.value, annualRatePercent: a0.value, termMonths });
    if ("error" in base) return { err: base.error };

    const contractualEmi = bankPennyRounding ? roundCurrency(base.payment) : base.payment;

    const useSim = ex0.value > 0 || su0.value !== 0;
    const rowsOrErr = useSim
      ? simulateLoanWithOptions({
          principal: p0.value,
          annualRatePercent: a0.value,
          contractualEmi,
          extraPrincipalMonthly: ex0.value,
          stepUpPercentPerYear: su0.value,
          bankPennyRounding,
        })
      : amortizationSchedule(p0.value, a0.value, term, undefined, bankPennyRounding);

    if ("error" in rowsOrErr) return { err: rowsOrErr.error };

    return { err: null as string | null, rows: rowsOrErr as AmortizationRow[], termMonths };
  }, [principal, apr, termRaw, termMode, extra, stepUp, bankPennyRounding]);

  const hint = termMonthsHint(termMode, termRaw);

  const { visibleRows, gapNote } = useMemo(() => {
    if (parsed.err || !parsed.rows?.length) return { visibleRows: [] as AmortizationRow[], gapNote: false };
    const all = parsed.rows;
    if (showAll || all.length <= AMORT_PREVIEW * 2) return { visibleRows: all, gapNote: false };
    const head = all.slice(0, AMORT_PREVIEW);
    const tail = all.slice(-AMORT_PREVIEW);
    if (tail.length && head[head.length - 1]!.month >= tail[0]!.month) {
      return { visibleRows: all, gapNote: false };
    }
    return { visibleRows: [...head, ...tail], gapNote: true };
  }, [parsed, showAll]);

  const fieldInvalid = Boolean(parsed.err);
  const useSimAm =
    (extra.trim() !== "" && Number(extra) > 0) || (stepUp.trim() !== "" && Number(stepUp) !== 0);
  const simTenorMismatchAm =
    !parsed.err &&
    bankPennyRounding &&
    useSimAm &&
    parsed.rows?.length != null &&
    parsed.termMonths != null &&
    parsed.rows.length > parsed.termMonths;

  return (
    <LoanShell
      toolId={amToolId}
      showBankRounding
      getShareSearchParams={shareParams}
      onPrintSchedule={() => window.print()}
      onReset={() => {
        setPrincipal("25000");
        setApr("6.5");
        setTermRaw("5");
        setExtra("0");
        setStepUp("0");
        setAdvOpen(false);
        setShowAll(false);
      }}
      getSummary={() =>
        parsed.err
          ? `Loan amortization — ${parsed.err}`
          : `Loan amortization — ${parsed.rows?.length ?? 0} payments, principal ${principal}, APR ${apr}%, term ${termRaw}${termMode === "years" ? " yr" : " mo"}.`
      }
    >
      <CalculatorShell
        title="Loan amortization calculator"
        description="Month-by-month schedule; optional prepayment or step-up. Export CSV or expand the full table."
        resultKey={`${principal}-${apr}-${termRaw}-${extra}-${stepUp}-${showAll}`}
        compact
        result={
          <div className="space-y-3">
            {parsed.err ? (
              <p id={`${amToolId}-result-error`} role="alert" className="text-sm font-medium text-rose-700">
                {parsed.err}
              </p>
            ) : (
              <>
                {simTenorMismatchAm ? (
                  <p className="rounded-lg border border-amber-500/35 bg-amber-500/10 px-2 py-2 text-xs text-amber-950">
                    Schedule length differs from the original term because prepayment/step-up with penny rounding
                    can add a month to clear the final balance.
                  </p>
                ) : null}
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs text-[var(--muted)]">
                    {parsed.rows?.length ? `${parsed.rows.length} payments` : ""}
                    {gapNote ? " · preview: first & last 24 rows" : ""}
                  </p>
                  {parsed.rows && parsed.rows.length > 0 ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setShowAll((s) => {
                            const next = !s;
                            mwcTrack("loan_amort_preview_toggle", { tool: amToolId, expanded: next });
                            return next;
                          })
                        }
                        className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--text)] hover:border-[var(--accent)]/40"
                      >
                        {showAll ? "Show preview only" : "Show all rows"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          mwcTrack("loan_csv_download", { tool: amToolId });
                          downloadTextFile(
                            "amortization-schedule.csv",
                            `${buildLoanCsvMetadata({
                              principal: Number(principal),
                              aprPercent: Number(apr),
                              termMonths: parsed.termMonths!,
                              currency,
                              extraPrincipalMonthly: Number(extra || 0),
                              stepUpPercentPerYear: Number(stepUp || 0),
                              bankPennyRounding,
                            })}${amortizationRowsToCsv(parsed.rows)}`,
                          );
                        }}
                        className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--accent)] hover:border-[var(--accent)]/40"
                      >
                        Download CSV
                      </button>
                    </>
                  ) : null}
                </div>
                <div
                  id="mwc-loan-amort-table"
                  className="max-h-[28rem] overflow-auto rounded-xl border border-[var(--border)]"
                >
                  {gapNote ? (
                    <p className="border-b border-[var(--border)] bg-[var(--input-bg)]/50 px-3 py-2 text-center text-xs text-[var(--muted)]">
                      … middle months omitted in preview …
                    </p>
                  ) : null}
                  <table className="w-full min-w-[480px] text-left text-xs sm:text-sm">
                    <thead className="sticky top-0 z-[1] border-b border-[var(--border)] bg-[var(--input-bg)]/90 backdrop-blur-sm">
                      <tr>
                        <th className="px-2 py-2 font-semibold text-[var(--text)] sm:px-3">#</th>
                        <th className="px-2 py-2 font-semibold text-[var(--text)] sm:px-3">Payment</th>
                        <th className="px-2 py-2 font-semibold text-[var(--text)] sm:px-3">Principal</th>
                        <th className="px-2 py-2 font-semibold text-[var(--text)] sm:px-3">Interest</th>
                        <th className="px-2 py-2 font-semibold text-[var(--text)] sm:px-3">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleRows.map((r) => (
                        <tr key={r.month} className="border-b border-[var(--border)]/80 last:border-0">
                          <td className="px-2 py-1.5 font-mono text-[var(--text)] sm:px-3">{r.month}</td>
                          <td className="px-2 py-1.5 font-mono text-[var(--muted)] sm:px-3">
                            {formatLoanMoney(r.payment, currency)}
                          </td>
                          <td className="px-2 py-1.5 font-mono text-[var(--muted)] sm:px-3">
                            {formatLoanMoney(r.principal, currency)}
                          </td>
                          <td className="px-2 py-1.5 font-mono text-[var(--muted)] sm:px-3">
                            {formatLoanMoney(r.interest, currency)}
                          </td>
                          <td className="px-2 py-1.5 font-mono text-[var(--muted)] sm:px-3">
                            {formatLoanMoney(r.balance, currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        }
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <FieldLabel htmlFor={`${amToolId}-p`}>Principal</FieldLabel>
            <FieldInput
              id={`${amToolId}-p`}
              inputMode="decimal"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="mt-2"
              aria-invalid={fieldInvalid}
              aria-describedby={fieldInvalid ? formErrorId : undefined}
            />
          </div>
          <div>
            <FieldLabel htmlFor={`${amToolId}-apr`}>APR %</FieldLabel>
            <FieldInput
              id={`${amToolId}-apr`}
              inputMode="decimal"
              value={apr}
              onChange={(e) => setApr(e.target.value)}
              className="mt-2"
              aria-invalid={fieldInvalid}
              aria-describedby={fieldInvalid ? formErrorId : undefined}
            />
          </div>
          <div>
            <FieldLabel htmlFor={`${amToolId}-t`}>{termMode === "years" ? "Term (years)" : "Term (months)"}</FieldLabel>
            <FieldInput
              id={`${amToolId}-t`}
              inputMode="decimal"
              value={termRaw}
              onChange={(e) => setTermRaw(e.target.value)}
              className="mt-2"
              aria-invalid={fieldInvalid}
              aria-describedby={fieldInvalid ? formErrorId : undefined}
            />
            {hint ? <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p> : null}
          </div>
        </div>
        {parsed.err ? (
          <p id={formErrorId} role="alert" className="mt-2 text-sm text-rose-700">
            {parsed.err}
          </p>
        ) : null}

        <div className="mt-4">
          <button
            type="button"
            id={`${amToolId}-adv-toggle`}
            aria-expanded={advOpen}
            aria-controls={`${amToolId}-adv-panel`}
            onClick={() => {
              setAdvOpen((o) => {
                const next = !o;
                if (next) mwcTrack("loan_advanced_open", { tool: amToolId });
                return next;
              });
            }}
            className="text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-bright)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded"
          >
            {advOpen ? "▼ Hide" : "▶"} Advanced: prepayment & step-up (rebuilds schedule)
          </button>
          {advOpen ? (
            <div
              id={`${amToolId}-adv-panel`}
              role="region"
              aria-label="Prepayment and EMI step-up"
              className="mt-3 grid gap-4 sm:grid-cols-2 rounded-xl border border-[var(--border)] bg-[var(--input-bg)]/20 p-4"
            >
              <div>
                <FieldLabel htmlFor={`${amToolId}-adv-x`}>Extra principal / month</FieldLabel>
                <FieldInput
                  id={`${amToolId}-adv-x`}
                  inputMode="decimal"
                  value={extra}
                  onChange={(e) => setExtra(e.target.value)}
                  className="mt-2"
                  placeholder="0"
                  aria-invalid={fieldInvalid}
                  aria-describedby={fieldInvalid ? formErrorId : undefined}
                />
              </div>
              <div>
                <FieldLabel htmlFor={`${amToolId}-adv-su`}>EMI step-up % / year</FieldLabel>
                <FieldInput
                  id={`${amToolId}-adv-su`}
                  inputMode="decimal"
                  value={stepUp}
                  onChange={(e) => setStepUp(e.target.value)}
                  className="mt-2"
                  placeholder="0"
                  aria-invalid={fieldInvalid}
                  aria-describedby={fieldInvalid ? formErrorId : undefined}
                />
              </div>
            </div>
          ) : null}
        </div>
      </CalculatorShell>
    </LoanShell>
  );
}

export function FlatVsReducingInterestCalculator() {
  return <FlatVsReducingBody />;
}

function FlatVsReducingBody() {
  const { currency, termMode, bankPennyRounding } = useLoanCalcPrefs();
  const [principal, setPrincipal] = useState(useLoanInitialInput(LOAN_URL.P, "25000"));
  const [flatPct, setFlatPct] = useState(useLoanInitialInput(LOAN_URL.F, "10"));
  const [reducingApr, setReducingApr] = useState(useLoanInitialInput(LOAN_URL.R, "10"));
  const [termRaw, setTermRaw] = useState(useLoanInitialInput(LOAN_URL.T, "5"));

  const frToolId = "flat-vs-reducing-interest-calculator";

  const shareParams = useCallback(
    () => ({
      [LOAN_URL.P]: principal,
      [LOAN_URL.F]: flatPct,
      [LOAN_URL.R]: reducingApr,
      [LOAN_URL.T]: termRaw,
    }),
    [principal, flatPct, reducingApr, termRaw],
  );
  useLoanUrlSync(shareParams, [principal, flatPct, reducingApr, termRaw, currency, termMode, bankPennyRounding]);

  const parsed = useMemo(() => {
    const p0 = parsePositive(principal, "Principal");
    const f0 = parseAprPercent(flatPct, "Flat rate");
    const r0 = parseAprPercent(reducingApr, "Reducing APR");
    const t0 = parseTermToMonths(termRaw, termMode, "Loan term");
    if (!p0.ok) return { error: p0.error };
    if (!f0.ok) return { error: f0.error };
    if (!r0.ok) return { error: r0.error };
    if (!t0.ok) return { error: t0.error };
    const cmp = compareFlatVsReducing({
      principal: p0.value,
      flatAnnualPercent: f0.value,
      reducingAprPercent: r0.value,
      termMonths: t0.value,
    });
    if ("error" in cmp) return { error: cmp.error };
    return { data: cmp };
  }, [principal, flatPct, reducingApr, termRaw, termMode]);

  const hint = termMonthsHint(termMode, termRaw);
  const fieldInvalid = "error" in parsed;
  const formErrorId = `${frToolId}-form-error`;

  return (
    <LoanShell
      toolId={frToolId}
      getShareSearchParams={shareParams}
      onReset={() => {
        setPrincipal("25000");
        setFlatPct("10");
        setReducingApr("10");
        setTermRaw("5");
      }}
      getSummary={() =>
        "error" in parsed
          ? `Flat vs reducing — ${parsed.error}`
          : `Flat vs reducing — Δ interest ${formatLoanMoney(parsed.data.interestDifference, currency)} (flat minus reducing), Δ total paid ${formatLoanMoney(parsed.data.totalPaidDifference, currency)}. Principal ${principal}, flat ${flatPct}%, reducing ${reducingApr}%.`
      }
    >
      <CalculatorShell
        title="Flat vs reducing interest calculator"
        description="Flat interest on original principal vs reducing-balance APR. Includes equivalent-rate hint and total paid delta."
        resultKey={`${principal}-${flatPct}-${reducingApr}-${termRaw}`}
        result={
          "error" in parsed ? (
            <p id={`${frToolId}-result-error`} role="alert" className="text-sm font-medium text-rose-700">
              {parsed.error}
            </p>
          ) : (
            <div className="space-y-4 text-sm">
              <div className="grid gap-3 border-b border-[var(--border)] pb-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Reducing balance
                </p>
                <div className="flex justify-between gap-2">
                  <span className="text-[var(--muted)]">EMI</span>
                  <span className="font-mono">{formatLoanMoney(parsed.data.reducing.emi, currency)}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[var(--muted)]">Total interest</span>
                  <span className="font-mono">{formatLoanMoney(parsed.data.reducing.totalInterest, currency)}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[var(--muted)]">Total paid</span>
                  <span className="font-mono">{formatLoanMoney(parsed.data.reducing.totalPaid, currency)}</span>
                </div>
              </div>
              <div className="grid gap-3 border-b border-[var(--border)] pb-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Flat rate (simple on principal)
                </p>
                <div className="flex justify-between gap-2">
                  <span className="text-[var(--muted)]">EMI</span>
                  <span className="font-mono">{formatLoanMoney(parsed.data.flat.emi, currency)}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[var(--muted)]">Total interest</span>
                  <span className="font-mono">{formatLoanMoney(parsed.data.flat.totalInterest, currency)}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[var(--muted)]">Total paid</span>
                  <span className="font-mono">{formatLoanMoney(parsed.data.flat.totalPaid, currency)}</span>
                </div>
                {parsed.data.flatEquivalentReducingApr != null ? (
                  <p className="text-xs leading-relaxed text-[var(--muted)]">
                    <span className="font-medium text-[var(--text)]">Flat EMI equivalent</span> as a nominal
                    reducing APR (same payment, amortizing math):{" "}
                    <span className="font-mono text-[var(--text)]">
                      {parsed.data.flatEquivalentReducingApr.toFixed(3)}%
                    </span>
                    . Compare that to the reducing APR column you entered.
                  </p>
                ) : null}
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <p className="text-[var(--muted)]">Δ Total interest (flat − reducing)</p>
                  <p
                    className={`font-mono text-lg font-semibold ${parsed.data.interestDifference > 0 ? "text-amber-700" : "text-emerald-700"}`}
                  >
                    {formatLoanMoney(parsed.data.interestDifference, currency)}
                  </p>
                </div>
                <div>
                  <p className="text-[var(--muted)]">Δ Total paid (flat − reducing)</p>
                  <p
                    className={`font-mono text-lg font-semibold ${parsed.data.totalPaidDifference > 0 ? "text-amber-700" : "text-emerald-700"}`}
                  >
                    {formatLoanMoney(parsed.data.totalPaidDifference, currency)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-[var(--muted)]">
                Positive deltas mean the flat structure costs more than the reducing-balance loan at the stated
                APR. Your lender may define “flat” differently—this uses interest = principal × flat% × (term in
                years).
              </p>
            </div>
          )
        }
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <FieldLabel htmlFor={`${frToolId}-p`}>Principal</FieldLabel>
            <FieldInput
              id={`${frToolId}-p`}
              inputMode="decimal"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="mt-2"
              aria-invalid={fieldInvalid}
              aria-describedby={fieldInvalid ? formErrorId : undefined}
            />
          </div>
          <div>
            <FieldLabel htmlFor={`${frToolId}-flat`}>Flat rate % / year</FieldLabel>
            <FieldInput
              id={`${frToolId}-flat`}
              inputMode="decimal"
              value={flatPct}
              onChange={(e) => setFlatPct(e.target.value)}
              className="mt-2"
              aria-invalid={fieldInvalid}
              aria-describedby={fieldInvalid ? formErrorId : undefined}
            />
          </div>
          <div>
            <FieldLabel htmlFor={`${frToolId}-red`}>Reducing APR %</FieldLabel>
            <FieldInput
              id={`${frToolId}-red`}
              inputMode="decimal"
              value={reducingApr}
              onChange={(e) => setReducingApr(e.target.value)}
              className="mt-2"
              aria-invalid={fieldInvalid}
              aria-describedby={fieldInvalid ? formErrorId : undefined}
            />
          </div>
          <div>
            <FieldLabel htmlFor={`${frToolId}-t`}>{termMode === "years" ? "Term (years)" : "Term (months)"}</FieldLabel>
            <FieldInput
              id={`${frToolId}-t`}
              inputMode="decimal"
              value={termRaw}
              onChange={(e) => setTermRaw(e.target.value)}
              className="mt-2"
              aria-invalid={fieldInvalid}
              aria-describedby={fieldInvalid ? formErrorId : undefined}
            />
            {hint ? <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p> : null}
          </div>
        </div>
        {"error" in parsed ? (
          <p id={formErrorId} role="alert" className="mt-2 text-sm text-rose-700">
            {parsed.error}
          </p>
        ) : null}
        {"error" in parsed ? null : (
          <FlatVsReducingComparisonMini
            currency={currency}
            reducingTotalPaid={parsed.data.reducing.totalPaid}
            reducingInterest={parsed.data.reducing.totalInterest}
            flatTotalPaid={parsed.data.flat.totalPaid}
            flatInterest={parsed.data.flat.totalInterest}
          />
        )}
      </CalculatorShell>
    </LoanShell>
  );
}
