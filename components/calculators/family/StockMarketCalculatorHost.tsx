"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import type { StockMarketCurrencyCode } from "@/lib/calculators/stockMarket";
import {
  STOCK_MARKET_URL,
  brokerageCalc,
  capitalGainEquity,
  dividendReinvestment,
  dividendYield,
  formatStockMoney,
  intradayPnL,
  portfolioReturn,
  riskVsReturn,
  stockAverage,
  stockCagr,
  stockReturn,
} from "@/lib/calculators/stockMarket";

type StockSlug =
  | "stock-return-calculator"
  | "cagr-for-stocks-calculator"
  | "dividend-yield-calculator"
  | "dividend-reinvestment-calculator"
  | "stock-average-calculator"
  | "intraday-profit-loss-calculator"
  | "brokerage-calculator"
  | "capital-gain-calculator-equity"
  | "portfolio-return-calculator"
  | "risk-vs-return-calculator";

type Mode =
  | "return"
  | "cagr"
  | "divYield"
  | "drip"
  | "average"
  | "intraday"
  | "brokerage"
  | "capGain"
  | "portfolio"
  | "risk";

type Config = {
  title: string;
  description: string;
  mode: Mode;
};

const CONFIG: Record<StockSlug, Config> = {
  "stock-return-calculator": {
    title: "Stock return calculator",
    description: "Measure absolute profit/loss and return % from buy price, sell price, quantity, and dividends.",
    mode: "return",
  },
  "cagr-for-stocks-calculator": {
    title: "CAGR for stocks calculator",
    description: "Calculate compound annual growth rate between purchase value and current (or sell) value.",
    mode: "cagr",
  },
  "dividend-yield-calculator": {
    title: "Dividend yield calculator",
    description: "Compute dividend yield from annual dividend per share and current share price.",
    mode: "divYield",
  },
  "dividend-reinvestment-calculator": {
    title: "Dividend reinvestment calculator",
    description: "Project share count and portfolio value when dividends are reinvested (DRIP) with price growth.",
    mode: "drip",
  },
  "stock-average-calculator": {
    title: "Stock average calculator",
    description: "Find your average buy price after two purchase lots (buy average / averaging up-down).",
    mode: "average",
  },
  "intraday-profit-loss-calculator": {
    title: "Intraday profit/loss calculator",
    description: "Estimate same-day P&L after brokerage on buy and sell turnover.",
    mode: "intraday",
  },
  "brokerage-calculator": {
    title: "Brokerage calculator",
    description: "Break down equity brokerage, STT, exchange charges, and GST on a round-trip trade.",
    mode: "brokerage",
  },
  "capital-gain-calculator-equity": {
    title: "Capital gain calculator (equity)",
    description: "Estimate STCG vs LTCG tax on equity (planning rates: STCG 20%, LTCG 12.5% above ₹1.25L exemption).",
    mode: "capGain",
  },
  "portfolio-return-calculator": {
    title: "Portfolio return calculator",
    description: "Weight 2–3 holdings by value to get overall portfolio return and ending value.",
    mode: "portfolio",
  },
  "risk-vs-return-calculator": {
    title: "Risk vs return calculator",
    description: "Compare excess return over risk-free rate to volatility (Sharpe-like ratio).",
    mode: "risk",
  },
};

const CURRENCIES: StockMarketCurrencyCode[] = ["INR", "USD", "EUR", "GBP", "CAD", "AUD", "AED"];

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

export function StockMarketCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as StockSlug] ?? CONFIG["stock-return-calculator"];
  const [currency, setCurrency] = useState<StockMarketCurrencyCode>("INR");
  const [a, setA] = useState(useLoanInitialInput(STOCK_MARKET_URL.A, "100"));
  const [b, setB] = useState(useLoanInitialInput(STOCK_MARKET_URL.B, "120"));
  const [c, setC] = useState(useLoanInitialInput(STOCK_MARKET_URL.C, "10"));
  const [d, setD] = useState(useLoanInitialInput(STOCK_MARKET_URL.D, "0"));
  const [e, setE] = useState(useLoanInitialInput(STOCK_MARKET_URL.E, "5"));
  const [g, setG] = useState(useLoanInitialInput(STOCK_MARKET_URL.G, "10"));
  const [h, setH] = useState(useLoanInitialInput(STOCK_MARKET_URL.H, "5"));
  const [y, setY] = useState(useLoanInitialInput(STOCK_MARKET_URL.Y, "5"));
  const [p, setP] = useState(useLoanInitialInput(STOCK_MARKET_URL.P, "0.05"));
  const [r, setR] = useState(useLoanInitialInput(STOCK_MARKET_URL.R, "6"));
  const [s, setS] = useState(useLoanInitialInput(STOCK_MARKET_URL.S, "12"));
  const [t, setT] = useState(useLoanInitialInput(STOCK_MARKET_URL.T, "15"));

  const fmt = useCallback((n: number) => formatStockMoney(n, currency), [currency]);
  const pct = (n: number) => `${n.toFixed(2)}%`;

  const shareParams = useCallback(
    () => ({
      [STOCK_MARKET_URL.A]: a,
      [STOCK_MARKET_URL.B]: b,
      [STOCK_MARKET_URL.C]: c,
      [STOCK_MARKET_URL.D]: d,
      [STOCK_MARKET_URL.E]: e,
      [STOCK_MARKET_URL.G]: g,
      [STOCK_MARKET_URL.H]: h,
      [STOCK_MARKET_URL.Y]: y,
      [STOCK_MARKET_URL.P]: p,
      [STOCK_MARKET_URL.R]: r,
      [STOCK_MARKET_URL.S]: s,
      [STOCK_MARKET_URL.T]: t,
    }),
    [a, b, c, d, e, g, h, y, p, r, s, t],
  );

  useLoanUrlSync(shareParams, [a, b, c, d, e, g, h, y, p, r, s, t]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "return": {
        const buy = parsePositive(a, "Buy price");
        const sell = parseNonNegative(b, "Sell price");
        const qty = parsePositive(c, "Quantity");
        const div = parseNonNegative(d, "Dividend per share");
        if (!buy.ok) return { error: buy.error };
        if (!sell.ok) return { error: sell.error };
        if (!qty.ok) return { error: qty.error };
        if (!div.ok) return { error: div.error };
        const computed = stockReturn({
          buyPrice: buy.value,
          sellPrice: sell.value,
          quantity: qty.value,
          dividendsPerShare: div.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: pct(computed.returnPercent),
          primaryLabel: "Total return",
          rows: [
            { label: "Invested", value: fmt(computed.invested) },
            { label: "Sale proceeds", value: fmt(computed.proceeds) },
            { label: "Dividends", value: fmt(computed.dividendIncome) },
            { label: "Absolute P&L", value: fmt(computed.absoluteProfit) },
            { label: "Return %", value: pct(computed.returnPercent) },
          ],
        };
      }
      case "cagr": {
        const init = parsePositive(a, "Initial value");
        const fin = parsePositive(b, "Final value");
        const years = parsePositive(y, "Years");
        if (!init.ok) return { error: init.error };
        if (!fin.ok) return { error: fin.error };
        if (!years.ok) return { error: years.error };
        const computed = stockCagr({
          initialValue: init.value,
          finalValue: fin.value,
          years: years.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: pct(computed.cagrPercent),
          primaryLabel: "CAGR",
          rows: [
            { label: "Initial value", value: fmt(computed.initialValue) },
            { label: "Final value", value: fmt(computed.finalValue) },
            { label: "Years", value: String(computed.years) },
            { label: "Absolute return", value: pct(computed.absoluteReturnPercent) },
            { label: "CAGR", value: pct(computed.cagrPercent) },
          ],
        };
      }
      case "divYield": {
        const div = parseNonNegative(a, "Annual dividend / share");
        const price = parsePositive(b, "Share price");
        if (!div.ok) return { error: div.error };
        if (!price.ok) return { error: price.error };
        const computed = dividendYield({
          annualDividendPerShare: div.value,
          sharePrice: price.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: pct(computed.yieldPercent),
          primaryLabel: "Dividend yield",
          rows: [
            { label: "Annual dividend / share", value: fmt(computed.annualDividendPerShare) },
            { label: "Share price", value: fmt(computed.sharePrice) },
            { label: "Yield", value: pct(computed.yieldPercent) },
          ],
        };
      }
      case "drip": {
        const shares = parsePositive(a, "Initial shares");
        const price = parsePositive(b, "Share price");
        const div = parseNonNegative(c, "Annual dividend / share");
        const years = parsePositive(y, "Years");
        const growth = parseAprPercent(d, "Price growth %");
        if (!shares.ok) return { error: shares.error };
        if (!price.ok) return { error: price.error };
        if (!div.ok) return { error: div.error };
        if (!years.ok) return { error: years.error };
        if (!growth.ok) return { error: growth.error };
        const computed = dividendReinvestment({
          initialShares: shares.value,
          sharePrice: price.value,
          annualDividendPerShare: div.value,
          years: years.value,
          priceGrowthPercent: growth.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.endingValue),
          primaryLabel: "Ending portfolio value",
          rows: [
            { label: "Ending shares", value: computed.endingShares.toFixed(2) },
            { label: "Dividends reinvested", value: fmt(computed.dividendsReinvested) },
            { label: "Ending value", value: fmt(computed.endingValue) },
            { label: "Total return", value: pct(computed.totalReturnPercent) },
          ],
        };
      }
      case "average": {
        const q1 = parsePositive(a, "Quantity 1");
        const p1 = parsePositive(b, "Price 1");
        const q2 = parsePositive(c, "Quantity 2");
        const p2 = parsePositive(d, "Price 2");
        if (!q1.ok) return { error: q1.error };
        if (!p1.ok) return { error: p1.error };
        if (!q2.ok) return { error: q2.error };
        if (!p2.ok) return { error: p2.error };
        const computed = stockAverage({
          qty1: q1.value,
          price1: p1.value,
          qty2: q2.value,
          price2: p2.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.averagePrice),
          primaryLabel: "Average buy price",
          rows: [
            { label: "Total shares", value: String(computed.totalShares) },
            { label: "Total cost", value: fmt(computed.totalCost) },
            { label: "Average price", value: fmt(computed.averagePrice) },
          ],
        };
      }
      case "intraday": {
        const buy = parsePositive(a, "Buy price");
        const sell = parseNonNegative(b, "Sell price");
        const qty = parsePositive(c, "Quantity");
        const brok = parseAprPercent(p, "Brokerage %");
        const other = parseNonNegative(d, "Other charges");
        if (!buy.ok) return { error: buy.error };
        if (!sell.ok) return { error: sell.error };
        if (!qty.ok) return { error: qty.error };
        if (!brok.ok) return { error: brok.error };
        if (!other.ok) return { error: other.error };
        const computed = intradayPnL({
          buyPrice: buy.value,
          sellPrice: sell.value,
          quantity: qty.value,
          brokeragePercent: brok.value,
          otherCharges: other.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.netPnL),
          primaryLabel: "Net P&L",
          rows: [
            { label: "Gross P&L", value: fmt(computed.grossPnL) },
            { label: "Total charges", value: fmt(computed.totalCharges) },
            { label: "Net P&L", value: fmt(computed.netPnL) },
            { label: "Return on capital", value: pct(computed.returnPercent) },
          ],
        };
      }
      case "brokerage": {
        const buy = parsePositive(a, "Buy value");
        const sell = parsePositive(b, "Sell value");
        const brok = parseAprPercent(p, "Brokerage %");
        if (!buy.ok) return { error: buy.error };
        if (!sell.ok) return { error: sell.error };
        if (!brok.ok) return { error: brok.error };
        const computed = brokerageCalc({
          buyValue: buy.value,
          sellValue: sell.value,
          brokeragePercent: brok.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.totalCharges),
          primaryLabel: "Total charges",
          rows: [
            { label: "Brokerage", value: fmt(computed.brokerage) },
            { label: "STT", value: fmt(computed.stt) },
            { label: "Exchange charges", value: fmt(computed.exchange) },
            { label: "GST", value: fmt(computed.gst) },
            { label: "Total charges", value: fmt(computed.totalCharges) },
            { label: "Net P&L after charges", value: fmt(computed.netProceeds) },
          ],
        };
      }
      case "capGain": {
        const buy = parsePositive(a, "Buy value");
        const sell = parsePositive(b, "Sell value");
        const years = parseNonNegative(y, "Holding years");
        if (!buy.ok) return { error: buy.error };
        if (!sell.ok) return { error: sell.error };
        if (!years.ok) return { error: years.error };
        const computed = capitalGainEquity({
          buyValue: buy.value,
          sellValue: sell.value,
          holdingYears: years.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.taxEstimate),
          primaryLabel: computed.isLongTerm ? "Est. LTCG tax" : "Est. STCG tax",
          rows: [
            { label: "Capital gain", value: fmt(computed.gain) },
            { label: "Holding type", value: computed.isLongTerm ? "Long-term (>1 yr)" : "Short-term (≤1 yr)" },
            { label: "Taxable gain", value: fmt(computed.taxableGain) },
            { label: "Tax estimate", value: fmt(computed.taxEstimate) },
            { label: "Net after tax", value: fmt(computed.netAfterTax) },
          ],
        };
      }
      case "portfolio": {
        const v1 = parsePositive(a, "Holding A value");
        const r1 = parseAprPercent(g, "Holding A return %");
        const v2 = parsePositive(b, "Holding B value");
        const r2 = parseAprPercent(h, "Holding B return %");
        const v3 = parseNonNegative(c, "Holding C value");
        const r3 = parseAprPercent(e, "Holding C return %");
        if (!v1.ok) return { error: v1.error };
        if (!r1.ok) return { error: r1.error };
        if (!v2.ok) return { error: v2.error };
        if (!r2.ok) return { error: r2.error };
        if (!v3.ok) return { error: v3.error };
        if (!r3.ok) return { error: r3.error };
        const computed = portfolioReturn({
          valueA: v1.value,
          returnAPercent: r1.value,
          valueB: v2.value,
          returnBPercent: r2.value,
          valueC: v3.value > 0 ? v3.value : undefined,
          returnCPercent: r3.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: pct(computed.weightedReturnPercent),
          primaryLabel: "Weighted portfolio return",
          rows: [
            { label: "Total value", value: fmt(computed.totalValue) },
            { label: "Weighted return", value: pct(computed.weightedReturnPercent) },
            { label: "Ending value (1 period)", value: fmt(computed.endingValue) },
          ],
        };
      }
      case "risk": {
        const exp = parseAprPercent(s, "Expected return %");
        const rf = parseAprPercent(r, "Risk-free %");
        const vol = parsePositive(t, "Volatility %");
        if (!exp.ok) return { error: exp.error };
        if (!rf.ok) return { error: rf.error };
        if (!vol.ok) return { error: vol.error };
        const computed = riskVsReturn({
          expectedReturnPercent: exp.value,
          riskFreePercent: rf.value,
          volatilityPercent: vol.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.sharpeLike.toFixed(2),
          primaryLabel: "Risk-adjusted score (Sharpe-like)",
          rows: [
            { label: "Excess return", value: pct(computed.excessReturnPercent) },
            { label: "Sharpe-like ratio", value: computed.sharpeLike.toFixed(2) },
            { label: "Verdict", value: computed.verdict },
          ],
        };
      }
      default:
        return { error: "Unknown calculator mode." };
    }
  }, [a, b, c, config, d, e, fmt, g, h, p, r, s, t, y]);

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
            {config.mode === "capGain" || config.mode === "brokerage" ? (
              <p className="text-xs text-[var(--muted)]">
                Indicative India equity planning defaults—verify current tax slabs, broker tariff, and exchange fees.
              </p>
            ) : null}
          </div>
        )
      }
    >
      <div className="mb-4">
        <FieldLabel htmlFor="currency">Currency</FieldLabel>
        <select
          id="currency"
          value={currency}
          onChange={(ev) => setCurrency(ev.target.value as StockMarketCurrencyCode)}
          className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:max-w-xs"
        >
          {CURRENCIES.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {config.mode === "return" ? (
          <>
            <div>
              <FieldLabel htmlFor="a">Buy price / share</FieldLabel>
              <FieldInput id="a" inputMode="decimal" value={a} onChange={(ev) => setA(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="b">Sell price / share</FieldLabel>
              <FieldInput id="b" inputMode="decimal" value={b} onChange={(ev) => setB(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="c">Quantity</FieldLabel>
              <FieldInput id="c" inputMode="decimal" value={c} onChange={(ev) => setC(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="d">Dividends / share (optional)</FieldLabel>
              <FieldInput id="d" inputMode="decimal" value={d} onChange={(ev) => setD(ev.target.value)} className="mt-2" />
            </div>
          </>
        ) : null}

        {config.mode === "cagr" ? (
          <>
            <div>
              <FieldLabel htmlFor="a">Initial / purchase value</FieldLabel>
              <FieldInput id="a" inputMode="decimal" value={a} onChange={(ev) => setA(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="b">Final / current value</FieldLabel>
              <FieldInput id="b" inputMode="decimal" value={b} onChange={(ev) => setB(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="y">Years held</FieldLabel>
              <FieldInput id="y" inputMode="decimal" value={y} onChange={(ev) => setY(ev.target.value)} className="mt-2" />
            </div>
          </>
        ) : null}

        {config.mode === "divYield" ? (
          <>
            <div>
              <FieldLabel htmlFor="a">Annual dividend / share</FieldLabel>
              <FieldInput id="a" inputMode="decimal" value={a} onChange={(ev) => setA(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="b">Share price</FieldLabel>
              <FieldInput id="b" inputMode="decimal" value={b} onChange={(ev) => setB(ev.target.value)} className="mt-2" />
            </div>
          </>
        ) : null}

        {config.mode === "drip" ? (
          <>
            <div>
              <FieldLabel htmlFor="a">Initial shares</FieldLabel>
              <FieldInput id="a" inputMode="decimal" value={a} onChange={(ev) => setA(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="b">Starting share price</FieldLabel>
              <FieldInput id="b" inputMode="decimal" value={b} onChange={(ev) => setB(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="c">Annual dividend / share</FieldLabel>
              <FieldInput id="c" inputMode="decimal" value={c} onChange={(ev) => setC(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="d">Annual price growth %</FieldLabel>
              <FieldInput id="d" inputMode="decimal" value={d} onChange={(ev) => setD(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="y">Years</FieldLabel>
              <FieldInput id="y" inputMode="decimal" value={y} onChange={(ev) => setY(ev.target.value)} className="mt-2" />
            </div>
          </>
        ) : null}

        {config.mode === "average" ? (
          <>
            <div>
              <FieldLabel htmlFor="a">Quantity (lot 1)</FieldLabel>
              <FieldInput id="a" inputMode="decimal" value={a} onChange={(ev) => setA(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="b">Price (lot 1)</FieldLabel>
              <FieldInput id="b" inputMode="decimal" value={b} onChange={(ev) => setB(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="c">Quantity (lot 2)</FieldLabel>
              <FieldInput id="c" inputMode="decimal" value={c} onChange={(ev) => setC(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="d">Price (lot 2)</FieldLabel>
              <FieldInput id="d" inputMode="decimal" value={d} onChange={(ev) => setD(ev.target.value)} className="mt-2" />
            </div>
          </>
        ) : null}

        {config.mode === "intraday" ? (
          <>
            <div>
              <FieldLabel htmlFor="a">Buy price</FieldLabel>
              <FieldInput id="a" inputMode="decimal" value={a} onChange={(ev) => setA(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="b">Sell price</FieldLabel>
              <FieldInput id="b" inputMode="decimal" value={b} onChange={(ev) => setB(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="c">Quantity</FieldLabel>
              <FieldInput id="c" inputMode="decimal" value={c} onChange={(ev) => setC(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="p">Brokerage % of turnover</FieldLabel>
              <FieldInput id="p" inputMode="decimal" value={p} onChange={(ev) => setP(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="d">Other charges (flat)</FieldLabel>
              <FieldInput id="d" inputMode="decimal" value={d} onChange={(ev) => setD(ev.target.value)} className="mt-2" />
            </div>
          </>
        ) : null}

        {config.mode === "brokerage" ? (
          <>
            <div>
              <FieldLabel htmlFor="a">Buy value</FieldLabel>
              <FieldInput id="a" inputMode="decimal" value={a} onChange={(ev) => setA(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="b">Sell value</FieldLabel>
              <FieldInput id="b" inputMode="decimal" value={b} onChange={(ev) => setB(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="p">Brokerage %</FieldLabel>
              <FieldInput id="p" inputMode="decimal" value={p} onChange={(ev) => setP(ev.target.value)} className="mt-2" />
            </div>
          </>
        ) : null}

        {config.mode === "capGain" ? (
          <>
            <div>
              <FieldLabel htmlFor="a">Buy value (cost)</FieldLabel>
              <FieldInput id="a" inputMode="decimal" value={a} onChange={(ev) => setA(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="b">Sell value</FieldLabel>
              <FieldInput id="b" inputMode="decimal" value={b} onChange={(ev) => setB(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="y">Holding period (years)</FieldLabel>
              <FieldInput id="y" inputMode="decimal" value={y} onChange={(ev) => setY(ev.target.value)} className="mt-2" />
            </div>
          </>
        ) : null}

        {config.mode === "portfolio" ? (
          <>
            <div>
              <FieldLabel htmlFor="a">Holding A value</FieldLabel>
              <FieldInput id="a" inputMode="decimal" value={a} onChange={(ev) => setA(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="g">Holding A return %</FieldLabel>
              <FieldInput id="g" inputMode="decimal" value={g} onChange={(ev) => setG(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="b">Holding B value</FieldLabel>
              <FieldInput id="b" inputMode="decimal" value={b} onChange={(ev) => setB(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="h">Holding B return %</FieldLabel>
              <FieldInput id="h" inputMode="decimal" value={h} onChange={(ev) => setH(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="c">Holding C value (0 to skip)</FieldLabel>
              <FieldInput id="c" inputMode="decimal" value={c} onChange={(ev) => setC(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="e">Holding C return %</FieldLabel>
              <FieldInput id="e" inputMode="decimal" value={e} onChange={(ev) => setE(ev.target.value)} className="mt-2" />
            </div>
          </>
        ) : null}

        {config.mode === "risk" ? (
          <>
            <div>
              <FieldLabel htmlFor="s">Expected return %</FieldLabel>
              <FieldInput id="s" inputMode="decimal" value={s} onChange={(ev) => setS(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="r">Risk-free rate %</FieldLabel>
              <FieldInput id="r" inputMode="decimal" value={r} onChange={(ev) => setR(ev.target.value)} className="mt-2" />
            </div>
            <div>
              <FieldLabel htmlFor="t">Volatility (risk) %</FieldLabel>
              <FieldInput id="t" inputMode="decimal" value={t} onChange={(ev) => setT(ev.target.value)} className="mt-2" />
            </div>
          </>
        ) : null}
      </div>
    </CalculatorShell>
  );
}
