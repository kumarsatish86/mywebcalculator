"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { SHOP_URL } from "@/lib/calculators/shopHelpers";
import {
  computeShopSmart,
  type ShopSmartInput,
  type ShopSmartResult,
  type ShopSmartSlug,
} from "@/lib/calculators/shopSmart";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "elasticity" | "dynamicPricing" | "segmented" | "cartRecovery" | "ltvDiscount";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
};

const EMPTY = { aDefault: "", bDefault: "", cDefault: "" };

const DISCLAIMER =
  "Daily-life shopping estimate only — offers, taxes, FX, and fees vary. Verify current terms before buying.";

const CONFIG: Record<ShopSmartSlug, Config> = {
  "shop-price-elasticity-estimator": {
    title: "Price elasticity",
    description: `Elasticity ≈ %ΔQ ÷ %ΔP. ${DISCLAIMER}`,
    mode: "elasticity",
    ...EMPTY, aDefault: "-10", bDefault: "20",
  },
  "shop-dynamic-pricing-scenario-calculator": {
    title: "Dynamic pricing scenario",
    description: `Scenario price = base × (1+%) × demand. ${DISCLAIMER}`,
    mode: "dynamicPricing",
    ...EMPTY, aDefault: "100", bDefault: "5", cDefault: "1.1",
  },
  "shop-segmented-discount-calculator": {
    title: "Segmented discount",
    description: `Segment-specific discount amount. ${DISCLAIMER}`,
    mode: "segmented",
    ...EMPTY, aDefault: "200", bDefault: "15",
  },
  "shop-cart-abandonment-recovery-discount-calculator": {
    title: "Cart recovery discount",
    description: `Recovery offer on abandoned cart. ${DISCLAIMER}`,
    mode: "cartRecovery",
    ...EMPTY, aDefault: "120", bDefault: "10",
  },
  "shop-lifetime-value-discount-calculator": {
    title: "LTV discount budget",
    description: `Max promo budget from customer LTV. ${DISCLAIMER}`,
    mode: "ltvDiscount",
    ...EMPTY, aDefault: "500", bDefault: "20",
  },
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

function optNonNeg(raw: string, label: string): number | undefined | { error: string } {
  if (raw.trim() === "") return undefined;
  const p = parseNonNegative(raw, label);
  if (!p.ok) return { error: p.error };
  return p.value;
}

function formatResult(res: ShopSmartResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.elasticity !== undefined) rows.push({ label: "Elasticity", value: num(res.elasticity, 2) });
  if (res.newPrice !== undefined) rows.push({ label: "New price", value: num(res.newPrice, 2) });
  if (res.expectedRevenue !== undefined) rows.push({ label: "Expected revenue", value: num(res.expectedRevenue, 2) });
  if (res.discount !== undefined) rows.push({ label: "Discount", value: num(res.discount, 2) });
  if (res.final !== undefined) rows.push({ label: "Final", value: num(res.final, 2) });
  if (res.maxOffer !== undefined) rows.push({ label: "Max offer", value: num(res.maxOffer, 2) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.elasticity !== undefined ? num(res.elasticity, 2)
    : res.maxOffer !== undefined ? num(res.maxOffer, 2)
    : res.newPrice !== undefined ? num(res.newPrice, 2)
    : res.final !== undefined ? num(res.final, 2)
    : res.discount !== undefined ? num(res.discount, 2)
    : "—";
  const primaryLabel =
    res.elasticity !== undefined ? "Elasticity"
    : res.maxOffer !== undefined ? "Max offer"
    : res.newPrice !== undefined ? "Scenario price"
    : "Result";
  return { primary, primaryLabel, rows };
}

export function ShopSmartCalculatorHost({ slug }: { slug: string }) {
  const key = slug as ShopSmartSlug;
  const config = CONFIG[key] ?? CONFIG["shop-price-elasticity-estimator"];
  const [a, setA] = useState(useLoanInitialInput(SHOP_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(SHOP_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(SHOP_URL.C, config.cDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, val: string) => { if (val.trim() !== "") out[k] = val; };
    switch (config.mode) {
      case "elasticity":
      case "segmented":
      case "cartRecovery":
      case "ltvDiscount":
        put(SHOP_URL.A, a); put(SHOP_URL.B, b);
        break;
      case "dynamicPricing":
        put(SHOP_URL.A, a); put(SHOP_URL.B, b); put(SHOP_URL.C, c);
        break;
    }
    return out;
  }, [a, b, c, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c]);

  const result = useMemo(() => {
    const input: ShopSmartInput = {};
    switch (config.mode) {
      case "elasticity": {
        if (a.trim() === "") return { error: "% price change must be non-zero." };
        const dp = Number(a);
        if (!Number.isFinite(dp) || dp === 0) return { error: "% price change must be non-zero." };
        input.pctPriceChange = dp;
        if (b.trim() === "") return { error: "% quantity change required." };
        const dq = Number(b);
        if (!Number.isFinite(dq)) return { error: "% quantity change required." };
        input.pctQtyChange = dq;
        break;
      }
      case "dynamicPricing": {
        const base = parsePositive(a, "Base price");
        if (!base.ok) return { error: base.error };
        input.basePrice = base.value;
        if (b.trim() !== "") {
          const pct = Number(b);
          if (Number.isFinite(pct)) input.scenarioPct = pct;
        }
        const factor = optNonNeg(c, "Demand factor");
        if (factor && typeof factor === "object") return { error: factor.error };
        if (typeof factor === "number") input.demandFactor = factor;
        break;
      }
      case "segmented": {
        const price = parsePositive(a, "Price");
        if (!price.ok) return { error: price.error };
        input.price = price.value;
        const pct = optNonNeg(b, "Segment discount %");
        if (pct && typeof pct === "object") return { error: pct.error };
        if (typeof pct === "number") input.segmentPct = pct;
        break;
      }
      case "cartRecovery": {
        const cart = parsePositive(a, "Cart value");
        if (!cart.ok) return { error: cart.error };
        input.cart = cart.value;
        const pct = optNonNeg(b, "Recovery offer %");
        if (pct && typeof pct === "object") return { error: pct.error };
        if (typeof pct === "number") input.recoveryPct = pct;
        break;
      }
      case "ltvDiscount": {
        const ltv = parsePositive(a, "Customer LTV");
        if (!ltv.ok) return { error: ltv.error };
        input.ltv = ltv.value;
        const maxPct = optNonNeg(b, "Max discount % of LTV");
        if (maxPct && typeof maxPct === "object") return { error: maxPct.error };
        if (typeof maxPct === "number") input.maxDiscountPct = maxPct;
        break;
      }
    }
    return formatResult(computeShopSmart(key in CONFIG ? key : "shop-price-elasticity-estimator", input), num);
  }, [a, b, c, config.mode, key]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "elasticity" ? (
            <>
              <div><FieldLabel htmlFor="ssm-a">% price change</FieldLabel><FieldInput id="ssm-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ssm-b">% quantity change</FieldLabel><FieldInput id="ssm-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "dynamicPricing" ? (
            <>
              <div><FieldLabel htmlFor="ssm-a">Base price</FieldLabel><FieldInput id="ssm-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ssm-b">Scenario % change</FieldLabel><FieldInput id="ssm-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ssm-c">Demand factor</FieldLabel><FieldInput id="ssm-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "segmented" ? (
            <>
              <div><FieldLabel htmlFor="ssm-a">Price</FieldLabel><FieldInput id="ssm-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ssm-b">Segment discount %</FieldLabel><FieldInput id="ssm-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "cartRecovery" ? (
            <>
              <div><FieldLabel htmlFor="ssm-a">Cart value</FieldLabel><FieldInput id="ssm-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ssm-b">Recovery offer %</FieldLabel><FieldInput id="ssm-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "ltvDiscount" ? (
            <>
              <div><FieldLabel htmlFor="ssm-a">Customer LTV</FieldLabel><FieldInput id="ssm-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ssm-b">Max discount % of LTV</FieldLabel><FieldInput id="ssm-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
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
                {result.rows.map((row) => (<Row key={row.label} label={row.label} value={row.value} />))}
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
