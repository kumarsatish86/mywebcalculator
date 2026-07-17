"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import type { CreditScoreHealthCurrencyCode } from "@/lib/calculators/creditScoreHealth";
import {
  CREDIT_SCORE_HEALTH_URL,
  creditLimitRecommendation,
  creditRiskAssessment,
  creditScoreImprovement,
  creditScoreSimulator,
  creditUtilization,
  formatCreditScoreHealthMoney,
  howLongToImproveScore,
  loanEligibilityByScore,
} from "@/lib/calculators/creditScoreHealth";

type ScoreSlug =
  | "credit-score-simulator"
  | "credit-utilization-ratio-calculator"
  | "credit-score-improvement-calculator"
  | "loan-eligibility-based-on-credit-score"
  | "credit-limit-recommendation-calculator"
  | "how-long-to-improve-credit-score-calculator"
  | "credit-risk-assessment-tool";

type Mode =
  | "simulator"
  | "utilization"
  | "improvement"
  | "eligibility"
  | "limitRec"
  | "howLong"
  | "risk";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  rDefault: string;
  tDefault: string;
  mDefault: string;
  yDefault: string;
};

const CONFIG: Record<ScoreSlug, Config> = {
  "credit-score-simulator": {
    title: "Credit score simulator",
    description: "Educational weighted score estimate from payment history, utilization, age, inquiries, and mix.",
    mode: "simulator",
    aDefault: "90",
    bDefault: "0",
    rDefault: "25",
    tDefault: "75",
    mDefault: "2",
    yDefault: "6",
  },
  "credit-utilization-ratio-calculator": {
    title: "Credit utilization ratio calculator",
    description: "Overall utilization from comma-separated card balances and credit limits.",
    mode: "utilization",
    aDefault: "45000,15000",
    bDefault: "150000,50000",
    rDefault: "0",
    tDefault: "0",
    mDefault: "0",
    yDefault: "0",
  },
  "credit-score-improvement-calculator": {
    title: "Credit score improvement calculator",
    description: "Projected score gain from lowering utilization and adding on-time payment months.",
    mode: "improvement",
    aDefault: "680",
    bDefault: "0",
    rDefault: "45",
    tDefault: "20",
    mDefault: "6",
    yDefault: "0",
  },
  "loan-eligibility-based-on-credit-score": {
    title: "Loan eligibility based on credit score",
    description: "Indicative max loan amount tier from score and income—not a lender approval.",
    mode: "eligibility",
    aDefault: "720",
    bDefault: "0",
    rDefault: "80000",
    tDefault: "1500000",
    mDefault: "0",
    yDefault: "0",
  },
  "credit-limit-recommendation-calculator": {
    title: "Credit limit recommendation calculator",
    description: "Suggested total revolving limit from income, score, and existing limits.",
    mode: "limitRec",
    aDefault: "75000",
    bDefault: "120000",
    rDefault: "710",
    tDefault: "0",
    mDefault: "0",
    yDefault: "0",
  },
  "how-long-to-improve-credit-score-calculator": {
    title: "How long to improve credit score calculator",
    description: "Rough months to reach a target score from monthly utilization improvement.",
    mode: "howLong",
    aDefault: "650",
    bDefault: "720",
    rDefault: "2",
    tDefault: "0",
    mDefault: "0",
    yDefault: "0",
  },
  "credit-risk-assessment-tool": {
    title: "Credit risk assessment tool",
    description: "Simple risk score from credit score, utilization, DTI, and recent late payments.",
    mode: "risk",
    aDefault: "690",
    bDefault: "0",
    rDefault: "35",
    tDefault: "38",
    mDefault: "1",
    yDefault: "0",
  },
};

const CURRENCIES: CreditScoreHealthCurrencyCode[] = ["INR", "USD", "EUR", "GBP", "CAD", "AUD", "AED"];

const selectCls =
  "mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

export function CreditScoreHealthCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as ScoreSlug] ?? CONFIG["credit-score-simulator"];
  const [currency, setCurrency] = useState<CreditScoreHealthCurrencyCode>("INR");
  const [a, setA] = useState(useLoanInitialInput(CREDIT_SCORE_HEALTH_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(CREDIT_SCORE_HEALTH_URL.B, config.bDefault));
  const [r, setR] = useState(useLoanInitialInput(CREDIT_SCORE_HEALTH_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(CREDIT_SCORE_HEALTH_URL.T, config.tDefault));
  const [m, setM] = useState(useLoanInitialInput(CREDIT_SCORE_HEALTH_URL.M, config.mDefault));
  const [y, setY] = useState(useLoanInitialInput(CREDIT_SCORE_HEALTH_URL.Y, config.yDefault));

  const fmt = useCallback((n: number) => formatCreditScoreHealthMoney(n, currency), [currency]);
  const pct = (n: number) => `${n.toFixed(1)}%`;

  const shareParams = useCallback(
    () => ({
      [CREDIT_SCORE_HEALTH_URL.A]: a,
      [CREDIT_SCORE_HEALTH_URL.B]: b,
      [CREDIT_SCORE_HEALTH_URL.R]: r,
      [CREDIT_SCORE_HEALTH_URL.T]: t,
      [CREDIT_SCORE_HEALTH_URL.M]: m,
      [CREDIT_SCORE_HEALTH_URL.Y]: y,
    }),
    [a, b, r, t, m, y],
  );

  useLoanUrlSync(shareParams, [a, b, r, t, m, y]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "simulator": {
        const payP = parseAprPercent(a, "Payment history score");
        const utilP = parseAprPercent(r, "Utilization %");
        const ageP = parseNonNegative(y, "Age of credit (years)");
        const inqP = parseNonNegative(m, "Inquiries last year");
        const mixP = parseAprPercent(t, "Credit mix score");
        if (!payP.ok) return { error: payP.error };
        if (!utilP.ok) return { error: utilP.error };
        if (!ageP.ok) return { error: ageP.error };
        if (!inqP.ok) return { error: inqP.error };
        if (!mixP.ok) return { error: mixP.error };
        const computed = creditScoreSimulator({
          paymentHistoryScore: payP.value,
          utilizationPercent: utilP.value,
          ageOfCreditYears: ageP.value,
          inquiriesLastYear: inqP.value,
          mixScore: mixP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: String(computed.estimatedScore),
          primaryLabel: "Estimated score",
          rows: [
            { label: "Band", value: computed.band },
            ...computed.drivers.map((d, i) => ({ label: i === 0 ? "Key driver" : "Note", value: d })),
          ],
        };
      }
      case "utilization": {
        const computed = creditUtilization({ balancesCsv: a, limitsCsv: b });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: pct(computed.utilizationPercent),
          primaryLabel: "Overall utilization",
          rows: [
            { label: "Total balance", value: fmt(computed.totalBalance) },
            { label: "Total limit", value: fmt(computed.totalLimit) },
            { label: "Utilization", value: pct(computed.utilizationPercent) },
            { label: "Band", value: computed.band },
          ],
        };
      }
      case "improvement": {
        const curP = parsePositive(a, "Current score");
        const utilNowP = parseAprPercent(r, "Utilization now %");
        const utilTgtP = parseAprPercent(t, "Utilization target %");
        const monthsP = parseNonNegative(m, "On-time months added");
        if (!curP.ok) return { error: curP.error };
        if (!utilNowP.ok) return { error: utilNowP.error };
        if (!utilTgtP.ok) return { error: utilTgtP.error };
        if (!monthsP.ok) return { error: monthsP.error };
        const computed = creditScoreImprovement({
          currentScore: curP.value,
          utilizationNow: utilNowP.value,
          utilizationTarget: utilTgtP.value,
          onTimeMonthsAdded: monthsP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: String(computed.projectedScore),
          primaryLabel: "Projected score",
          rows: [
            { label: "Current score", value: String(curP.value) },
            { label: "Score gain", value: `+${computed.scoreGain}` },
            { label: "Projected score", value: String(computed.projectedScore) },
            ...computed.tips.map((tip, i) => ({ label: i === 0 ? "Tip" : "Tip", value: tip })),
          ],
        };
      }
      case "eligibility": {
        const scoreP = parsePositive(a, "Credit score");
        const incP = parsePositive(r, "Monthly income");
        const reqP = parsePositive(t, "Requested loan amount");
        if (!scoreP.ok) return { error: scoreP.error };
        if (!incP.ok) return { error: incP.error };
        if (!reqP.ok) return { error: reqP.error };
        const computed = loanEligibilityByScore({
          creditScore: scoreP.value,
          monthlyIncome: incP.value,
          requestedAmount: reqP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.eligible ? "Likely eligible" : "May not qualify",
          primaryLabel: "Indicative eligibility",
          rows: [
            { label: "Tier", value: computed.tier },
            { label: "Max suggested amount", value: fmt(computed.maxSuggestedAmount) },
            { label: "Requested amount", value: fmt(reqP.value) },
            { label: "Note", value: computed.note },
          ],
        };
      }
      case "limitRec": {
        const incP = parsePositive(a, "Monthly income");
        const existP = parseNonNegative(b, "Existing total limits");
        const scoreP = parsePositive(r, "Credit score");
        if (!incP.ok) return { error: incP.error };
        if (!existP.ok) return { error: existP.error };
        if (!scoreP.ok) return { error: scoreP.error };
        const computed = creditLimitRecommendation({
          monthlyIncome: incP.value,
          existingLimits: existP.value,
          creditScore: scoreP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.suggestedTotalLimit),
          primaryLabel: "Suggested total limit",
          rows: [
            { label: "Existing limits", value: fmt(existP.value) },
            { label: "Suggested total", value: fmt(computed.suggestedTotalLimit) },
            { label: "Headroom", value: fmt(computed.headroom) },
          ],
        };
      }
      case "howLong": {
        const curP = parsePositive(a, "Current score");
        const tgtP = parsePositive(b, "Target score");
        const dropP = parseNonNegative(r, "Monthly utilization drop %");
        if (!curP.ok) return { error: curP.error };
        if (!tgtP.ok) return { error: tgtP.error };
        if (!dropP.ok) return { error: dropP.error };
        const computed = howLongToImproveScore({
          currentScore: curP.value,
          targetScore: tgtP.value,
          monthlyUtilizationDropPercent: dropP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${computed.estimatedMonths} months`,
          primaryLabel: "Estimated time to target",
          rows: [
            { label: "Feasible within ~3 years?", value: computed.feasible ? "Yes" : "Stretch goal" },
            { label: "Plan", value: computed.plan },
          ],
        };
      }
      case "risk": {
        const scoreP = parsePositive(a, "Credit score");
        const utilP = parseAprPercent(r, "Utilization %");
        const dtiP = parseAprPercent(t, "DTI %");
        const lateP = parseNonNegative(m, "Late payments last year");
        if (!scoreP.ok) return { error: scoreP.error };
        if (!utilP.ok) return { error: utilP.error };
        if (!dtiP.ok) return { error: dtiP.error };
        if (!lateP.ok) return { error: lateP.error };
        const computed = creditRiskAssessment({
          creditScore: scoreP.value,
          utilizationPercent: utilP.value,
          dtiPercent: dtiP.value,
          latePaymentsLastYear: lateP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.riskBand,
          primaryLabel: "Risk band",
          rows: [
            { label: "Risk score (0–100)", value: String(computed.riskScore) },
            ...computed.factors.map((f, i) => ({ label: i === 0 ? "Factor" : "Factor", value: f })),
          ],
        };
      }
    }
  }, [config.mode, a, b, r, t, m, y, fmt]);

  const showCurrency =
    config.mode === "utilization" || config.mode === "eligibility" || config.mode === "limitRec";

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {showCurrency ? (
            <div>
              <FieldLabel htmlFor="csh-currency">Currency</FieldLabel>
              <select
                id="csh-currency"
                className={selectCls}
                value={currency}
                onChange={(ev) => setCurrency(ev.target.value as CreditScoreHealthCurrencyCode)}
              >
                {CURRENCIES.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          {config.mode === "simulator" && (
            <>
              <div>
                <FieldLabel htmlFor="csh-pay">Payment history score (0–100)</FieldLabel>
                <FieldInput id="csh-pay" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="csh-util">Utilization %</FieldLabel>
                <FieldInput id="csh-util" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="csh-age">Age of credit (years)</FieldLabel>
                <FieldInput id="csh-age" value={y} onChange={(ev) => setY(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="csh-inq">Hard inquiries (last 12 months)</FieldLabel>
                <FieldInput id="csh-inq" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="csh-mix">Credit mix score (0–100)</FieldLabel>
                <FieldInput id="csh-mix" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          )}

          {config.mode === "utilization" && (
            <>
              <div>
                <FieldLabel htmlFor="csh-bal">Balances (comma-separated)</FieldLabel>
                <FieldInput id="csh-bal" value={a} onChange={(ev) => setA(ev.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="csh-lim">Credit limits (comma-separated)</FieldLabel>
                <FieldInput id="csh-lim" value={b} onChange={(ev) => setB(ev.target.value)} />
              </div>
            </>
          )}

          {config.mode === "improvement" && (
            <>
              <div>
                <FieldLabel htmlFor="csh-cur">Current score</FieldLabel>
                <FieldInput id="csh-cur" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="csh-unow">Utilization now %</FieldLabel>
                <FieldInput id="csh-unow" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="csh-utgt">Utilization target %</FieldLabel>
                <FieldInput id="csh-utgt" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="csh-otm">On-time payment months added</FieldLabel>
                <FieldInput id="csh-otm" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          )}

          {config.mode === "eligibility" && (
            <>
              <div>
                <FieldLabel htmlFor="csh-score">Credit score</FieldLabel>
                <FieldInput id="csh-score" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="csh-inc">Monthly income</FieldLabel>
                <FieldInput id="csh-inc" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="csh-req">Requested loan amount</FieldLabel>
                <FieldInput id="csh-req" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          )}

          {config.mode === "limitRec" && (
            <>
              <div>
                <FieldLabel htmlFor="csh-linc">Monthly income</FieldLabel>
                <FieldInput id="csh-linc" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="csh-lex">Existing total credit limits</FieldLabel>
                <FieldInput id="csh-lex" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="csh-lsc">Credit score</FieldLabel>
                <FieldInput id="csh-lsc" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          )}

          {config.mode === "howLong" && (
            <>
              <div>
                <FieldLabel htmlFor="csh-hcur">Current score</FieldLabel>
                <FieldInput id="csh-hcur" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="csh-htgt">Target score</FieldLabel>
                <FieldInput id="csh-htgt" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="csh-hdrop">Monthly utilization drop %</FieldLabel>
                <FieldInput id="csh-hdrop" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          )}

          {config.mode === "risk" && (
            <>
              <div>
                <FieldLabel htmlFor="csh-rscore">Credit score</FieldLabel>
                <FieldInput id="csh-rscore" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="csh-rutil">Utilization %</FieldLabel>
                <FieldInput id="csh-rutil" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="csh-rdti">Debt-to-income %</FieldLabel>
                <FieldInput id="csh-rdti" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="csh-late">Late payments (last 12 months)</FieldLabel>
                <FieldInput id="csh-late" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          )}
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          {"error" in result ? (
            <p className="text-sm text-red-600">{result.error}</p>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[var(--muted)]">{result.primaryLabel}</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">{result.primary}</p>
              </div>
              <div className="space-y-2 text-sm">
                {result.rows.map((row, idx) => (
                  <Row key={`${row.label}-${idx}`} label={row.label} value={row.value} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
