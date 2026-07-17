"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import type { CapGainRegime, TaxRealReturnCurrencyCode } from "@/lib/calculators/taxRealReturn";
import {
  DEFAULT_80C_LIMIT,
  DEFAULT_INDIA_LTCG,
  DEFAULT_INDIA_STCG,
  DEFAULT_LTCG_EXEMPTION,
  TAX_REAL_RETURN_URL,
  afterTaxReturn,
  capitalGainsTax,
  elssCalc,
  formatTaxRealMoney,
  inflationVsReturn,
  realRateOfReturn,
  taxSavingInvestment,
} from "@/lib/calculators/taxRealReturn";

type TaxSlug =
  | "capital-gains-tax-calculator-india-global"
  | "tax-saving-investment-calculator"
  | "elss-calculator"
  | "after-tax-return-calculator"
  | "real-rate-of-return-calculator"
  | "inflation-vs-return-calculator";

type Mode = "capGain" | "taxSave" | "elss" | "afterTax" | "realReturn" | "inflationVs";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  yDefault: string;
  rDefault: string;
  tDefault: string;
};

const CONFIG: Record<TaxSlug, Config> = {
  "capital-gains-tax-calculator-india-global": {
    title: "Capital gains tax calculator (India + Global)",
    description:
      "Estimate capital gains tax for India equity STCG/LTCG planning rates or a simple global flat rate.",
    mode: "capGain",
    aDefault: "100000",
    bDefault: "250000",
    yDefault: "2",
    rDefault: "12",
    tDefault: String(DEFAULT_INDIA_LTCG),
  },
  "tax-saving-investment-calculator": {
    title: "Tax saving investment calculator",
    description: "See tax saved and net cost when investing under an annual limit (e.g. Section 80C-style).",
    mode: "taxSave",
    aDefault: "150000",
    bDefault: String(DEFAULT_80C_LIMIT),
    yDefault: "1",
    rDefault: "12",
    tDefault: "30",
  },
  "elss-calculator": {
    title: "ELSS calculator",
    description: "Project ELSS SIP growth and approximate first-year 80C tax benefit (3-year lock-in noted).",
    mode: "elss",
    aDefault: "12500",
    bDefault: String(DEFAULT_80C_LIMIT),
    yDefault: "5",
    rDefault: "12",
    tDefault: "30",
  },
  "after-tax-return-calculator": {
    title: "After-tax return calculator",
    description: "Convert a pre-tax return into an after-tax return at your marginal tax rate.",
    mode: "afterTax",
    aDefault: "100000",
    bDefault: "150000",
    yDefault: "1",
    rDefault: "10",
    tDefault: "20",
  },
  "real-rate-of-return-calculator": {
    title: "Real rate of return calculator",
    description: "Adjust nominal return for inflation: real ≈ (1 + nominal) ÷ (1 + inflation) − 1.",
    mode: "realReturn",
    aDefault: "100000",
    bDefault: "150000",
    yDefault: "1",
    rDefault: "12",
    tDefault: "30",
  },
  "inflation-vs-return-calculator": {
    title: "Inflation vs return calculator",
    description: "Compare nominal wealth growth with real purchasing power over your investment horizon.",
    mode: "inflationVs",
    aDefault: "100000",
    bDefault: "150000",
    yDefault: "10",
    rDefault: "12",
    tDefault: "30",
  },
};

const CURRENCIES: TaxRealReturnCurrencyCode[] = ["INR", "USD", "EUR", "GBP", "CAD", "AUD", "AED"];

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

export function TaxRealReturnCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as TaxSlug] ?? CONFIG["after-tax-return-calculator"];
  const [currency, setCurrency] = useState<TaxRealReturnCurrencyCode>("INR");
  const [a, setA] = useState(useLoanInitialInput(TAX_REAL_RETURN_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(TAX_REAL_RETURN_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(TAX_REAL_RETURN_URL.C, String(DEFAULT_INDIA_STCG)));
  const [r, setR] = useState(useLoanInitialInput(TAX_REAL_RETURN_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(TAX_REAL_RETURN_URL.T, config.tDefault));
  const [y, setY] = useState(useLoanInitialInput(TAX_REAL_RETURN_URL.Y, config.yDefault));
  const [i, setI] = useState(useLoanInitialInput(TAX_REAL_RETURN_URL.I, "5"));
  const [m, setM] = useState<CapGainRegime>(
    (useLoanInitialInput(TAX_REAL_RETURN_URL.M, "india-equity") as CapGainRegime) || "india-equity",
  );
  const [g, setG] = useState(useLoanInitialInput(TAX_REAL_RETURN_URL.G, String(DEFAULT_LTCG_EXEMPTION)));
  const [h, setH] = useState(useLoanInitialInput(TAX_REAL_RETURN_URL.H, "15"));

  const fmt = useCallback((n: number) => formatTaxRealMoney(n, currency), [currency]);
  const pct = (n: number) => `${n.toFixed(2)}%`;

  const shareParams = useCallback(
    () => ({
      [TAX_REAL_RETURN_URL.A]: a,
      [TAX_REAL_RETURN_URL.B]: b,
      [TAX_REAL_RETURN_URL.C]: c,
      [TAX_REAL_RETURN_URL.R]: r,
      [TAX_REAL_RETURN_URL.T]: t,
      [TAX_REAL_RETURN_URL.Y]: y,
      [TAX_REAL_RETURN_URL.I]: i,
      [TAX_REAL_RETURN_URL.M]: m,
      [TAX_REAL_RETURN_URL.G]: g,
      [TAX_REAL_RETURN_URL.H]: h,
    }),
    [a, b, c, r, t, y, i, m, g, h],
  );

  useLoanUrlSync(shareParams, [a, b, c, r, t, y, i, m, g, h]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "capGain": {
        const buyP = parsePositive(a, "Buy / cost value");
        const sellP = parseNonNegative(b, "Sell value");
        const holdP = parseNonNegative(y, "Holding years");
        const stcgP = parseAprPercent(c, "STCG rate %");
        const ltcgP = parseAprPercent(t, "LTCG rate %");
        const exP = parseNonNegative(g, "LTCG exemption");
        const flatP = parseAprPercent(h, "Flat tax rate %");
        if (!buyP.ok) return { error: buyP.error };
        if (!sellP.ok) return { error: sellP.error };
        if (!holdP.ok) return { error: holdP.error };
        if (!stcgP.ok) return { error: stcgP.error };
        if (!ltcgP.ok) return { error: ltcgP.error };
        if (!exP.ok) return { error: exP.error };
        if (!flatP.ok) return { error: flatP.error };
        const computed = capitalGainsTax({
          buyValue: buyP.value,
          sellValue: sellP.value,
          holdingYears: holdP.value,
          regime: m,
          stcgRatePercent: stcgP.value,
          ltcgRatePercent: ltcgP.value,
          ltcgExemption: exP.value,
          flatTaxRatePercent: flatP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.taxEstimate),
          primaryLabel: "Estimated tax",
          rows: [
            { label: "Regime", value: computed.regimeLabel },
            { label: "Holding", value: computed.isLongTerm ? "Long-term" : "Short-term" },
            { label: "Capital gain", value: fmt(computed.gain) },
            { label: "Taxable gain", value: fmt(computed.taxableGain) },
            { label: "Estimated tax", value: fmt(computed.taxEstimate) },
            { label: "After-tax gain", value: fmt(computed.netProceeds) },
            { label: "Effective tax on gain", value: pct(computed.effectiveTaxRatePercent) },
          ],
        };
      }
      case "taxSave": {
        const invP = parseNonNegative(a, "Investment amount");
        const taxP = parseAprPercent(t, "Marginal tax rate %");
        const limP = parsePositive(b, "Annual limit");
        if (!invP.ok) return { error: invP.error };
        if (!taxP.ok) return { error: taxP.error };
        if (!limP.ok) return { error: limP.error };
        const computed = taxSavingInvestment({
          investmentAmount: invP.value,
          marginalTaxRatePercent: taxP.value,
          annualLimit: limP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.taxSaved),
          primaryLabel: "Tax saved",
          rows: [
            { label: "Eligible amount", value: fmt(computed.eligibleAmount) },
            { label: "Tax saved", value: fmt(computed.taxSaved) },
            { label: "Unused limit", value: fmt(computed.unusedLimit) },
            { label: "Net cost of investment", value: fmt(computed.netCostOfInvestment) },
          ],
        };
      }
      case "elss": {
        const sipP = parsePositive(a, "Monthly SIP");
        const yearsP = parsePositive(y, "Years");
        const retP = parseAprPercent(r, "Expected return %");
        const taxP = parseAprPercent(t, "Marginal tax rate %");
        if (!sipP.ok) return { error: sipP.error };
        if (!yearsP.ok) return { error: yearsP.error };
        if (!retP.ok) return { error: retP.error };
        if (!taxP.ok) return { error: taxP.error };
        const computed = elssCalc({
          monthlySip: sipP.value,
          years: yearsP.value,
          expectedReturnPercent: retP.value,
          marginalTaxRatePercent: taxP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.maturityValue),
          primaryLabel: "Projected maturity value",
          rows: [
            { label: "Total invested", value: fmt(computed.totalInvested) },
            { label: "Projected gains", value: fmt(computed.gains) },
            { label: "Maturity value", value: fmt(computed.maturityValue) },
            { label: "Annual invest (80C cap)", value: fmt(computed.annualInvestFor80c) },
            { label: "First-year tax saved (approx)", value: fmt(computed.firstYearTaxSaved) },
            { label: "Lock-in", value: computed.lockInNote },
          ],
        };
      }
      case "afterTax": {
        const preP = parseAprPercent(r, "Pre-tax return %");
        const taxP = parseAprPercent(t, "Tax rate %");
        if (!preP.ok) return { error: preP.error };
        if (!taxP.ok) return { error: taxP.error };
        const computed = afterTaxReturn({
          preTaxReturnPercent: preP.value,
          taxRatePercent: taxP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: pct(computed.afterTaxReturnPercent),
          primaryLabel: "After-tax return",
          rows: [
            { label: "Pre-tax return", value: pct(computed.preTaxReturnPercent) },
            { label: "Tax rate", value: pct(computed.taxRatePercent) },
            { label: "After-tax return", value: pct(computed.afterTaxReturnPercent) },
            { label: "Tax drag", value: pct(computed.taxDragPercent) },
          ],
        };
      }
      case "realReturn": {
        const nomP = parseAprPercent(r, "Nominal return %");
        const infP = parseAprPercent(i, "Inflation %");
        if (!nomP.ok) return { error: nomP.error };
        if (!infP.ok) return { error: infP.error };
        const computed = realRateOfReturn({
          nominalReturnPercent: nomP.value,
          inflationPercent: infP.value,
        });
        return {
          primary: pct(computed.realReturnPercent),
          primaryLabel: "Real rate of return",
          rows: [
            { label: "Nominal return", value: pct(computed.nominalReturnPercent) },
            { label: "Inflation", value: pct(computed.inflationPercent) },
            { label: "Real return", value: pct(computed.realReturnPercent) },
          ],
        };
      }
      case "inflationVs": {
        const prinP = parsePositive(a, "Principal");
        const nomP = parseAprPercent(r, "Nominal return %");
        const infP = parseAprPercent(i, "Inflation %");
        const yearsP = parsePositive(y, "Years");
        if (!prinP.ok) return { error: prinP.error };
        if (!nomP.ok) return { error: nomP.error };
        if (!infP.ok) return { error: infP.error };
        if (!yearsP.ok) return { error: yearsP.error };
        const computed = inflationVsReturn({
          principal: prinP.value,
          nominalReturnPercent: nomP.value,
          inflationPercent: infP.value,
          years: yearsP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.realFutureValue),
          primaryLabel: "Real future value (today's purchasing power)",
          rows: [
            { label: "Principal", value: fmt(computed.principal) },
            { label: "Nominal future value", value: fmt(computed.nominalFutureValue) },
            { label: "Real future value", value: fmt(computed.realFutureValue) },
            {
              label: "Purchasing-power gap (nominal FV vs today's money)",
              value: fmt(computed.purchasingPowerLoss),
            },
            { label: "Real return / year", value: pct(computed.realReturnPercent) },
            { label: "Nominal gain", value: fmt(computed.nominalGain) },
          ],
        };
      }
    }
  }, [config.mode, a, b, c, r, t, y, i, m, g, h, fmt]);

  const showCurrency =
    config.mode === "capGain" ||
    config.mode === "taxSave" ||
    config.mode === "elss" ||
    config.mode === "inflationVs";

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {showCurrency ? (
            <div>
              <FieldLabel htmlFor="trr-currency">Currency</FieldLabel>
              <select
                id="trr-currency"
                className={selectCls}
                value={currency}
                onChange={(e) => setCurrency(e.target.value as TaxRealReturnCurrencyCode)}
              >
                {CURRENCIES.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          {config.mode === "capGain" ? (
            <>
              <div>
                <FieldLabel htmlFor="trr-regime">Tax regime</FieldLabel>
                <select
                  id="trr-regime"
                  className={selectCls}
                  value={m}
                  onChange={(e) => setM(e.target.value as CapGainRegime)}
                >
                  <option value="india-equity">India equity (STCG / LTCG)</option>
                  <option value="global-flat">Global flat rate</option>
                </select>
              </div>
              <div>
                <FieldLabel htmlFor="trr-buy">Buy / cost value</FieldLabel>
                <FieldInput id="trr-buy" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="trr-sell">Sell value</FieldLabel>
                <FieldInput id="trr-sell" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="trr-hold">Holding period (years)</FieldLabel>
                <FieldInput id="trr-hold" value={y} onChange={(ev) => setY(ev.target.value)} inputMode="decimal" />
              </div>
              {m === "india-equity" ? (
                <>
                  <div>
                    <FieldLabel htmlFor="trr-stcg">STCG rate %</FieldLabel>
                    <FieldInput id="trr-stcg" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
                  </div>
                  <div>
                    <FieldLabel htmlFor="trr-ltcg">LTCG rate %</FieldLabel>
                    <FieldInput id="trr-ltcg" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
                  </div>
                  <div>
                    <FieldLabel htmlFor="trr-ex">LTCG exemption (annual)</FieldLabel>
                    <FieldInput id="trr-ex" value={g} onChange={(ev) => setG(ev.target.value)} inputMode="decimal" />
                  </div>
                </>
              ) : (
                <div>
                  <FieldLabel htmlFor="trr-flat">Flat capital gains tax %</FieldLabel>
                  <FieldInput id="trr-flat" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" />
                </div>
              )}
            </>
          ) : null}

          {config.mode === "taxSave" ? (
            <>
              <div>
                <FieldLabel htmlFor="trr-invest">Investment amount</FieldLabel>
                <FieldInput id="trr-invest" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="trr-tax">Marginal tax rate %</FieldLabel>
                <FieldInput id="trr-tax" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="trr-limit">Annual deduction limit</FieldLabel>
                <FieldInput id="trr-limit" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "elss" ? (
            <>
              <div>
                <FieldLabel htmlFor="trr-sip">Monthly SIP</FieldLabel>
                <FieldInput id="trr-sip" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="trr-years">Investment years</FieldLabel>
                <FieldInput id="trr-years" value={y} onChange={(ev) => setY(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="trr-ret">Expected return % / year</FieldLabel>
                <FieldInput id="trr-ret" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="trr-elss-tax">Marginal tax rate % (80C benefit)</FieldLabel>
                <FieldInput id="trr-elss-tax" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "afterTax" ? (
            <>
              <div>
                <FieldLabel htmlFor="trr-pre">Pre-tax return %</FieldLabel>
                <FieldInput id="trr-pre" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="trr-atr-tax">Tax rate on returns %</FieldLabel>
                <FieldInput id="trr-atr-tax" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "realReturn" ? (
            <>
              <div>
                <FieldLabel htmlFor="trr-nom">Nominal return %</FieldLabel>
                <FieldInput id="trr-nom" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="trr-inf">Inflation %</FieldLabel>
                <FieldInput id="trr-inf" value={i} onChange={(ev) => setI(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "inflationVs" ? (
            <>
              <div>
                <FieldLabel htmlFor="trr-prin">Principal</FieldLabel>
                <FieldInput id="trr-prin" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="trr-nom2">Nominal return % / year</FieldLabel>
                <FieldInput id="trr-nom2" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="trr-inf2">Inflation % / year</FieldLabel>
                <FieldInput id="trr-inf2" value={i} onChange={(ev) => setI(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="trr-yrs2">Years</FieldLabel>
                <FieldInput id="trr-yrs2" value={y} onChange={(ev) => setY(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}
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
                {result.rows.map((row) => (
                  <Row key={row.label} label={row.label} value={row.value} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
