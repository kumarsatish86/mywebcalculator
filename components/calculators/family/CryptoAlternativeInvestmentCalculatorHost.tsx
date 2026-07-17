"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import type { CryptoAltCurrencyCode } from "@/lib/calculators/cryptoAlternativeInvestment";
import {
  CRYPTO_ALT_URL,
  cryptoCagr,
  cryptoProfit,
  formatCryptoAltMoney,
  goldInvestment,
  nftRoi,
  realEstateRoi,
  rentalYield,
  stakingReward,
} from "@/lib/calculators/cryptoAlternativeInvestment";

type CryptoSlug =
  | "crypto-profit-calculator"
  | "crypto-cagr-calculator"
  | "staking-reward-calculator"
  | "nft-roi-calculator"
  | "gold-investment-calculator"
  | "real-estate-roi-calculator"
  | "rental-yield-calculator";

type Mode = "profit" | "cagr" | "staking" | "nft" | "gold" | "realEstate" | "rental";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  yDefault: string;
};

const CONFIG: Record<CryptoSlug, Config> = {
  "crypto-profit-calculator": {
    title: "Crypto profit calculator",
    description: "Estimate profit or loss from a crypto trade including optional exchange fee %.",
    mode: "profit",
    aDefault: "50000",
    bDefault: "75000",
    cDefault: "0.5",
    yDefault: "1",
  },
  "crypto-cagr-calculator": {
    title: "Crypto CAGR calculator",
    description: "Annualized compound growth rate between your entry and exit crypto portfolio values.",
    mode: "cagr",
    aDefault: "100000",
    bDefault: "250000",
    cDefault: "1",
    yDefault: "3",
  },
  "staking-reward-calculator": {
    title: "Staking reward calculator",
    description: "Project compound staking rewards from APY, stake size, and holding period.",
    mode: "staking",
    aDefault: "10000",
    bDefault: "5",
    cDefault: "365",
    yDefault: "2",
  },
  "nft-roi-calculator": {
    title: "NFT ROI calculator",
    description: "Compute ROI after mint/buy cost, gas, and marketplace fees on sale.",
    mode: "nft",
    aDefault: "2000",
    bDefault: "5000",
    cDefault: "80",
    yDefault: "2.5",
  },
  "gold-investment-calculator": {
    title: "Gold investment calculator",
    description: "Compare buy cost (with making charges) against sale value for physical or digital gold.",
    mode: "gold",
    aDefault: "20",
    bDefault: "6500",
    cDefault: "7200",
    yDefault: "3",
  },
  "real-estate-roi-calculator": {
    title: "Real estate ROI calculator",
    description: "Combine price appreciation and net rental income into total and annualized ROI.",
    mode: "realEstate",
    aDefault: "5000000",
    bDefault: "6500000",
    cDefault: "300000",
    yDefault: "5",
  },
  "rental-yield-calculator": {
    title: "Rental yield calculator",
    description: "Calculate gross and net rental yield from property value, rent, and expenses.",
    mode: "rental",
    aDefault: "5000000",
    bDefault: "300000",
    cDefault: "50000",
    yDefault: "1",
  },
};

const CURRENCIES: CryptoAltCurrencyCode[] = ["INR", "USD", "EUR", "GBP", "CAD", "AUD", "AED"];

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

export function CryptoAlternativeInvestmentCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as CryptoSlug] ?? CONFIG["crypto-profit-calculator"];
  const [currency, setCurrency] = useState<CryptoAltCurrencyCode>("INR");
  const [a, setA] = useState(useLoanInitialInput(CRYPTO_ALT_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(CRYPTO_ALT_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(CRYPTO_ALT_URL.C, config.cDefault));
  const [q, setQ] = useState(useLoanInitialInput(CRYPTO_ALT_URL.Q, "1"));
  const [t, setT] = useState(useLoanInitialInput(CRYPTO_ALT_URL.T, "40000"));
  const [y, setY] = useState(useLoanInitialInput(CRYPTO_ALT_URL.Y, config.yDefault));
  const [m, setM] = useState(useLoanInitialInput(CRYPTO_ALT_URL.M, "8"));
  const [g, setG] = useState(useLoanInitialInput(CRYPTO_ALT_URL.G, "80"));
  const [f, setF] = useState(useLoanInitialInput(CRYPTO_ALT_URL.F, "2.5"));
  const [h, setH] = useState(useLoanInitialInput(CRYPTO_ALT_URL.H, "100000"));

  const fmt = useCallback((n: number) => formatCryptoAltMoney(n, currency), [currency]);
  const pct = (n: number) => `${n.toFixed(2)}%`;

  const shareParams = useCallback(
    () => ({
      [CRYPTO_ALT_URL.A]: a,
      [CRYPTO_ALT_URL.B]: b,
      [CRYPTO_ALT_URL.C]: c,
      [CRYPTO_ALT_URL.Q]: q,
      [CRYPTO_ALT_URL.T]: t,
      [CRYPTO_ALT_URL.Y]: y,
      [CRYPTO_ALT_URL.M]: m,
      [CRYPTO_ALT_URL.G]: g,
      [CRYPTO_ALT_URL.F]: f,
      [CRYPTO_ALT_URL.H]: h,
    }),
    [a, b, c, q, t, y, m, g, f, h],
  );

  useLoanUrlSync(shareParams, [a, b, c, q, t, y, m, g, f, h]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "profit": {
        const buy = parsePositive(a, "Buy price");
        const sell = parseNonNegative(b, "Sell price");
        const qty = parsePositive(q, "Quantity");
        const fee = parseAprPercent(c, "Fee %");
        if (!buy.ok) return { error: buy.error };
        if (!sell.ok) return { error: sell.error };
        if (!qty.ok) return { error: qty.error };
        if (!fee.ok) return { error: fee.error };
        const computed = cryptoProfit({
          buyPrice: buy.value,
          sellPrice: sell.value,
          quantity: qty.value,
          feePercent: fee.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.profit),
          primaryLabel: "Net profit / loss",
          rows: [
            { label: "Cost basis (incl. buy fee)", value: fmt(computed.costBasis) },
            { label: "Net proceeds", value: fmt(computed.proceeds) },
            { label: "Total fees", value: fmt(computed.fees) },
            { label: "Profit %", value: pct(computed.profitPercent) },
          ],
        };
      }
      case "cagr": {
        const init = parsePositive(a, "Initial value");
        const fin = parseNonNegative(b, "Final value");
        const years = parsePositive(y, "Years");
        if (!init.ok) return { error: init.error };
        if (!fin.ok) return { error: fin.error };
        if (!years.ok) return { error: years.error };
        const computed = cryptoCagr({
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
      case "staking": {
        const prin = parsePositive(a, "Staked amount");
        const apy = parseAprPercent(b, "APY %");
        const years = parsePositive(y, "Years");
        const n = parsePositive(c, "Compounds per year");
        if (!prin.ok) return { error: prin.error };
        if (!apy.ok) return { error: apy.error };
        if (!years.ok) return { error: years.error };
        if (!n.ok) return { error: n.error };
        const computed = stakingReward({
          principal: prin.value,
          apyPercent: apy.value,
          years: years.value,
          compoundPerYear: n.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.rewards),
          primaryLabel: "Staking rewards",
          rows: [
            { label: "Principal", value: fmt(computed.principal) },
            { label: "Rewards", value: fmt(computed.rewards) },
            { label: "Ending balance", value: fmt(computed.endingBalance) },
            { label: "Effective yield", value: pct(computed.effectiveYieldPercent) },
          ],
        };
      }
      case "nft": {
        const buy = parseNonNegative(a, "Mint/buy cost");
        const sell = parseNonNegative(b, "Sell price");
        const gas = parseNonNegative(g, "Gas & other fees");
        const fee = parseAprPercent(f, "Marketplace fee %");
        if (!buy.ok) return { error: buy.error };
        if (!sell.ok) return { error: sell.error };
        if (!gas.ok) return { error: gas.error };
        if (!fee.ok) return { error: fee.error };
        const computed = nftRoi({
          mintOrBuyCost: buy.value,
          sellPrice: sell.value,
          gasAndFees: gas.value,
          marketplaceFeePercent: fee.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: pct(computed.roiPercent),
          primaryLabel: "ROI",
          rows: [
            { label: "Total cost", value: fmt(computed.totalCost) },
            { label: "Net proceeds", value: fmt(computed.netProceeds) },
            { label: "Profit", value: fmt(computed.profit) },
            { label: "ROI", value: pct(computed.roiPercent) },
          ],
        };
      }
      case "gold": {
        const grams = parsePositive(a, "Grams");
        const buyPx = parsePositive(b, "Buy price / gram");
        const sellPx = parseNonNegative(c, "Sell price / gram");
        const making = parseAprPercent(m, "Making charge %");
        const years = parseNonNegative(y, "Years held");
        if (!grams.ok) return { error: grams.error };
        if (!buyPx.ok) return { error: buyPx.error };
        if (!sellPx.ok) return { error: sellPx.error };
        if (!making.ok) return { error: making.error };
        if (!years.ok) return { error: years.error };
        const computed = goldInvestment({
          grams: grams.value,
          buyPricePerGram: buyPx.value,
          sellPricePerGram: sellPx.value,
          makingChargePercent: making.value,
          years: years.value > 0 ? years.value : undefined,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: fmt(computed.profit),
          primaryLabel: "Profit / loss",
          rows: [
            { label: "Buy cost (spot)", value: fmt(computed.buyCost) },
            { label: "Making charges", value: fmt(computed.makingCharges) },
            { label: "Total invested", value: fmt(computed.totalInvested) },
            { label: "Sell value", value: fmt(computed.sellValue) },
            { label: "Profit %", value: pct(computed.profitPercent) },
            {
              label: "CAGR",
              value: computed.cagrPercent == null ? "—" : pct(computed.cagrPercent),
            },
          ],
        };
      }
      case "realEstate": {
        const purchase = parsePositive(a, "Purchase price");
        const sale = parseNonNegative(b, "Current / sale value");
        const rent = parseNonNegative(c, "Annual rent");
        const exp = parseNonNegative(t, "Annual expenses");
        const years = parsePositive(y, "Years held");
        const close = parseNonNegative(h, "Closing / purchase costs");
        if (!purchase.ok) return { error: purchase.error };
        if (!sale.ok) return { error: sale.error };
        if (!rent.ok) return { error: rent.error };
        if (!exp.ok) return { error: exp.error };
        if (!years.ok) return { error: years.error };
        if (!close.ok) return { error: close.error };
        const computed = realEstateRoi({
          purchasePrice: purchase.value,
          currentOrSaleValue: sale.value,
          annualRent: rent.value,
          annualExpenses: exp.value,
          yearsHeld: years.value,
          closingCosts: close.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: pct(computed.roiPercent),
          primaryLabel: "Total ROI",
          rows: [
            { label: "Total invested", value: fmt(computed.totalInvested) },
            { label: "Net rent received", value: fmt(computed.totalNetRent) },
            { label: "Equity / price gain", value: fmt(computed.equityGain) },
            { label: "Total profit", value: fmt(computed.totalProfit) },
            { label: "Total ROI", value: pct(computed.roiPercent) },
            { label: "Annualized ROI", value: pct(computed.annualizedRoiPercent) },
          ],
        };
      }
      case "rental": {
        const value = parsePositive(a, "Property value");
        const rent = parseNonNegative(b, "Annual rent");
        const exp = parseNonNegative(c, "Annual expenses");
        if (!value.ok) return { error: value.error };
        if (!rent.ok) return { error: rent.error };
        if (!exp.ok) return { error: exp.error };
        const computed = rentalYield({
          propertyValue: value.value,
          annualRent: rent.value,
          annualExpenses: exp.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: pct(computed.netYieldPercent),
          primaryLabel: "Net rental yield",
          rows: [
            { label: "Gross yield", value: pct(computed.grossYieldPercent) },
            { label: "Net yield", value: pct(computed.netYieldPercent) },
            { label: "Monthly rent", value: fmt(computed.monthlyRent) },
            { label: "Net annual income", value: fmt(computed.netAnnualIncome) },
          ],
        };
      }
    }
  }, [config.mode, a, b, c, q, t, y, m, g, f, h, fmt]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <FieldLabel htmlFor="ca-currency">Currency</FieldLabel>
            <select
              id="ca-currency"
              className={selectCls}
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CryptoAltCurrencyCode)}
            >
              {CURRENCIES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>

          {config.mode === "profit" ? (
            <>
              <div>
                <FieldLabel htmlFor="ca-buy">Buy price (per unit)</FieldLabel>
                <FieldInput id="ca-buy" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ca-sell">Sell price (per unit)</FieldLabel>
                <FieldInput id="ca-sell" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ca-qty">Quantity</FieldLabel>
                <FieldInput id="ca-qty" value={q} onChange={(ev) => setQ(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ca-fee">Fee % (each side)</FieldLabel>
                <FieldInput id="ca-fee" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "cagr" ? (
            <>
              <div>
                <FieldLabel htmlFor="ca-init">Initial value</FieldLabel>
                <FieldInput id="ca-init" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ca-fin">Final value</FieldLabel>
                <FieldInput id="ca-fin" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ca-years">Years held</FieldLabel>
                <FieldInput id="ca-years" value={y} onChange={(ev) => setY(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "staking" ? (
            <>
              <div>
                <FieldLabel htmlFor="ca-stake">Staked amount</FieldLabel>
                <FieldInput id="ca-stake" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ca-apy">APY %</FieldLabel>
                <FieldInput id="ca-apy" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ca-stake-y">Years</FieldLabel>
                <FieldInput id="ca-stake-y" value={y} onChange={(ev) => setY(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ca-comp">Compounds per year</FieldLabel>
                <FieldInput id="ca-comp" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="numeric" />
              </div>
            </>
          ) : null}

          {config.mode === "nft" ? (
            <>
              <div>
                <FieldLabel htmlFor="ca-nft-buy">Mint / buy cost</FieldLabel>
                <FieldInput id="ca-nft-buy" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ca-nft-sell">Sell price</FieldLabel>
                <FieldInput id="ca-nft-sell" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ca-gas">Gas & other fees</FieldLabel>
                <FieldInput id="ca-gas" value={g} onChange={(ev) => setG(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ca-mkt">Marketplace fee %</FieldLabel>
                <FieldInput id="ca-mkt" value={f} onChange={(ev) => setF(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "gold" ? (
            <>
              <div>
                <FieldLabel htmlFor="ca-grams">Grams</FieldLabel>
                <FieldInput id="ca-grams" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ca-gbuy">Buy price per gram</FieldLabel>
                <FieldInput id="ca-gbuy" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ca-gsell">Sell price per gram</FieldLabel>
                <FieldInput id="ca-gsell" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ca-making">Making charge %</FieldLabel>
                <FieldInput id="ca-making" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ca-gy">Years held (optional for CAGR)</FieldLabel>
                <FieldInput id="ca-gy" value={y} onChange={(ev) => setY(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "realEstate" ? (
            <>
              <div>
                <FieldLabel htmlFor="ca-purchase">Purchase price</FieldLabel>
                <FieldInput
                  id="ca-purchase"
                  value={a}
                  onChange={(ev) => setA(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="ca-sale">Current / sale value</FieldLabel>
                <FieldInput id="ca-sale" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ca-rent">Annual rent</FieldLabel>
                <FieldInput id="ca-rent" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ca-exp">Annual expenses (tax, maint., vacancy…)</FieldLabel>
                <FieldInput id="ca-exp" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ca-close">Closing / purchase costs</FieldLabel>
                <FieldInput id="ca-close" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ca-re-y">Years held</FieldLabel>
                <FieldInput id="ca-re-y" value={y} onChange={(ev) => setY(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "rental" ? (
            <>
              <div>
                <FieldLabel htmlFor="ca-pval">Property value</FieldLabel>
                <FieldInput id="ca-pval" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ca-arent">Annual rent</FieldLabel>
                <FieldInput id="ca-arent" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ca-aexp">Annual expenses</FieldLabel>
                <FieldInput id="ca-aexp" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
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
