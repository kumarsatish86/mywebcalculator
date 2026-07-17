"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import type { RiskPortfolioCurrencyCode, RiskProfile } from "@/lib/calculators/riskPortfolioAnalysis";
import {
  RISK_PORTFOLIO_URL,
  assetAllocation,
  betaCalc,
  drawdownFromCsv,
  formatRiskMoney,
  portfolioDiversification,
  riskTolerance,
  sharpeRatio,
  volatilityFromCsv,
} from "@/lib/calculators/riskPortfolioAnalysis";

type RiskSlug =
  | "asset-allocation-calculator"
  | "portfolio-diversification-calculator"
  | "risk-tolerance-calculator"
  | "sharpe-ratio-calculator"
  | "beta-calculator"
  | "volatility-calculator"
  | "drawdown-calculator";

type Mode = "allocation" | "diversify" | "tolerance" | "sharpe" | "beta" | "volatility" | "drawdown";

type Config = { title: string; description: string; mode: Mode };

const CONFIG: Record<RiskSlug, Config> = {
  "asset-allocation-calculator": {
    title: "Asset allocation calculator",
    description: "Suggest equity / debt / gold / cash mix from age and risk profile, optionally sized to portfolio value.",
    mode: "allocation",
  },
  "portfolio-diversification-calculator": {
    title: "Portfolio diversification calculator",
    description: "Measure concentration with the Herfindahl–Hirschman Index (HHI) from holding weights.",
    mode: "diversify",
  },
  "risk-tolerance-calculator": {
    title: "Risk tolerance calculator",
    description: "Score risk capacity from age, time horizon, income stability, and loss comfort.",
    mode: "tolerance",
  },
  "sharpe-ratio-calculator": {
    title: "Sharpe ratio calculator",
    description: "Compute risk-adjusted return: (portfolio return − risk-free rate) ÷ volatility.",
    mode: "sharpe",
  },
  "beta-calculator": {
    title: "Beta calculator",
    description: "Estimate beta from asset volatility, market volatility, and correlation with the market.",
    mode: "beta",
  },
  "volatility-calculator": {
    title: "Volatility calculator",
    description: "Calculate sample standard deviation of period returns and optional annualized volatility.",
    mode: "volatility",
  },
  "drawdown-calculator": {
    title: "Drawdown calculator",
    description: "Find maximum peak-to-trough drawdown from a series of portfolio values.",
    mode: "drawdown",
  },
};

const CURRENCIES: RiskPortfolioCurrencyCode[] = ["INR", "USD", "EUR", "GBP", "CAD", "AUD", "AED"];
const PROFILES: { id: RiskProfile; label: string }[] = [
  { id: "conservative", label: "Conservative" },
  { id: "moderate", label: "Moderate" },
  { id: "aggressive", label: "Aggressive" },
];

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

export function RiskPortfolioAnalysisCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as RiskSlug] ?? CONFIG["asset-allocation-calculator"];
  const [currency, setCurrency] = useState<RiskPortfolioCurrencyCode>("INR");
  const [age, setAge] = useState(useLoanInitialInput(RISK_PORTFOLIO_URL.A, "35"));
  const [profile, setProfile] = useState<RiskProfile>(
    (useLoanInitialInput(RISK_PORTFOLIO_URL.P, "moderate") as RiskProfile) || "moderate",
  );
  const [portfolioValue, setPortfolioValue] = useState(useLoanInitialInput(RISK_PORTFOLIO_URL.B, "1000000"));
  const [w1, setW1] = useState(useLoanInitialInput(RISK_PORTFOLIO_URL.C, "40"));
  const [w2, setW2] = useState(useLoanInitialInput(RISK_PORTFOLIO_URL.D, "30"));
  const [w3, setW3] = useState(useLoanInitialInput(RISK_PORTFOLIO_URL.E, "20"));
  const [w4, setW4] = useState(useLoanInitialInput(RISK_PORTFOLIO_URL.F, "10"));
  const [years, setYears] = useState(useLoanInitialInput(RISK_PORTFOLIO_URL.Y, "15"));
  const [stability, setStability] = useState(useLoanInitialInput(RISK_PORTFOLIO_URL.S, "4"));
  const [maxLoss, setMaxLoss] = useState(useLoanInitialInput(RISK_PORTFOLIO_URL.G, "25"));
  const [portReturn, setPortReturn] = useState(useLoanInitialInput(RISK_PORTFOLIO_URL.R, "12"));
  const [riskFree, setRiskFree] = useState(useLoanInitialInput(RISK_PORTFOLIO_URL.H, "6"));
  const [vol, setVol] = useState(useLoanInitialInput(RISK_PORTFOLIO_URL.V, "15"));
  const [assetVol, setAssetVol] = useState(useLoanInitialInput(RISK_PORTFOLIO_URL.T, "20"));
  const [mktVol, setMktVol] = useState(useLoanInitialInput(RISK_PORTFOLIO_URL.MV, "15"));
  const [corr, setCorr] = useState(useLoanInitialInput(RISK_PORTFOLIO_URL.CR, "0.85"));
  const [returnsCsv, setReturnsCsv] = useState(
    useLoanInitialInput(RISK_PORTFOLIO_URL.RC, "2, -1, 3, 0.5, -0.5, 1.2, -2, 2.5"),
  );
  const [ppy, setPpy] = useState(useLoanInitialInput(RISK_PORTFOLIO_URL.PY, "12"));
  const [valuesCsv, setValuesCsv] = useState(
    useLoanInitialInput(RISK_PORTFOLIO_URL.VC, "100000, 120000, 110000, 95000, 105000, 130000"),
  );

  const fmt = useCallback((n: number) => formatRiskMoney(n, currency), [currency]);
  const pct = (n: number) => `${n.toFixed(2)}%`;

  const shareParams = useCallback(
    () => ({
      [RISK_PORTFOLIO_URL.A]: age,
      [RISK_PORTFOLIO_URL.P]: profile,
      [RISK_PORTFOLIO_URL.B]: portfolioValue,
      [RISK_PORTFOLIO_URL.C]: w1,
      [RISK_PORTFOLIO_URL.D]: w2,
      [RISK_PORTFOLIO_URL.E]: w3,
      [RISK_PORTFOLIO_URL.F]: w4,
      [RISK_PORTFOLIO_URL.Y]: years,
      [RISK_PORTFOLIO_URL.S]: stability,
      [RISK_PORTFOLIO_URL.G]: maxLoss,
      [RISK_PORTFOLIO_URL.R]: portReturn,
      [RISK_PORTFOLIO_URL.H]: riskFree,
      [RISK_PORTFOLIO_URL.V]: vol,
      [RISK_PORTFOLIO_URL.T]: assetVol,
      [RISK_PORTFOLIO_URL.MV]: mktVol,
      [RISK_PORTFOLIO_URL.CR]: corr,
      [RISK_PORTFOLIO_URL.RC]: returnsCsv,
      [RISK_PORTFOLIO_URL.PY]: ppy,
      [RISK_PORTFOLIO_URL.VC]: valuesCsv,
    }),
    [
      age,
      profile,
      portfolioValue,
      w1,
      w2,
      w3,
      w4,
      years,
      stability,
      maxLoss,
      portReturn,
      riskFree,
      vol,
      assetVol,
      mktVol,
      corr,
      returnsCsv,
      ppy,
      valuesCsv,
    ],
  );

  useLoanUrlSync(shareParams, [
    age,
    profile,
    portfolioValue,
    w1,
    w2,
    w3,
    w4,
    years,
    stability,
    maxLoss,
    portReturn,
    riskFree,
    vol,
    assetVol,
    mktVol,
    corr,
    returnsCsv,
    ppy,
    valuesCsv,
  ]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "allocation": {
        const ageP = parsePositive(age, "Age");
        const val = parseNonNegative(portfolioValue, "Portfolio value");
        if (!ageP.ok) return { error: ageP.error };
        if (!val.ok) return { error: val.error };
        const computed = assetAllocation({
          age: ageP.value,
          riskProfile: profile,
          portfolioValue: val.value > 0 ? val.value : undefined,
        });
        if ("error" in computed) return { error: computed.error };
        const rows = [
          { label: "Equity", value: pct(computed.mix.equity) },
          { label: "Debt", value: pct(computed.mix.debt) },
          { label: "Gold", value: pct(computed.mix.gold) },
          { label: "Cash", value: pct(computed.mix.cash) },
          { label: "Age-rule equity hint", value: pct(computed.ageBasedEquity) },
        ];
        if (computed.amounts) {
          rows.push(
            { label: "Equity amount", value: fmt(computed.amounts.equity) },
            { label: "Debt amount", value: fmt(computed.amounts.debt) },
            { label: "Gold amount", value: fmt(computed.amounts.gold) },
            { label: "Cash amount", value: fmt(computed.amounts.cash) },
          );
        }
        return {
          primary: pct(computed.mix.equity),
          primaryLabel: "Suggested equity allocation",
          rows,
        };
      }
      case "diversify": {
        const a = parseNonNegative(w1, "Weight A");
        const b = parseNonNegative(w2, "Weight B");
        const c = parseNonNegative(w3, "Weight C");
        const d = parseNonNegative(w4, "Weight D");
        if (!a.ok) return { error: a.error };
        if (!b.ok) return { error: b.error };
        if (!c.ok) return { error: c.error };
        if (!d.ok) return { error: d.error };
        const computed = portfolioDiversification({
          weightA: a.value,
          weightB: b.value,
          weightC: c.value,
          weightD: d.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.concentration,
          primaryLabel: "Concentration level",
          rows: [
            { label: "HHI", value: computed.hhi.toFixed(3) },
            { label: "Effective # holdings", value: computed.effectiveHoldings.toFixed(2) },
            ...computed.weights.map((w, i) => ({
              label: `Normalized weight ${i + 1}`,
              value: pct(w),
            })),
          ],
        };
      }
      case "tolerance": {
        const ageP = parsePositive(age, "Age");
        const y = parseNonNegative(years, "Years until goal");
        const stab = parsePositive(stability, "Income stability");
        const loss = parseNonNegative(maxLoss, "Max loss %");
        if (!ageP.ok) return { error: ageP.error };
        if (!y.ok) return { error: y.error };
        if (!stab.ok) return { error: stab.error };
        if (!loss.ok) return { error: loss.error };
        const computed = riskTolerance({
          age: ageP.value,
          yearsUntilGoal: y.value,
          incomeStability: stab.value,
          maxLossPercentComfortable: loss.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: String(computed.score),
          primaryLabel: `Risk score · ${computed.profile}`,
          rows: [
            { label: "Score (0–100)", value: String(computed.score) },
            { label: "Profile", value: computed.profile },
            { label: "Suggested equity %", value: pct(computed.suggestedEquityPercent) },
          ],
        };
      }
      case "sharpe": {
        const pr = parseAprPercent(portReturn, "Portfolio return %");
        const rf = parseAprPercent(riskFree, "Risk-free %");
        const v = parsePositive(vol, "Volatility %");
        if (!pr.ok) return { error: pr.error };
        if (!rf.ok) return { error: rf.error };
        if (!v.ok) return { error: v.error };
        const computed = sharpeRatio({
          portfolioReturnPercent: pr.value,
          riskFreePercent: rf.value,
          volatilityPercent: v.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.sharpe.toFixed(2),
          primaryLabel: `Sharpe ratio · ${computed.grade}`,
          rows: [
            { label: "Excess return", value: pct(computed.excessReturnPercent) },
            { label: "Sharpe ratio", value: computed.sharpe.toFixed(2) },
            { label: "Grade", value: computed.grade },
          ],
        };
      }
      case "beta": {
        const av = parseNonNegative(assetVol, "Asset volatility %");
        const mv = parsePositive(mktVol, "Market volatility %");
        const cr = Number(corr);
        if (!av.ok) return { error: av.error };
        if (!mv.ok) return { error: mv.error };
        if (!Number.isFinite(cr)) return { error: "Correlation must be a number." };
        const computed = betaCalc({
          assetVolatilityPercent: av.value,
          marketVolatilityPercent: mv.value,
          correlation: cr,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.beta.toFixed(2),
          primaryLabel: "Estimated beta",
          rows: [
            { label: "Beta", value: computed.beta.toFixed(2) },
            { label: "Interpretation", value: computed.interpretation },
          ],
        };
      }
      case "volatility": {
        const periods = parsePositive(ppy, "Periods per year");
        if (!periods.ok) return { error: periods.error };
        const computed = volatilityFromCsv(returnsCsv, periods.value);
        if ("error" in computed) return { error: computed.error };
        return {
          primary: pct(computed.stdDevPercent),
          primaryLabel: "Period volatility (std. dev.)",
          rows: [
            { label: "Observations", value: String(computed.count) },
            { label: "Mean return", value: pct(computed.meanReturnPercent) },
            { label: "Std. deviation", value: pct(computed.stdDevPercent) },
            {
              label: "Annualized volatility",
              value:
                computed.annualizedVolatilityPercent !== null
                  ? pct(computed.annualizedVolatilityPercent)
                  : "—",
            },
          ],
        };
      }
      case "drawdown": {
        const computed = drawdownFromCsv(valuesCsv);
        if ("error" in computed) return { error: computed.error };
        return {
          primary: pct(computed.maxDrawdownPercent),
          primaryLabel: "Maximum drawdown",
          rows: [
            { label: "Max drawdown", value: pct(computed.maxDrawdownPercent) },
            { label: "Peak value", value: fmt(computed.peakValue) },
            { label: "Trough value", value: fmt(computed.troughValue) },
            { label: "Gain needed to recover", value: pct(computed.recoveryNeededPercent) },
          ],
        };
      }
      default:
        return { error: "Unknown calculator mode." };
    }
  }, [
    age,
    assetVol,
    config,
    corr,
    fmt,
    maxLoss,
    mktVol,
    portfolioValue,
    portReturn,
    ppy,
    profile,
    returnsCsv,
    riskFree,
    stability,
    valuesCsv,
    vol,
    w1,
    w2,
    w3,
    w4,
    years,
  ]);

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
              Educational portfolio math—not a recommendation to buy or sell securities.
            </p>
          </div>
        )
      }
    >
      {(config.mode === "allocation" || config.mode === "drawdown") && (
        <div className="mb-4">
          <FieldLabel htmlFor="currency">Currency</FieldLabel>
          <select
            id="currency"
            value={currency}
            onChange={(ev) => setCurrency(ev.target.value as RiskPortfolioCurrencyCode)}
            className={`${selectCls} sm:max-w-xs`}
          >
            {CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {config.mode === "allocation" ? (
          <>
            <div>
              <FieldLabel htmlFor="age">Age</FieldLabel>
              <FieldInput id="age" inputMode="decimal" value={age} onChange={(ev) => setAge(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="profile">Risk profile</FieldLabel>
              <select
                id="profile"
                value={profile}
                onChange={(ev) => setProfile(ev.target.value as RiskProfile)}
                className={selectCls}
              >
                {PROFILES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FieldLabel htmlFor="pv">Portfolio value (optional)</FieldLabel>
              <FieldInput
                id="pv"
                inputMode="decimal"
                value={portfolioValue}
                onChange={(ev) => setPortfolioValue(ev.target.value)}
                className="mt-2"
              />
            </div>
          </>
        ) : null}

        {config.mode === "diversify" ? (
          <>
            <div>
              <FieldLabel htmlFor="w1">Holding A weight %</FieldLabel>
              <FieldInput id="w1" inputMode="decimal" value={w1} onChange={(ev) => setW1(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="w2">Holding B weight %</FieldLabel>
              <FieldInput id="w2" inputMode="decimal" value={w2} onChange={(ev) => setW2(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="w3">Holding C weight % (0 to skip)</FieldLabel>
              <FieldInput id="w3" inputMode="decimal" value={w3} onChange={(ev) => setW3(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="w4">Holding D weight % (0 to skip)</FieldLabel>
              <FieldInput id="w4" inputMode="decimal" value={w4} onChange={(ev) => setW4(ev.target.value)} className="mt-2" />
            </div>
          </>
        ) : null}

        {config.mode === "tolerance" ? (
          <>
            <div>
              <FieldLabel htmlFor="age">Age</FieldLabel>
              <FieldInput id="age" inputMode="decimal" value={age} onChange={(ev) => setAge(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="years">Years until primary goal</FieldLabel>
              <FieldInput id="years" inputMode="decimal" value={years} onChange={(ev) => setYears(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="stab">Income stability (1–5)</FieldLabel>
              <FieldInput id="stab" inputMode="decimal" value={stability} onChange={(ev) => setStability(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="loss">Max portfolio loss you can tolerate %</FieldLabel>
              <FieldInput id="loss" inputMode="decimal" value={maxLoss} onChange={(ev) => setMaxLoss(ev.target.value)} className="mt-2" />
            </div>
          </>
        ) : null}

        {config.mode === "sharpe" ? (
          <>
            <div>
              <FieldLabel htmlFor="pr">Portfolio return %</FieldLabel>
              <FieldInput id="pr" inputMode="decimal" value={portReturn} onChange={(ev) => setPortReturn(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="rf">Risk-free rate %</FieldLabel>
              <FieldInput id="rf" inputMode="decimal" value={riskFree} onChange={(ev) => setRiskFree(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="vol">Volatility (std. dev.) %</FieldLabel>
              <FieldInput id="vol" inputMode="decimal" value={vol} onChange={(ev) => setVol(ev.target.value)} className="mt-2" />
            </div>
          </>
        ) : null}

        {config.mode === "beta" ? (
          <>
            <div>
              <FieldLabel htmlFor="av">Asset volatility %</FieldLabel>
              <FieldInput id="av" inputMode="decimal" value={assetVol} onChange={(ev) => setAssetVol(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="mv">Market volatility %</FieldLabel>
              <FieldInput id="mv" inputMode="decimal" value={mktVol} onChange={(ev) => setMktVol(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="cr">Correlation with market (−1 to 1)</FieldLabel>
              <FieldInput id="cr" inputMode="decimal" value={corr} onChange={(ev) => setCorr(ev.target.value)} className="mt-2" />
            </div>
          </>
        ) : null}

        {config.mode === "volatility" ? (
          <>
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="rc">Period returns % (comma-separated)</FieldLabel>
              <FieldInput
                id="rc"
                inputMode="text"
                value={returnsCsv}
                onChange={(ev) => setReturnsCsv(ev.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <FieldLabel htmlFor="py">Periods per year (12 = monthly)</FieldLabel>
              <FieldInput id="py" inputMode="decimal" value={ppy} onChange={(ev) => setPpy(ev.target.value)} className="mt-2" />
            </div>
          </>
        ) : null}

        {config.mode === "drawdown" ? (
          <div className="sm:col-span-2">
            <FieldLabel htmlFor="vc">Portfolio values over time (comma-separated)</FieldLabel>
            <FieldInput
              id="vc"
              inputMode="text"
              value={valuesCsv}
              onChange={(ev) => setValuesCsv(ev.target.value)}
              className="mt-2"
            />
          </div>
        ) : null}
      </div>
    </CalculatorShell>
  );
}
