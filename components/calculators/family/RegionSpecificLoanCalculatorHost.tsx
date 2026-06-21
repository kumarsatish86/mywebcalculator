"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { UserLoanBalanceMini } from "@/components/calculator-content/charts/UserLoanBalanceMini";
import { LoanCalculatorChrome } from "@/components/calculators/LoanCalculatorChrome";
import { useLoanCalcPrefs } from "@/components/calculators/LoanCalcPrefsContext";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { LoanToolBar } from "@/components/calculators/LoanToolBar";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { formatLoanMoney } from "@/lib/calculators/loanFormat";
import { parseAprPercent, parseNonNegative, parsePositive, parseTermToMonths, termMonthsHint } from "@/lib/calculators/loanInputParse";
import { computeGstPlusLoan } from "@/lib/calculators/loanRegion";
import { LOAN_URL } from "@/lib/calculators/loanUrlParams";
import { monthlyLoanPayment, type LoanTermInput } from "@/lib/calculators/loanPayment";
import { roundCurrency } from "@/lib/calculators/roundMoney";

type RegionLoanSlug =
  | "home-loan-emi-calculator-india"
  | "personal-loan-emi-calculator-india"
  | "loan-calculator-usa"
  | "mortgage-calculator-uk"
  | "gst-plus-loan-calculator-india";

type RegionConfig = {
  title: string;
  description: string;
  principalDefault: string;
  aprDefault: string;
  termDefault: string;
  paymentLabel: string;
  rateLabel?: string;
  gstLabel?: string;
  gstDefault?: string;
  gstHint?: string;
  downLabel?: string;
  downDefault?: string;
  downHint?: string;
};

const CONFIG: Record<RegionLoanSlug, RegionConfig> = {
  "home-loan-emi-calculator-india": {
    title: "Home loan EMI calculator (India)",
    description: "Estimate monthly EMI, total interest, and repayment for an Indian home loan using reducing-balance amortization.",
    principalDefault: "5000000",
    aprDefault: "8.5",
    termDefault: "20",
    paymentLabel: "Monthly EMI",
    rateLabel: "Interest rate % p.a.",
  },
  "personal-loan-emi-calculator-india": {
    title: "Personal loan EMI calculator (India)",
    description: "Calculate EMI and total cost for a personal loan in India — typical shorter tenures and higher rates than home loans.",
    principalDefault: "500000",
    aprDefault: "14",
    termDefault: "5",
    paymentLabel: "Monthly EMI",
    rateLabel: "Interest rate % p.a.",
  },
  "loan-calculator-usa": {
    title: "Loan calculator (USA)",
    description: "Fixed-rate monthly payment, total interest, and payoff for US auto, personal, or other installment loans.",
    principalDefault: "25000",
    aprDefault: "6.5",
    termDefault: "5",
    paymentLabel: "Monthly payment",
    rateLabel: "APR %",
  },
  "mortgage-calculator-uk": {
    title: "Mortgage calculator (UK)",
    description: "Estimate monthly mortgage payments and total interest for a UK repayment mortgage at a fixed nominal rate.",
    principalDefault: "250000",
    aprDefault: "4.5",
    termDefault: "25",
    paymentLabel: "Monthly mortgage payment",
    rateLabel: "Interest rate % p.a.",
  },
  "gst-plus-loan-calculator-india": {
    title: "GST + loan calculator (India)",
    description: "Add GST to a property or service base price, subtract down payment, and calculate home-loan EMI on the financed amount.",
    principalDefault: "5000000",
    aprDefault: "8.5",
    termDefault: "20",
    paymentLabel: "Monthly EMI",
    rateLabel: "Interest rate % p.a.",
    gstLabel: "GST %",
    gstDefault: "5",
    gstHint: "Use 5% for affordable housing or 12% for standard under-construction property (verify with your builder).",
    downLabel: "Down payment",
    downDefault: "1000000",
    downHint: "Amount paid upfront — loan is on (base + GST − down payment).",
  },
};

export function RegionSpecificLoanCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as RegionLoanSlug] ?? CONFIG["home-loan-emi-calculator-india"];
  const { currency, termMode, bankPennyRounding } = useLoanCalcPrefs();
  const [principal, setPrincipal] = useState(useLoanInitialInput(LOAN_URL.P, config.principalDefault));
  const [apr, setApr] = useState(useLoanInitialInput(LOAN_URL.A, config.aprDefault));
  const [termRaw, setTermRaw] = useState(useLoanInitialInput(LOAN_URL.T, config.termDefault));
  const [gstRate, setGstRate] = useState(useLoanInitialInput(LOAN_URL.R, config.gstDefault ?? "5"));
  const [downPayment, setDownPayment] = useState(useLoanInitialInput(LOAN_URL.X, config.downDefault ?? "0"));

  const shareParams = useCallback(
    () => ({
      [LOAN_URL.P]: principal,
      [LOAN_URL.A]: apr,
      [LOAN_URL.T]: termRaw,
      [LOAN_URL.R]: gstRate,
      [LOAN_URL.X]: downPayment,
    }),
    [principal, apr, termRaw, gstRate, downPayment],
  );
  useLoanUrlSync(shareParams, [principal, apr, termRaw, gstRate, downPayment, currency, termMode, bankPennyRounding]);

  const parsed = useMemo(() => {
    const p0 = parsePositive(principal, slug === "gst-plus-loan-calculator-india" ? "Base amount" : "Principal");
    const a0 = parseAprPercent(apr, config.rateLabel ?? "APR");
    const t0 = parseTermToMonths(termRaw, termMode, "Loan term");
    if (!p0.ok) return { err: p0.error };
    if (!a0.ok) return { err: a0.error };
    if (!t0.ok) return { err: t0.error };

    const term: LoanTermInput = { termMonths: t0.value };
    const slugKey = slug as RegionLoanSlug;

    if (slugKey === "gst-plus-loan-calculator-india") {
      const gst = parseNonNegative(gstRate, "GST rate");
      const down = parseNonNegative(downPayment, "Down payment");
      if (!gst.ok) return { err: gst.error };
      if (!down.ok) return { err: down.error };
      const result = computeGstPlusLoan({
        baseAmount: p0.value,
        gstPercent: gst.value,
        downPayment: down.value,
        apr: a0.value,
        termMonths: t0.value,
        bankPennyRounding,
      });
      if ("error" in result) return { err: result.error };
      return {
        err: null,
        term,
        loanPrincipal: result.loanPrincipal,
        result: {
          headline: formatLoanMoney(result.emi, currency),
          headlineLabel: config.paymentLabel,
          rows: [
            ["GST amount", formatLoanMoney(result.gstAmount, currency)],
            ["Total cost (incl. GST)", formatLoanMoney(result.totalCost, currency)],
            ["Loan amount", formatLoanMoney(result.loanPrincipal, currency)],
            ["Total interest", formatLoanMoney(result.totalInterest, currency)],
            ["Total paid", formatLoanMoney(result.totalPaid, currency)],
          ],
        },
      };
    }

    const loan = monthlyLoanPayment({
      principal: p0.value,
      annualRatePercent: a0.value,
      termMonths: t0.value,
    });
    if ("error" in loan) return { err: loan.error };
    const emi = bankPennyRounding ? roundCurrency(loan.payment) : loan.payment;

    return {
      err: null,
      term,
      loanPrincipal: p0.value,
      result: {
        headline: formatLoanMoney(emi, currency),
        headlineLabel: config.paymentLabel,
        rows: [
          ["Total paid", formatLoanMoney(loan.totalPaid, currency)],
          ["Total interest", formatLoanMoney(loan.totalInterest, currency)],
          ["Term", `${t0.value} months`],
        ],
      },
    };
  }, [principal, apr, termRaw, termMode, gstRate, downPayment, slug, config.paymentLabel, config.rateLabel, currency, bankPennyRounding]);

  const hint = termMonthsHint(termMode, termRaw);
  const fieldInvalid = Boolean(parsed.err);
  const formErrorId = `${slug}-form-error`;
  const result = parsed.err ? null : parsed.result;
  const isGst = slug === "gst-plus-loan-calculator-india";

  return (
    <>
      <LoanCalculatorChrome />
      <CalculatorShell
        title={config.title}
        description={config.description}
        resultKey={`${principal}-${apr}-${termRaw}-${gstRate}-${downPayment}-${currency}-${bankPennyRounding}`}
        toolbar={
          <LoanToolBar
            variant="inline"
            analyticsId={slug}
            showBankRounding
            getShareSearchParams={shareParams}
            onReset={() => {
              setPrincipal(config.principalDefault);
              setApr(config.aprDefault);
              setTermRaw(config.termDefault);
              setGstRate(config.gstDefault ?? "5");
              setDownPayment(config.downDefault ?? "0");
            }}
            getSummary={() =>
              parsed.err || !result
                ? `${config.title}: ${parsed.err}`
                : `${config.title}: ${result.headlineLabel} ${result.headline}.`
            }
          />
        }
        result={
          parsed.err || !result ? (
            <p id={`${slug}-result-error`} className="text-sm font-medium text-rose-700" role="alert">
              {parsed.err}
            </p>
          ) : (
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-[var(--muted)]">{result.headlineLabel}</p>
                <p className="font-mono text-3xl font-semibold text-[var(--accent-bright)]">
                  {result.headline}
                </p>
              </div>
              <div className="grid gap-2 border-t border-[var(--border)] pt-4">
                {result.rows.map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <span className="text-[var(--muted)]">{label}</span>
                    <span className="text-right font-mono text-[var(--text)]">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        }
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <FieldLabel htmlFor={`${slug}-p`}>{isGst ? "Base amount (ex-GST)" : "Loan amount"}</FieldLabel>
            <FieldInput id={`${slug}-p`} inputMode="decimal" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} aria-describedby={fieldInvalid ? formErrorId : undefined} />
          </div>
          <div>
            <FieldLabel htmlFor={`${slug}-apr`}>{config.rateLabel ?? "APR %"}</FieldLabel>
            <FieldInput id={`${slug}-apr`} inputMode="decimal" value={apr} onChange={(e) => setApr(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} aria-describedby={fieldInvalid ? formErrorId : undefined} />
          </div>
          <div>
            <FieldLabel htmlFor={`${slug}-term`}>{termMode === "years" ? "Term (years)" : "Term (months)"}</FieldLabel>
            <FieldInput id={`${slug}-term`} inputMode="decimal" value={termRaw} onChange={(e) => setTermRaw(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} aria-describedby={fieldInvalid ? formErrorId : undefined} />
            {hint ? <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p> : null}
          </div>
        </div>

        {isGst ? (
          <div className="mt-4 grid gap-4 rounded-xl border border-[var(--border)] bg-[var(--input-bg)]/20 p-4 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor={`${slug}-gst`}>{config.gstLabel}</FieldLabel>
              <FieldInput id={`${slug}-gst`} inputMode="decimal" value={gstRate} onChange={(e) => setGstRate(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} aria-describedby={fieldInvalid ? formErrorId : undefined} />
              {config.gstHint ? <p className="mt-1 text-xs text-[var(--muted)]">{config.gstHint}</p> : null}
            </div>
            <div>
              <FieldLabel htmlFor={`${slug}-down`}>{config.downLabel}</FieldLabel>
              <FieldInput id={`${slug}-down`} inputMode="decimal" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} className="mt-2" aria-invalid={fieldInvalid} aria-describedby={fieldInvalid ? formErrorId : undefined} />
              {config.downHint ? <p className="mt-1 text-xs text-[var(--muted)]">{config.downHint}</p> : null}
            </div>
          </div>
        ) : null}

        {parsed.err ? (
          <p id={formErrorId} role="alert" className="mt-2 text-sm text-rose-700">
            {parsed.err}
          </p>
        ) : null}
        {!parsed.err && parsed.term && parsed.loanPrincipal ? (
          <UserLoanBalanceMini
            principal={parsed.loanPrincipal}
            apr={Number(apr)}
            term={parsed.term}
            currency={currency}
            bankPennyRounding={bankPennyRounding}
          />
        ) : null}
      </CalculatorShell>
    </>
  );
}
