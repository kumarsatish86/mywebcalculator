"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import type { AdvancedProCurrencyCode } from "@/lib/calculators/advancedProInvestment";
import {
  ADVANCED_PRO_URL,
  dollarCostAveraging,
  formatAdvancedProMoney,
  investmentFeeImpact,
  moneyWeightedReturn,
  monteCarloInvestment,
  netWorthGrowth,
  rebalancingCalc,
  timeWeightedReturn,
} from "@/lib/calculators/advancedProInvestment";

type ProSlug =
  | "monte-carlo-investment-simulator"
  | "dollar-cost-averaging-calculator"
  | "time-weighted-return-calculator"
  | "money-weighted-return-calculator"
  | "investment-fee-impact-calculator"
  | "rebalancing-calculator"
  | "net-worth-growth-calculator";

type Mode = "monte" | "dca" | "twr" | "mwr" | "fee" | "rebalance" | "networth";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  rDefault: string;
  yDefault: string;
};

const CONFIG: Record<ProSlug, Config> = {
  "monte-carlo-investment-simulator": {
    title: "Monte Carlo investment simulator",
    description:
      "Simulate many random return paths to estimate a range of ending portfolio outcomes (P10 / P50 / P90).",
    mode: "monte",
    aDefault: "500000",
    bDefault: "10000",
    rDefault: "10",
    yDefault: "20",
  },
  "dollar-cost-averaging-calculator": {
    title: "Dollar cost averaging calculator",
    description: "Invest a fixed amount across a sequence of prices and see average cost vs lump-sum at the end.",
    mode: "dca",
    aDefault: "5000",
    bDefault: "100,90,80,95,110",
    rDefault: "10",
    yDefault: "1",
  },
  "time-weighted-return-calculator": {
    title: "Time weighted return calculator",
    description: "Chain period returns into a time-weighted return (TWR), optional annualization.",
    mode: "twr",
    aDefault: "2,-1,3,0.5,-0.5,1.2",
    bDefault: "12",
    rDefault: "10",
    yDefault: "1",
  },
  "money-weighted-return-calculator": {
    title: "Money weighted return calculator",
    description: "Solve money-weighted return (IRR) from initial investment, ending value, and years.",
    mode: "mwr",
    aDefault: "100000",
    bDefault: "180000",
    rDefault: "10",
    yDefault: "5",
  },
  "investment-fee-impact-calculator": {
    title: "Investment fee impact calculator",
    description: "Compare ending wealth with and without an annual expense ratio / fee drag.",
    mode: "fee",
    aDefault: "500000",
    bDefault: "10000",
    rDefault: "10",
    yDefault: "25",
  },
  "rebalancing-calculator": {
    title: "Rebalancing calculator",
    description: "Compute buy/sell amounts to restore target sleeve weights from current values.",
    mode: "rebalance",
    aDefault: "1000000",
    bDefault: "60,30,10",
    rDefault: "10",
    yDefault: "1",
  },
  "net-worth-growth-calculator": {
    title: "Net worth growth calculator",
    description: "Project net worth with annual savings and portfolio return over your horizon.",
    mode: "networth",
    aDefault: "1500000",
    bDefault: "300000",
    rDefault: "8",
    yDefault: "15",
  },
};

const CURRENCIES: AdvancedProCurrencyCode[] = ["INR", "USD", "EUR", "GBP", "CAD", "AUD", "AED"];

const selectCls =
  "mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono text-right">{value}</span>
    </div>
  );
}

export function AdvancedProInvestmentCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as ProSlug] ?? CONFIG["investment-fee-impact-calculator"];
  const [currency, setCurrency] = useState<AdvancedProCurrencyCode>("INR");
  const [a, setA] = useState(useLoanInitialInput(ADVANCED_PRO_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(ADVANCED_PRO_URL.B, config.bDefault));
  const [c, setC] = useState(
    useLoanInitialInput(
      ADVANCED_PRO_URL.C,
      config.mode === "rebalance" ? "650000,250000,100000" : "15",
    ),
  );
  const [r, setR] = useState(useLoanInitialInput(ADVANCED_PRO_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(ADVANCED_PRO_URL.T, "1"));
  const [y, setY] = useState(useLoanInitialInput(ADVANCED_PRO_URL.Y, config.yDefault));
  const [s, setS] = useState(useLoanInitialInput(ADVANCED_PRO_URL.S, "42"));
  const [n, setN] = useState(useLoanInitialInput(ADVANCED_PRO_URL.N, "500"));
  const [p, setP] = useState(useLoanInitialInput(ADVANCED_PRO_URL.P, "12"));

  const fmt = useCallback((nAmt: number) => formatAdvancedProMoney(nAmt, currency), [currency]);
  const pct = (nVal: number) => `${nVal.toFixed(2)}%`;

  const shareParams = useCallback(
    () => ({
      [ADVANCED_PRO_URL.A]: a,
      [ADVANCED_PRO_URL.B]: b,
      [ADVANCED_PRO_URL.C]: c,
      [ADVANCED_PRO_URL.R]: r,
      [ADVANCED_PRO_URL.T]: t,
      [ADVANCED_PRO_URL.Y]: y,
      [ADVANCED_PRO_URL.S]: s,
      [ADVANCED_PRO_URL.N]: n,
      [ADVANCED_PRO_URL.P]: p,
    }),
    [a, b, c, r, t, y, s, n, p],
  );

  useLoanUrlSync(shareParams, [a, b, c, r, t, y, s, n, p]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "monte": {
        const prin = parsePositive(a, "Principal");
        const mean = parseAprPercent(r, "Mean return %");
        const vol = parseAprPercent(c, "Volatility %");
        const years = parsePositive(y, "Years");
        const sims = parsePositive(n, "Simulations");
        const seed = parseNonNegative(s, "Seed");
        const contrib = parseNonNegative(b, "Monthly contribution");
        if (!prin.ok) return { error: prin.error };
        if (!mean.ok) return { error: mean.error };
        if (!vol.ok) return { error: vol.error };
        if (!years.ok) return { error: years.error };
        if (!sims.ok) return { error: sims.error };
        if (!seed.ok) return { error: seed.error };
        if (!contrib.ok) return { error: contrib.error };
        const computed = monteCarloInvestment({
          principal: prin.value,
          annualReturnMeanPercent: mean.value,
          annualVolPercent: vol.value,
          years: years.value,
          simulations: Math.round(sims.value),
          seed: Math.round(seed.value),
          monthlyContribution: contrib.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.p50),
          primaryLabel: "Median ending value (P50)",
          rows: [
            { label: "P10 (pessimistic)", value: fmt(computed.p10) },
            { label: "P50 (median)", value: fmt(computed.p50) },
            { label: "P90 (optimistic)", value: fmt(computed.p90) },
            { label: "Mean ending", value: fmt(computed.meanEnding) },
            { label: "P(above principal)", value: pct(computed.probabilityAbovePrincipal) },
            { label: "Simulations", value: String(computed.simulations) },
          ],
        };
      }
      case "dca": {
        const amt = parsePositive(a, "Amount per period");
        if (!amt.ok) return { error: amt.error };
        const computed = dollarCostAveraging({ amountPerPeriod: amt.value, pricesCsv: b });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.averageCost),
          primaryLabel: "Average cost per share/unit",
          rows: [
            { label: "Periods", value: String(computed.periods) },
            { label: "Total invested", value: fmt(computed.totalInvested) },
            { label: "Units bought", value: computed.totalShares.toFixed(4) },
            { label: "Last price", value: fmt(computed.lastPrice) },
            { label: "Market value", value: fmt(computed.marketValue) },
            { label: "Gain / loss", value: `${fmt(computed.gain)} (${pct(computed.gainPercent)})` },
          ],
        };
      }
      case "twr": {
        const ppy = parsePositive(p, "Periods per year");
        if (!ppy.ok) return { error: ppy.error };
        const computed = timeWeightedReturn({
          periodReturnsCsv: a,
          annualize: true,
          periodsPerYear: ppy.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: pct(computed.twrPercent),
          primaryLabel: "Time-weighted return (total)",
          rows: [
            { label: "Periods", value: String(computed.periods) },
            { label: "TWR (cumulative)", value: pct(computed.twrPercent) },
            {
              label: "Annualized TWR",
              value: computed.annualizedTwrPercent == null ? "—" : pct(computed.annualizedTwrPercent),
            },
          ],
        };
      }
      case "mwr": {
        const inv = parsePositive(a, "Initial investment");
        const end = parseNonNegative(b, "Ending value");
        const years = parsePositive(y, "Years");
        if (!inv.ok) return { error: inv.error };
        if (!end.ok) return { error: end.error };
        if (!years.ok) return { error: years.error };
        const computed = moneyWeightedReturn({
          mode: "simple",
          initialInvestment: inv.value,
          endingValue: end.value,
          years: years.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: pct(computed.mwrAnnualPercent),
          primaryLabel: "Money-weighted return (annual IRR)",
          rows: [
            { label: "Invested", value: fmt(computed.totalInvestedApprox) },
            { label: "Ending value", value: fmt(computed.endingValue) },
            { label: "Annual MWR / IRR", value: pct(computed.mwrAnnualPercent) },
          ],
        };
      }
      case "fee": {
        const prin = parsePositive(a, "Principal");
        const ret = parseAprPercent(r, "Gross return %");
        const fee = parseAprPercent(t, "Annual fee %");
        const years = parsePositive(y, "Years");
        const contrib = parseNonNegative(b, "Monthly contribution");
        if (!prin.ok) return { error: prin.error };
        if (!ret.ok) return { error: ret.error };
        if (!fee.ok) return { error: fee.error };
        if (!years.ok) return { error: years.error };
        if (!contrib.ok) return { error: contrib.error };
        const computed = investmentFeeImpact({
          principal: prin.value,
          annualReturnPercent: ret.value,
          annualFeePercent: fee.value,
          years: years.value,
          monthlyContribution: contrib.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.feeDrag),
          primaryLabel: "Fee drag (wealth lost to fees)",
          rows: [
            { label: "Ending (gross, 0% fee)", value: fmt(computed.endingGross) },
            { label: "Ending (net of fees)", value: fmt(computed.endingNet) },
            { label: "Fee drag", value: fmt(computed.feeDrag) },
            { label: "Fee drag / gross gain", value: pct(computed.feeDragPercentOfGrossGain) },
          ],
        };
      }
      case "rebalance": {
        const port = parsePositive(a, "Portfolio value");
        if (!port.ok) return { error: port.error };
        const computed = rebalancingCalc({
          portfolioValue: port.value,
          targetWeightsCsv: b,
          currentValuesCsv: c,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.totalValue),
          primaryLabel: "Portfolio value used",
          rows: computed.sleeves.flatMap((sleeve) => [
            {
              label: `Sleeve ${sleeve.index} target / current`,
              value: `${pct(sleeve.targetWeightPercent)} / ${pct(sleeve.currentWeightPercent)}`,
            },
            {
              label: `Sleeve ${sleeve.index} ${sleeve.action}`,
              value: fmt(Math.abs(sleeve.tradeAmount)),
            },
          ]),
        };
      }
      case "networth": {
        const start = parseNonNegative(a, "Starting net worth");
        const save = parseNonNegative(b, "Annual savings");
        const ret = parseAprPercent(r, "Return %");
        const years = parsePositive(y, "Years");
        if (!start.ok) return { error: start.error };
        if (!save.ok) return { error: save.error };
        if (!ret.ok) return { error: ret.error };
        if (!years.ok) return { error: years.error };
        const computed = netWorthGrowth({
          startingNetWorth: start.value,
          annualSavings: save.value,
          annualReturnPercent: ret.value,
          years: years.value,
        });
        if ("error" in computed) return { error: computed.error };
        const mid = computed.path[Math.floor(computed.path.length / 2)];
        return {
          primary: fmt(computed.endingNetWorth),
          primaryLabel: "Projected ending net worth",
          rows: [
            { label: "Total savings contributed", value: fmt(computed.totalSavingsContributed) },
            { label: "Growth from returns", value: fmt(computed.growthFromReturns) },
            {
              label: mid ? `Net worth at year ${mid.year}` : "Midpoint",
              value: mid ? fmt(mid.netWorth) : "—",
            },
            { label: "Ending net worth", value: fmt(computed.endingNetWorth) },
          ],
        };
      }
    }
  }, [config.mode, a, b, c, r, t, y, s, n, p, fmt]);

  const showCurrency = config.mode !== "twr";

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {showCurrency ? (
            <div>
              <FieldLabel htmlFor="ap-currency">Currency</FieldLabel>
              <select
                id="ap-currency"
                className={selectCls}
                value={currency}
                onChange={(e) => setCurrency(e.target.value as AdvancedProCurrencyCode)}
              >
                {CURRENCIES.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          {config.mode === "monte" ? (
            <>
              <div>
                <FieldLabel htmlFor="ap-prin">Starting principal</FieldLabel>
                <FieldInput id="ap-prin" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ap-contrib">Monthly contribution</FieldLabel>
                <FieldInput id="ap-contrib" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ap-mean">Expected mean return % / year</FieldLabel>
                <FieldInput id="ap-mean" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ap-vol">Annual volatility %</FieldLabel>
                <FieldInput id="ap-vol" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ap-years">Years</FieldLabel>
                <FieldInput id="ap-years" value={y} onChange={(ev) => setY(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ap-sims">Simulations (10–5000)</FieldLabel>
                <FieldInput id="ap-sims" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="numeric" />
              </div>
              <div>
                <FieldLabel htmlFor="ap-seed">Random seed (reproducible)</FieldLabel>
                <FieldInput id="ap-seed" value={s} onChange={(ev) => setS(ev.target.value)} inputMode="numeric" />
              </div>
            </>
          ) : null}

          {config.mode === "dca" ? (
            <>
              <div>
                <FieldLabel htmlFor="ap-dca-amt">Amount invested each period</FieldLabel>
                <FieldInput id="ap-dca-amt" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ap-prices">Prices (comma-separated)</FieldLabel>
                <FieldInput id="ap-prices" value={b} onChange={(ev) => setB(ev.target.value)} />
              </div>
            </>
          ) : null}

          {config.mode === "twr" ? (
            <>
              <div>
                <FieldLabel htmlFor="ap-rets">Period returns % (comma-separated)</FieldLabel>
                <FieldInput id="ap-rets" value={a} onChange={(ev) => setA(ev.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="ap-ppy">Periods per year (for annualization)</FieldLabel>
                <FieldInput id="ap-ppy" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "mwr" ? (
            <>
              <div>
                <FieldLabel htmlFor="ap-inv">Initial investment</FieldLabel>
                <FieldInput id="ap-inv" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ap-end">Ending value</FieldLabel>
                <FieldInput id="ap-end" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ap-mwr-y">Years</FieldLabel>
                <FieldInput id="ap-mwr-y" value={y} onChange={(ev) => setY(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "fee" ? (
            <>
              <div>
                <FieldLabel htmlFor="ap-fee-prin">Starting principal</FieldLabel>
                <FieldInput id="ap-fee-prin" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ap-fee-contrib">Monthly contribution</FieldLabel>
                <FieldInput
                  id="ap-fee-contrib"
                  value={b}
                  onChange={(ev) => setB(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="ap-fee-ret">Gross annual return %</FieldLabel>
                <FieldInput id="ap-fee-ret" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ap-fee-pct">Annual fee / expense ratio %</FieldLabel>
                <FieldInput id="ap-fee-pct" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ap-fee-y">Years</FieldLabel>
                <FieldInput id="ap-fee-y" value={y} onChange={(ev) => setY(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "rebalance" ? (
            <>
              <div>
                <FieldLabel htmlFor="ap-rb-port">Portfolio value (fallback if values empty)</FieldLabel>
                <FieldInput id="ap-rb-port" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ap-rb-tgt">Target weights % (comma-separated)</FieldLabel>
                <FieldInput id="ap-rb-tgt" value={b} onChange={(ev) => setB(ev.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="ap-rb-cur">Current sleeve values (comma-separated)</FieldLabel>
                <FieldInput id="ap-rb-cur" value={c} onChange={(ev) => setC(ev.target.value)} />
              </div>
            </>
          ) : null}

          {config.mode === "networth" ? (
            <>
              <div>
                <FieldLabel htmlFor="ap-nw-start">Starting net worth</FieldLabel>
                <FieldInput id="ap-nw-start" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ap-nw-save">Annual savings / surplus</FieldLabel>
                <FieldInput id="ap-nw-save" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ap-nw-ret">Expected return % / year</FieldLabel>
                <FieldInput id="ap-nw-ret" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ap-nw-y">Years</FieldLabel>
                <FieldInput id="ap-nw-y" value={y} onChange={(ev) => setY(ev.target.value)} inputMode="decimal" />
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
