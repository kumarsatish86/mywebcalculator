"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import type { FixedIncomeCurrencyCode } from "@/lib/calculators/fixedIncomeSafe";
import {
  DEFAULT_EPF_RATE,
  DEFAULT_PO_SAVINGS_RATE,
  DEFAULT_PPF_RATE,
  DEFAULT_SCSS_RATE,
  DEFAULT_SSY_RATE,
  FIXED_INCOME_URL,
  epfCalc,
  fixedDeposit,
  formatFixedIncomeMoney,
  npsCalc,
  postOfficeSavings,
  ppfCalc,
  recurringDeposit,
  scssCalc,
  ssyCalc,
  treasuryBillBond,
} from "@/lib/calculators/fixedIncomeSafe";

type FiSlug =
  | "fixed-deposit-fd-calculator"
  | "recurring-deposit-rd-calculator"
  | "ppf-calculator"
  | "epf-calculator"
  | "nps-calculator"
  | "sukanya-samriddhi-yojana-calculator"
  | "senior-citizen-savings-scheme-calculator"
  | "post-office-savings-calculator"
  | "treasury-bill-bond-calculator";

type Mode = "fd" | "rd" | "ppf" | "epf" | "nps" | "ssy" | "scss" | "po" | "tbill";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  amountLabel: string;
  amountDefault: string;
  showRate?: boolean;
  showYears?: boolean;
  showMonths?: boolean;
  showCompounds?: boolean;
  showCoupon?: boolean;
  showPrice?: boolean;
  rateDefault?: string;
  yearsDefault?: string;
  rateLabel?: string;
};

const CONFIG: Record<FiSlug, Config> = {
  "fixed-deposit-fd-calculator": {
    title: "Fixed deposit (FD) calculator",
    description: "Estimate FD maturity value with compounding (default quarterly, as used by many Indian banks).",
    mode: "fd",
    amountLabel: "Deposit amount",
    amountDefault: "100000",
    showRate: true,
    showYears: true,
    showCompounds: true,
    rateDefault: "7",
    yearsDefault: "5",
    rateLabel: "Annual interest rate %",
  },
  "recurring-deposit-rd-calculator": {
    title: "Recurring deposit (RD) calculator",
    description: "Project RD maturity from monthly deposits and bank interest rate.",
    mode: "rd",
    amountLabel: "Monthly deposit",
    amountDefault: "5000",
    showRate: true,
    showMonths: true,
    rateDefault: "6.5",
    rateLabel: "Annual interest rate %",
  },
  "ppf-calculator": {
    title: "PPF calculator",
    description: "Estimate Public Provident Fund maturity from annual deposits (default 15-year tenure).",
    mode: "ppf",
    amountLabel: "Annual deposit",
    amountDefault: "150000",
    showRate: true,
    showYears: true,
    rateDefault: String(DEFAULT_PPF_RATE),
    yearsDefault: "15",
    rateLabel: "PPF interest rate %",
  },
  "epf-calculator": {
    title: "EPF calculator",
    description: "Project Employees' Provident Fund corpus from combined monthly contributions.",
    mode: "epf",
    amountLabel: "Monthly contribution (employee + employer EPF)",
    amountDefault: "3600",
    showRate: true,
    showYears: true,
    rateDefault: String(DEFAULT_EPF_RATE),
    yearsDefault: "20",
    rateLabel: "EPF interest rate %",
  },
  "nps-calculator": {
    title: "NPS calculator",
    description: "Estimate National Pension System corpus and indicative monthly pension from annuity portion.",
    mode: "nps",
    amountLabel: "Monthly contribution",
    amountDefault: "5000",
    showRate: true,
    showYears: true,
    rateDefault: "10",
    yearsDefault: "25",
    rateLabel: "Expected annual return %",
  },
  "sukanya-samriddhi-yojana-calculator": {
    title: "Sukanya Samriddhi Yojana calculator",
    description: "Project SSY maturity—deposits for up to 15 years, account grows to 21 years.",
    mode: "ssy",
    amountLabel: "Annual deposit",
    amountDefault: "100000",
    showRate: true,
    showYears: true,
    rateDefault: String(DEFAULT_SSY_RATE),
    yearsDefault: "21",
    rateLabel: "SSY interest rate %",
  },
  "senior-citizen-savings-scheme-calculator": {
    title: "Senior Citizen Savings Scheme calculator",
    description: "Estimate quarterly interest payouts and total interest over SCSS tenure (principal returned at maturity).",
    mode: "scss",
    amountLabel: "Deposit amount",
    amountDefault: "1000000",
    showRate: true,
    showYears: true,
    rateDefault: String(DEFAULT_SCSS_RATE),
    yearsDefault: "5",
    rateLabel: "SCSS interest rate %",
  },
  "post-office-savings-calculator": {
    title: "Post office savings calculator",
    description: "Simple-interest illustration for a post office savings-style balance over time.",
    mode: "po",
    amountLabel: "Deposit / balance",
    amountDefault: "50000",
    showRate: true,
    showYears: true,
    rateDefault: String(DEFAULT_PO_SAVINGS_RATE),
    yearsDefault: "3",
    rateLabel: "Interest rate %",
  },
  "treasury-bill-bond-calculator": {
    title: "Treasury bill / bond calculator",
    description: "Estimate discount/premium, absolute return, and approximate YTM for a T-bill or coupon bond.",
    mode: "tbill",
    amountLabel: "Face value",
    amountDefault: "100000",
    showPrice: true,
    showYears: true,
    showCoupon: true,
    yearsDefault: "1",
  },
};

const CURRENCIES: FixedIncomeCurrencyCode[] = ["INR", "USD", "EUR", "GBP", "CAD", "AUD", "AED"];

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

export function FixedIncomeSafeCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as FiSlug] ?? CONFIG["fixed-deposit-fd-calculator"];
  const [currency, setCurrency] = useState<FixedIncomeCurrencyCode>("INR");
  const [amount, setAmount] = useState(useLoanInitialInput(FIXED_INCOME_URL.A, config.amountDefault));
  const [rate, setRate] = useState(useLoanInitialInput(FIXED_INCOME_URL.R, config.rateDefault ?? "7"));
  const [years, setYears] = useState(useLoanInitialInput(FIXED_INCOME_URL.Y, config.yearsDefault ?? "5"));
  const [months, setMonths] = useState(useLoanInitialInput(FIXED_INCOME_URL.M, "36"));
  const [compounds, setCompounds] = useState(useLoanInitialInput(FIXED_INCOME_URL.N, "4"));
  const [price, setPrice] = useState(useLoanInitialInput(FIXED_INCOME_URL.P, "95000"));
  const [coupon, setCoupon] = useState(useLoanInitialInput(FIXED_INCOME_URL.T, "0"));

  const fmt = useCallback((n: number) => formatFixedIncomeMoney(n, currency), [currency]);
  const pct = (n: number) => `${n.toFixed(2)}%`;

  const shareParams = useCallback(
    () => ({
      [FIXED_INCOME_URL.A]: amount,
      [FIXED_INCOME_URL.R]: rate,
      [FIXED_INCOME_URL.Y]: years,
      [FIXED_INCOME_URL.M]: months,
      [FIXED_INCOME_URL.N]: compounds,
      [FIXED_INCOME_URL.P]: price,
      [FIXED_INCOME_URL.T]: coupon,
    }),
    [amount, rate, years, months, compounds, price, coupon],
  );

  useLoanUrlSync(shareParams, [amount, rate, years, months, compounds, price, coupon]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "fd": {
        const a = parsePositive(amount, config.amountLabel);
        const r = parseAprPercent(rate, "Interest rate %");
        const y = parsePositive(years, "Years");
        const n = parsePositive(compounds, "Compounds per year");
        if (!a.ok) return { error: a.error };
        if (!r.ok) return { error: r.error };
        if (!y.ok) return { error: y.error };
        if (!n.ok) return { error: n.error };
        const computed = fixedDeposit({
          principal: a.value,
          annualRatePercent: r.value,
          years: y.value,
          compoundsPerYear: n.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.maturityValue),
          primaryLabel: "Maturity value",
          rows: [
            { label: "Principal", value: fmt(computed.principal) },
            { label: "Interest earned", value: fmt(computed.interestEarned) },
            { label: "Maturity value", value: fmt(computed.maturityValue) },
            { label: "Effective annual yield", value: pct(computed.effectiveAnnualYield) },
          ],
        };
      }
      case "rd": {
        const a = parsePositive(amount, config.amountLabel);
        const r = parseAprPercent(rate, "Interest rate %");
        const m = parsePositive(months, "Months");
        if (!a.ok) return { error: a.error };
        if (!r.ok) return { error: r.error };
        if (!m.ok) return { error: m.error };
        const computed = recurringDeposit({
          monthlyDeposit: a.value,
          annualRatePercent: r.value,
          months: Math.round(m.value),
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.maturityValue),
          primaryLabel: "Maturity value",
          rows: [
            { label: "Monthly deposit", value: fmt(computed.monthlyDeposit) },
            { label: "Tenure", value: `${computed.months} months` },
            { label: "Total deposited", value: fmt(computed.totalDeposited) },
            { label: "Interest earned", value: fmt(computed.interestEarned) },
            { label: "Maturity value", value: fmt(computed.maturityValue) },
          ],
        };
      }
      case "ppf": {
        const a = parsePositive(amount, config.amountLabel);
        const r = parseAprPercent(rate, "PPF rate %");
        const y = parsePositive(years, "Years");
        if (!a.ok) return { error: a.error };
        if (!r.ok) return { error: r.error };
        if (!y.ok) return { error: y.error };
        const computed = ppfCalc({ annualDeposit: a.value, annualRatePercent: r.value, years: y.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.maturityValue),
          primaryLabel: "Estimated maturity",
          rows: [
            { label: "Annual deposit", value: fmt(computed.annualDeposit) },
            { label: "Years", value: String(computed.years) },
            { label: "Total deposited", value: fmt(computed.totalDeposited) },
            { label: "Interest earned", value: fmt(computed.interestEarned) },
            { label: "Maturity value", value: fmt(computed.maturityValue) },
          ],
        };
      }
      case "epf": {
        const a = parsePositive(amount, config.amountLabel);
        const r = parseAprPercent(rate, "EPF rate %");
        const y = parsePositive(years, "Years");
        if (!a.ok) return { error: a.error };
        if (!r.ok) return { error: r.error };
        if (!y.ok) return { error: y.error };
        const computed = epfCalc({
          monthlyContribution: a.value,
          annualRatePercent: r.value,
          years: y.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.maturityValue),
          primaryLabel: "Projected EPF corpus",
          rows: [
            { label: "Monthly contribution", value: fmt(computed.monthlyContribution) },
            { label: "Total contributed", value: fmt(computed.totalContributed) },
            { label: "Interest earned", value: fmt(computed.interestEarned) },
            { label: "Projected corpus", value: fmt(computed.maturityValue) },
          ],
        };
      }
      case "nps": {
        const a = parsePositive(amount, config.amountLabel);
        const r = parseAprPercent(rate, "Expected return %");
        const y = parsePositive(years, "Years");
        if (!a.ok) return { error: a.error };
        if (!r.ok) return { error: r.error };
        if (!y.ok) return { error: y.error };
        const computed = npsCalc({
          monthlyContribution: a.value,
          annualRatePercent: r.value,
          years: y.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.retirementCorpus),
          primaryLabel: "Retirement corpus",
          rows: [
            { label: "Total contributed", value: fmt(computed.totalContributed) },
            { label: "Retirement corpus", value: fmt(computed.retirementCorpus) },
            { label: "Lump sum (60%)", value: fmt(computed.lumpSum) },
            { label: "Annuity corpus (40%)", value: fmt(computed.annuityCorpus) },
            { label: "Est. monthly pension", value: fmt(computed.estimatedMonthlyPension) },
          ],
        };
      }
      case "ssy": {
        const a = parsePositive(amount, config.amountLabel);
        const r = parseAprPercent(rate, "SSY rate %");
        const y = parsePositive(years, "Years");
        if (!a.ok) return { error: a.error };
        if (!r.ok) return { error: r.error };
        if (!y.ok) return { error: y.error };
        const computed = ssyCalc({ annualDeposit: a.value, annualRatePercent: r.value, years: y.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.maturityValue),
          primaryLabel: "Estimated maturity (age 21)",
          rows: [
            { label: "Annual deposit", value: fmt(computed.annualDeposit) },
            { label: "Account years", value: String(computed.years) },
            { label: "Total deposited", value: fmt(computed.totalDeposited) },
            { label: "Interest earned", value: fmt(computed.interestEarned) },
            { label: "Maturity value", value: fmt(computed.maturityValue) },
          ],
        };
      }
      case "scss": {
        const a = parsePositive(amount, config.amountLabel);
        const r = parseAprPercent(rate, "SCSS rate %");
        const y = parsePositive(years, "Years");
        if (!a.ok) return { error: a.error };
        if (!r.ok) return { error: r.error };
        if (!y.ok) return { error: y.error };
        const computed = scssCalc({
          principal: a.value,
          annualRatePercent: r.value,
          years: y.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.quarterlyInterest),
          primaryLabel: "Quarterly interest payout",
          rows: [
            { label: "Principal", value: fmt(computed.principal) },
            { label: "Annual interest", value: fmt(computed.annualInterest) },
            { label: "Quarterly payout", value: fmt(computed.quarterlyInterest) },
            { label: "Total interest over tenure", value: fmt(computed.totalInterestOverTenure) },
            { label: "Principal at maturity", value: fmt(computed.maturityPrincipal) },
          ],
        };
      }
      case "po": {
        const a = parsePositive(amount, config.amountLabel);
        const r = parseAprPercent(rate, "Interest rate %");
        const y = parsePositive(years, "Years");
        if (!a.ok) return { error: a.error };
        if (!r.ok) return { error: r.error };
        if (!y.ok) return { error: y.error };
        const computed = postOfficeSavings({
          principal: a.value,
          annualRatePercent: r.value,
          years: y.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.maturityValue),
          primaryLabel: "Maturity value",
          rows: [
            { label: "Principal", value: fmt(computed.principal) },
            { label: "Interest earned", value: fmt(computed.interestEarned) },
            { label: "Maturity value", value: fmt(computed.maturityValue) },
          ],
        };
      }
      case "tbill": {
        const face = parsePositive(amount, config.amountLabel);
        const p = parsePositive(price, "Purchase price");
        const y = parsePositive(years, "Years to maturity");
        const c = parseNonNegative(coupon, "Coupon %");
        if (!face.ok) return { error: face.error };
        if (!p.ok) return { error: p.error };
        if (!y.ok) return { error: y.error };
        if (!c.ok) return { error: c.error };
        const computed = treasuryBillBond({
          faceValue: face.value,
          purchasePrice: p.value,
          yearsToMaturity: y.value,
          couponPercent: c.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: pct(computed.ytmApproxPercent),
          primaryLabel: "Approx. YTM",
          rows: [
            { label: "Face value", value: fmt(computed.faceValue) },
            { label: "Purchase price", value: fmt(computed.purchasePrice) },
            { label: "Discount / (premium)", value: fmt(computed.discountOrPremium) },
            { label: "Total coupons", value: fmt(computed.totalCoupons) },
            { label: "Maturity proceeds", value: fmt(computed.maturityProceeds) },
            { label: "Absolute return", value: pct(computed.absoluteReturnPercent) },
            { label: "Approx. YTM", value: pct(computed.ytmApproxPercent) },
          ],
        };
      }
      default:
        return { error: "Unknown calculator mode." };
    }
  }, [amount, compounds, config, coupon, fmt, months, price, rate, years]);

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
            <p className="text-xs text-[var(--muted)]">
              Rates are editable planning defaults—confirm current notified rates with your bank, EPFO, or India Post.
            </p>
          </div>
        )
      }
    >
      <div className="mb-4">
        <FieldLabel htmlFor="currency">Currency</FieldLabel>
        <select
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value as FixedIncomeCurrencyCode)}
          className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:max-w-xs"
        >
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="amount">{config.amountLabel}</FieldLabel>
          <FieldInput id="amount" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-2" />
        </div>

        {config.showPrice ? (
          <div>
            <FieldLabel htmlFor="price">Purchase price</FieldLabel>
            <FieldInput id="price" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-2" />
          </div>
        ) : null}

        {config.showRate ? (
          <div>
            <FieldLabel htmlFor="rate">{config.rateLabel ?? "Interest rate %"}</FieldLabel>
            <FieldInput id="rate" inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} className="mt-2" />
          </div>
        ) : null}

        {config.showCoupon ? (
          <div>
            <FieldLabel htmlFor="coupon">Annual coupon % (0 for T-bill)</FieldLabel>
            <FieldInput id="coupon" inputMode="decimal" value={coupon} onChange={(e) => setCoupon(e.target.value)} className="mt-2" />
          </div>
        ) : null}

        {config.showYears ? (
          <div>
            <FieldLabel htmlFor="years">{config.mode === "tbill" ? "Years to maturity" : "Years"}</FieldLabel>
            <FieldInput id="years" inputMode="decimal" value={years} onChange={(e) => setYears(e.target.value)} className="mt-2" />
          </div>
        ) : null}

        {config.showMonths ? (
          <div>
            <FieldLabel htmlFor="months">Tenure (months)</FieldLabel>
            <FieldInput id="months" inputMode="decimal" value={months} onChange={(e) => setMonths(e.target.value)} className="mt-2" />
          </div>
        ) : null}

        {config.showCompounds ? (
          <div>
            <FieldLabel htmlFor="compounds">Compounds per year</FieldLabel>
            <FieldInput id="compounds" inputMode="decimal" value={compounds} onChange={(e) => setCompounds(e.target.value)} className="mt-2" />
            <p className="mt-1 text-xs text-[var(--muted)]">4 = quarterly (common for Indian FDs)</p>
          </div>
        ) : null}
      </div>
    </CalculatorShell>
  );
}
