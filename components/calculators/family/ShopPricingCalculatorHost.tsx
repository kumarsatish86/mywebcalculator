"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { SHOP_URL } from "@/lib/calculators/shopHelpers";
import {
  computeShopPricing,
  type ShopPricingInput,
  type ShopPricingResult,
  type ShopPricingSlug,
} from "@/lib/calculators/shopPricing";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode =
  | "discount"
  | "multiDiscount"
  | "bogo"
  | "originalPrice"
  | "markup"
  | "markdown"
  | "tiered"
  | "wholesale"
  | "perUnit"
  | "msrp"
  | "tradeIn"
  | "loyalty";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  tDefault: string;
  lDefault: string;
  wDefault: string;
  hDefault: string;
  dDefault: string;
  nDefault: string;
  pDefault: string;
  qDefault: string;
  mDefault: string;
  vDefault: string;
  sDefault: string;
};

const EMPTY = {
  aDefault: "", bDefault: "", cDefault: "", rDefault: "", tDefault: "",
  lDefault: "", wDefault: "", hDefault: "", dDefault: "", nDefault: "",
  pDefault: "", qDefault: "", mDefault: "", vDefault: "", sDefault: "",
};

const DISCLAIMER =
  "Daily-life shopping estimate only — offers, taxes, FX, and fees vary. Verify current terms before buying.";

const CONFIG: Record<ShopPricingSlug, Config> = {
  "shop-discount-calculator": {
    title: "Discount",
    description: `Final price after a percentage off. ${DISCLAIMER}`,
    mode: "discount",
    ...EMPTY, aDefault: "100", bDefault: "20",
  },
  "shop-percentage-off-calculator": {
    title: "Percentage off",
    description: `Sale price from list price and discount %. ${DISCLAIMER}`,
    mode: "discount",
    ...EMPTY, aDefault: "150", bDefault: "15",
  },
  "shop-multiple-discount-calculator": {
    title: "Multiple discounts",
    description: `Stacked discounts (multiplicative). ${DISCLAIMER}`,
    mode: "multiDiscount",
    ...EMPTY, aDefault: "200", bDefault: "10", cDefault: "5",
  },
  "shop-buy-one-get-one-calculator": {
    title: "Buy one get one",
    description: `BOGO bundle total and savings. ${DISCLAIMER}`,
    mode: "bogo",
    ...EMPTY, aDefault: "50", nDefault: "2", bDefault: "100",
  },
  "shop-price-after-discount-calculator": {
    title: "Price after discount",
    description: `Net price after discount %. ${DISCLAIMER}`,
    mode: "discount",
    ...EMPTY, aDefault: "89.99", bDefault: "25",
  },
  "shop-original-price-calculator": {
    title: "Original price",
    description: `Reverse-calculate list price from sale price. ${DISCLAIMER}`,
    mode: "originalPrice",
    ...EMPTY, aDefault: "80", bDefault: "20",
  },
  "shop-markup-calculator": {
    title: "Markup",
    description: `Selling price from cost and markup %. ${DISCLAIMER}`,
    mode: "markup",
    ...EMPTY, aDefault: "40", bDefault: "50",
  },
  "shop-markdown-calculator": {
    title: "Markdown",
    description: `Sale price from list and markdown %. ${DISCLAIMER}`,
    mode: "markdown",
    ...EMPTY, aDefault: "120", bDefault: "30",
  },
  "shop-sale-price-calculator": {
    title: "Sale price",
    description: `Discounted sale price. ${DISCLAIMER}`,
    mode: "discount",
    ...EMPTY, aDefault: "99", bDefault: "20",
  },
  "shop-clearance-price-calculator": {
    title: "Clearance price",
    description: `Clearance price after deep discount. ${DISCLAIMER}`,
    mode: "discount",
    ...EMPTY, aDefault: "75", bDefault: "50",
  },
  "shop-bundle-discount-calculator": {
    title: "Bundle discount",
    description: `Bundle pricing with free-item %. ${DISCLAIMER}`,
    mode: "bogo",
    ...EMPTY, aDefault: "25", nDefault: "3", bDefault: "100",
  },
  "shop-tiered-discount-calculator": {
    title: "Tiered discount",
    description: `Volume tier discount when qty threshold met. ${DISCLAIMER}`,
    mode: "tiered",
    ...EMPTY, aDefault: "10", nDefault: "12", tDefault: "10", bDefault: "15",
  },
  "shop-volume-discount-calculator": {
    title: "Volume discount",
    description: `Bulk quantity discount. ${DISCLAIMER}`,
    mode: "tiered",
    ...EMPTY, aDefault: "8", nDefault: "24", tDefault: "20", bDefault: "10",
  },
  "shop-wholesale-price-calculator": {
    title: "Wholesale price",
    description: `Wholesale from retail and off %. ${DISCLAIMER}`,
    mode: "wholesale",
    ...EMPTY, aDefault: "100", bDefault: "30",
  },
  "shop-retail-price-calculator": {
    title: "Retail price",
    description: `Retail price from cost and markup %. ${DISCLAIMER}`,
    mode: "markup",
    ...EMPTY, aDefault: "25", bDefault: "100",
  },
  "shop-cost-plus-pricing-calculator": {
    title: "Cost-plus pricing",
    description: `Price = cost × (1 + markup%). ${DISCLAIMER}`,
    mode: "markup",
    ...EMPTY, aDefault: "15", bDefault: "40",
  },
  "shop-price-per-unit-calculator": {
    title: "Price per unit",
    description: `Unit price from pack price and units. ${DISCLAIMER}`,
    mode: "perUnit",
    ...EMPTY, aDefault: "12", nDefault: "6",
  },
  "shop-msrp-vs-selling-price-calculator": {
    title: "MSRP vs selling price",
    description: `Discount vs MSRP. ${DISCLAIMER}`,
    mode: "msrp",
    ...EMPTY, aDefault: "999", bDefault: "799",
  },
  "shop-trade-in-value-calculator": {
    title: "Trade-in value",
    description: `Net price after trade-in credit. ${DISCLAIMER}`,
    mode: "tradeIn",
    ...EMPTY, aDefault: "800", bDefault: "200",
  },
  "shop-membership-discount-calculator": {
    title: "Membership discount",
    description: `Member price after loyalty discount. ${DISCLAIMER}`,
    mode: "discount",
    ...EMPTY, aDefault: "60", bDefault: "10",
  },
  "shop-loyalty-points-value-calculator": {
    title: "Loyalty points value",
    description: `Cash value of reward points. ${DISCLAIMER}`,
    mode: "loyalty",
    ...EMPTY, aDefault: "5000", bDefault: "0.01",
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

function formatResult(res: ShopPricingResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.final !== undefined) rows.push({ label: "Final", value: num(res.final, 2) });
  if (res.saved !== undefined) rows.push({ label: "Saved", value: num(res.saved, 2) });
  if (res.pct !== undefined) rows.push({ label: "Discount %", value: num(res.pct, 1) });
  if (res.perUnit !== undefined) rows.push({ label: "Per unit", value: num(res.perUnit, 4) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.perUnit !== undefined ? num(res.perUnit, 4)
    : res.final !== undefined ? num(res.final, 2)
    : res.pct !== undefined ? num(res.pct, 1)
    : "—";
  const primaryLabel =
    res.perUnit !== undefined ? "Per unit"
    : res.pct !== undefined && res.final === undefined ? "Discount %"
    : "Final price";
  return { primary, primaryLabel, rows };
}

export function ShopPricingCalculatorHost({ slug }: { slug: string }) {
  const key = slug as ShopPricingSlug;
  const config = CONFIG[key] ?? CONFIG["shop-discount-calculator"];
  const [a, setA] = useState(useLoanInitialInput(SHOP_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(SHOP_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(SHOP_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(SHOP_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(SHOP_URL.T, config.tDefault));
  const [l, setL] = useState(useLoanInitialInput(SHOP_URL.L, config.lDefault));
  const [w, setW] = useState(useLoanInitialInput(SHOP_URL.W, config.wDefault));
  const [h, setH] = useState(useLoanInitialInput(SHOP_URL.H, config.hDefault));
  const [d, setD] = useState(useLoanInitialInput(SHOP_URL.D, config.dDefault));
  const [n, setN] = useState(useLoanInitialInput(SHOP_URL.N, config.nDefault));
  const [p, setP] = useState(useLoanInitialInput(SHOP_URL.P, config.pDefault));
  const [q, setQ] = useState(useLoanInitialInput(SHOP_URL.Q, config.qDefault));
  const [m, setM] = useState(useLoanInitialInput(SHOP_URL.M, config.mDefault));
  const [v, setV] = useState(useLoanInitialInput(SHOP_URL.V, config.vDefault));
  const [s, setS] = useState(useLoanInitialInput(SHOP_URL.S, config.sDefault));

  const num = (nVal: number, dec = 2) => {
    if (!Number.isFinite(nVal)) return "—";
    const abs = Math.abs(nVal);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return nVal.toExponential(4);
    return nVal.toFixed(dec);
  };

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, val: string) => { if (val.trim() !== "") out[k] = val; };
    switch (config.mode) {
      case "discount":
      case "markdown":
      case "wholesale":
        put(SHOP_URL.A, a); put(SHOP_URL.B, b);
        break;
      case "multiDiscount":
        put(SHOP_URL.A, a); put(SHOP_URL.B, b); put(SHOP_URL.C, c);
        break;
      case "bogo":
        put(SHOP_URL.A, a); put(SHOP_URL.N, n); put(SHOP_URL.B, b);
        break;
      case "originalPrice":
        put(SHOP_URL.A, a); put(SHOP_URL.B, b);
        break;
      case "markup":
        put(SHOP_URL.A, a); put(SHOP_URL.B, b);
        break;
      case "tiered":
        put(SHOP_URL.A, a); put(SHOP_URL.N, n); put(SHOP_URL.T, t); put(SHOP_URL.B, b);
        break;
      case "perUnit":
        put(SHOP_URL.A, a); put(SHOP_URL.N, n);
        break;
      case "msrp":
        put(SHOP_URL.A, a); put(SHOP_URL.B, b);
        break;
      case "tradeIn":
        put(SHOP_URL.A, a); put(SHOP_URL.B, b);
        break;
      case "loyalty":
        put(SHOP_URL.A, a); put(SHOP_URL.B, b);
        break;
    }
    return out;
  }, [a, b, c, config.mode, n, t]);

  useLoanUrlSync(shareParams, [a, b, c, d, h, l, m, n, p, q, r, s, t, v, w]);

  const result = useMemo(() => {
    const input: ShopPricingInput = {};
    switch (config.mode) {
      case "discount":
      case "markdown":
      case "wholesale": {
        const price = parsePositive(a, "Price");
        if (!price.ok) return { error: price.error };
        input.price = price.value;
        const pct = optNonNeg(b, "Discount %");
        if (pct && typeof pct === "object") return { error: pct.error };
        if (typeof pct === "number") input.pct = pct;
        break;
      }
      case "multiDiscount": {
        const price = parsePositive(a, "Price");
        if (!price.ok) return { error: price.error };
        input.price = price.value;
        const p1 = optNonNeg(b, "Discount 1 %");
        if (p1 && typeof p1 === "object") return { error: p1.error };
        if (typeof p1 === "number") input.pct = p1;
        const p2 = optNonNeg(c, "Discount 2 %");
        if (p2 && typeof p2 === "object") return { error: p2.error };
        if (typeof p2 === "number") input.pct2 = p2;
        break;
      }
      case "bogo": {
        const price = parsePositive(a, "Unit price");
        if (!price.ok) return { error: price.error };
        input.price = price.value;
        const qty = parsePositive(n, "Quantity");
        if (!qty.ok) return { error: qty.error };
        input.qty = qty.value;
        const freePct = optNonNeg(b, "Free item %");
        if (freePct && typeof freePct === "object") return { error: freePct.error };
        if (typeof freePct === "number") input.pct = freePct;
        break;
      }
      case "originalPrice": {
        const sale = parsePositive(a, "Sale price");
        if (!sale.ok) return { error: sale.error };
        input.price = sale.value;
        const pct = parsePositive(b, "Discount %");
        if (!pct.ok) return { error: pct.error };
        input.pct = pct.value;
        break;
      }
      case "markup": {
        const cost = parsePositive(a, "Cost");
        if (!cost.ok) return { error: cost.error };
        input.cost = cost.value;
        const pct = optNonNeg(b, "Markup %");
        if (pct && typeof pct === "object") return { error: pct.error };
        if (typeof pct === "number") input.pct = pct;
        break;
      }
      case "tiered": {
        const price = parsePositive(a, "Unit price");
        if (!price.ok) return { error: price.error };
        input.price = price.value;
        const qty = parsePositive(n, "Quantity");
        if (!qty.ok) return { error: qty.error };
        input.qty = qty.value;
        const thresh = optNonNeg(t, "Tier threshold qty");
        if (thresh && typeof thresh === "object") return { error: thresh.error };
        if (typeof thresh === "number") input.tierQty = thresh;
        const tierPct = optNonNeg(b, "Tier discount %");
        if (tierPct && typeof tierPct === "object") return { error: tierPct.error };
        if (typeof tierPct === "number") input.tierPct = tierPct;
        break;
      }
      case "perUnit": {
        const price = parsePositive(a, "Price");
        if (!price.ok) return { error: price.error };
        input.price = price.value;
        const units = parsePositive(n, "Units");
        if (!units.ok) return { error: units.error };
        input.units = units.value;
        break;
      }
      case "msrp": {
        const msrp = parsePositive(a, "MSRP");
        if (!msrp.ok) return { error: msrp.error };
        input.msrp = msrp.value;
        const sell = parsePositive(b, "Selling price");
        if (!sell.ok) return { error: sell.error };
        input.selling = sell.value;
        break;
      }
      case "tradeIn": {
        const price = parsePositive(a, "Purchase price");
        if (!price.ok) return { error: price.error };
        input.price = price.value;
        const trade = optNonNeg(b, "Trade-in value");
        if (trade && typeof trade === "object") return { error: trade.error };
        if (typeof trade === "number") input.tradeIn = trade;
        break;
      }
      case "loyalty": {
        const pts = parsePositive(a, "Points");
        if (!pts.ok) return { error: pts.error };
        input.points = pts.value;
        const val = parsePositive(b, "Value per point");
        if (!val.ok) return { error: val.error };
        input.pointValue = val.value;
        break;
      }
    }
    return formatResult(
      computeShopPricing(key in CONFIG ? key : "shop-discount-calculator", input),
      num,
    );
  }, [a, b, c, config.mode, key, n, t]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {(config.mode === "discount" || config.mode === "markdown" || config.mode === "wholesale") ? (
            <>
              <div><FieldLabel htmlFor="sp-a">Price</FieldLabel><FieldInput id="sp-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sp-b">Discount / off %</FieldLabel><FieldInput id="sp-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "multiDiscount" ? (
            <>
              <div><FieldLabel htmlFor="sp-a">Price</FieldLabel><FieldInput id="sp-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sp-b">Discount 1 %</FieldLabel><FieldInput id="sp-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sp-c">Discount 2 %</FieldLabel><FieldInput id="sp-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "bogo" ? (
            <>
              <div><FieldLabel htmlFor="sp-a">Unit price</FieldLabel><FieldInput id="sp-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sp-n">Quantity</FieldLabel><FieldInput id="sp-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sp-b">Free item % (100 = fully free)</FieldLabel><FieldInput id="sp-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "originalPrice" ? (
            <>
              <div><FieldLabel htmlFor="sp-a">Sale price</FieldLabel><FieldInput id="sp-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sp-b">Discount %</FieldLabel><FieldInput id="sp-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "markup" ? (
            <>
              <div><FieldLabel htmlFor="sp-a">Cost</FieldLabel><FieldInput id="sp-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sp-b">Markup %</FieldLabel><FieldInput id="sp-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "tiered" ? (
            <>
              <div><FieldLabel htmlFor="sp-a">Unit price</FieldLabel><FieldInput id="sp-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sp-n">Quantity</FieldLabel><FieldInput id="sp-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sp-t">Tier threshold qty</FieldLabel><FieldInput id="sp-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sp-b">Tier discount %</FieldLabel><FieldInput id="sp-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "perUnit" ? (
            <>
              <div><FieldLabel htmlFor="sp-a">Pack price</FieldLabel><FieldInput id="sp-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sp-n">Units in pack</FieldLabel><FieldInput id="sp-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "msrp" ? (
            <>
              <div><FieldLabel htmlFor="sp-a">MSRP</FieldLabel><FieldInput id="sp-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sp-b">Selling price</FieldLabel><FieldInput id="sp-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "tradeIn" ? (
            <>
              <div><FieldLabel htmlFor="sp-a">Purchase price</FieldLabel><FieldInput id="sp-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sp-b">Trade-in credit</FieldLabel><FieldInput id="sp-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "loyalty" ? (
            <>
              <div><FieldLabel htmlFor="sp-a">Points</FieldLabel><FieldInput id="sp-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sp-b">Value per point</FieldLabel><FieldInput id="sp-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
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
