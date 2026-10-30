"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { SHOP_URL } from "@/lib/calculators/shopHelpers";
import {
  computeShopDelivery,
  type ShopDeliveryInput,
  type ShopDeliveryResult,
  type ShopDeliverySlug,
} from "@/lib/calculators/shopDelivery";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "shipping" | "dimWeight" | "cod" | "freeShipThreshold" | "splitShip";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  lDefault: string;
  wDefault: string;
  hDefault: string;
  dDefault: string;
};

const EMPTY = { aDefault: "", bDefault: "", cDefault: "", lDefault: "", wDefault: "", hDefault: "", dDefault: "" };

const DISCLAIMER =
  "Daily-life shopping estimate only — offers, taxes, FX, and fees vary. Verify current terms before buying.";

const CONFIG: Record<ShopDeliverySlug, Config> = {
  "shop-shipping-cost-estimator": {
    title: "Shipping cost",
    description: `Shipping ≈ base + weight × rate. ${DISCLAIMER}`,
    mode: "shipping",
    ...EMPTY, aDefault: "2.5", bDefault: "8", cDefault: "50",
  },
  "shop-dimensional-weight-calculator": {
    title: "Dimensional weight",
    description: `Billable = max(actual, dim weight). ${DISCLAIMER}`,
    mode: "dimWeight",
    ...EMPTY, lDefault: "50", wDefault: "40", hDefault: "30", dDefault: "5000", aDefault: "5",
  },
  "shop-cod-extra-fee-calculator": {
    title: "COD extra fee",
    description: `COD fee = % of order + fixed. ${DISCLAIMER}`,
    mode: "cod",
    ...EMPTY, aDefault: "1500", bDefault: "2", cDefault: "30",
  },
  "shop-free-shipping-cart-threshold-calculator": {
    title: "Free shipping threshold",
    description: `Amount to add for free shipping. ${DISCLAIMER}`,
    mode: "freeShipThreshold",
    ...EMPTY, aDefault: "35", bDefault: "50",
  },
  "shop-split-shipment-cost-calculator": {
    title: "Split shipment cost",
    description: `Total of two shipment costs. ${DISCLAIMER}`,
    mode: "splitShip",
    ...EMPTY, aDefault: "120", bDefault: "85",
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

function formatResult(res: ShopDeliveryResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.cost !== undefined) rows.push({ label: "Cost", value: num(res.cost, 2) });
  if (res.dimWeightKg !== undefined) rows.push({ label: "Dim weight (kg)", value: num(res.dimWeightKg, 2) });
  if (res.billableKg !== undefined) rows.push({ label: "Billable (kg)", value: num(res.billableKg, 2) });
  if (res.gap !== undefined) rows.push({ label: "Gap", value: num(res.gap, 2) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.cost !== undefined ? num(res.cost, 2)
    : res.billableKg !== undefined ? num(res.billableKg, 2)
    : res.gap !== undefined ? num(res.gap, 2)
    : "—";
  const primaryLabel =
    res.billableKg !== undefined ? "Billable weight"
    : res.gap !== undefined ? "Amount needed"
    : "Cost";
  return { primary, primaryLabel, rows };
}

export function ShopDeliveryCalculatorHost({ slug }: { slug: string }) {
  const key = slug as ShopDeliverySlug;
  const config = CONFIG[key] ?? CONFIG["shop-shipping-cost-estimator"];
  const [a, setA] = useState(useLoanInitialInput(SHOP_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(SHOP_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(SHOP_URL.C, config.cDefault));
  const [l, setL] = useState(useLoanInitialInput(SHOP_URL.L, config.lDefault));
  const [w, setW] = useState(useLoanInitialInput(SHOP_URL.W, config.wDefault));
  const [h, setH] = useState(useLoanInitialInput(SHOP_URL.H, config.hDefault));
  const [d, setD] = useState(useLoanInitialInput(SHOP_URL.D, config.dDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, val: string) => { if (val.trim() !== "") out[k] = val; };
    switch (config.mode) {
      case "shipping":
        put(SHOP_URL.A, a); put(SHOP_URL.B, b); put(SHOP_URL.C, c);
        break;
      case "dimWeight":
        put(SHOP_URL.L, l); put(SHOP_URL.W, w); put(SHOP_URL.H, h); put(SHOP_URL.D, d); put(SHOP_URL.A, a);
        break;
      case "cod":
        put(SHOP_URL.A, a); put(SHOP_URL.B, b); put(SHOP_URL.C, c);
        break;
      case "freeShipThreshold":
        put(SHOP_URL.A, a); put(SHOP_URL.B, b);
        break;
      case "splitShip":
        put(SHOP_URL.A, a); put(SHOP_URL.B, b);
        break;
    }
    return out;
  }, [a, b, c, config.mode, d, h, l, w]);

  useLoanUrlSync(shareParams, [a, b, c, d, h, l, w]);

  const result = useMemo(() => {
    const input: ShopDeliveryInput = {};
    switch (config.mode) {
      case "shipping": {
        const weight = parsePositive(a, "Weight kg");
        if (!weight.ok) return { error: weight.error };
        input.weightKg = weight.value;
        const rate = parsePositive(b, "Rate/kg");
        if (!rate.ok) return { error: rate.error };
        input.ratePerKg = rate.value;
        const base = optNonNeg(c, "Base fee");
        if (base && typeof base === "object") return { error: base.error };
        if (typeof base === "number") input.baseFee = base;
        break;
      }
      case "dimWeight": {
        const L = parsePositive(l, "Length cm");
        if (!L.ok) return { error: L.error };
        input.lengthCm = L.value;
        const W = parsePositive(w, "Width cm");
        if (!W.ok) return { error: W.error };
        input.widthCm = W.value;
        const H = parsePositive(h, "Height cm");
        if (!H.ok) return { error: H.error };
        input.heightCm = H.value;
        const div = parsePositive(d, "Divisor");
        if (!div.ok) return { error: div.error };
        input.dimDivisor = div.value;
        const actual = optNonNeg(a, "Actual weight kg");
        if (actual && typeof actual === "object") return { error: actual.error };
        if (typeof actual === "number") input.weightKg = actual;
        break;
      }
      case "cod": {
        const order = parsePositive(a, "Order amount");
        if (!order.ok) return { error: order.error };
        input.orderAmount = order.value;
        const pct = optNonNeg(b, "COD %");
        if (pct && typeof pct === "object") return { error: pct.error };
        if (typeof pct === "number") input.codPct = pct;
        const fixed = optNonNeg(c, "Fixed fee");
        if (fixed && typeof fixed === "object") return { error: fixed.error };
        if (typeof fixed === "number") input.codFixed = fixed;
        break;
      }
      case "freeShipThreshold": {
        const cart = optNonNeg(a, "Cart");
        if (cart && typeof cart === "object") return { error: cart.error };
        if (typeof cart === "number") input.cart = cart;
        const thresh = parsePositive(b, "Threshold");
        if (!thresh.ok) return { error: thresh.error };
        input.threshold = thresh.value;
        break;
      }
      case "splitShip": {
        const shipA = parsePositive(a, "Shipment A");
        if (!shipA.ok) return { error: shipA.error };
        input.shipA = shipA.value;
        const shipB = parsePositive(b, "Shipment B");
        if (!shipB.ok) return { error: shipB.error };
        input.shipB = shipB.value;
        break;
      }
    }
    return formatResult(computeShopDelivery(key in CONFIG ? key : "shop-shipping-cost-estimator", input), num);
  }, [a, b, c, config.mode, d, h, key, l, w]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "shipping" ? (
            <>
              <div><FieldLabel htmlFor="sd-a">Weight (kg)</FieldLabel><FieldInput id="sd-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sd-b">Rate per kg</FieldLabel><FieldInput id="sd-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sd-c">Base fee (optional)</FieldLabel><FieldInput id="sd-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "dimWeight" ? (
            <>
              <div><FieldLabel htmlFor="sd-l">Length (cm)</FieldLabel><FieldInput id="sd-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sd-w">Width (cm)</FieldLabel><FieldInput id="sd-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sd-h">Height (cm)</FieldLabel><FieldInput id="sd-h" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sd-d">Dim divisor</FieldLabel><FieldInput id="sd-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sd-a">Actual weight kg (optional)</FieldLabel><FieldInput id="sd-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "cod" ? (
            <>
              <div><FieldLabel htmlFor="sd-a">Order amount</FieldLabel><FieldInput id="sd-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sd-b">COD %</FieldLabel><FieldInput id="sd-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sd-c">Fixed fee</FieldLabel><FieldInput id="sd-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "freeShipThreshold" ? (
            <>
              <div><FieldLabel htmlFor="sd-a">Cart total</FieldLabel><FieldInput id="sd-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sd-b">Free shipping threshold</FieldLabel><FieldInput id="sd-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "splitShip" ? (
            <>
              <div><FieldLabel htmlFor="sd-a">Shipment A cost</FieldLabel><FieldInput id="sd-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sd-b">Shipment B cost</FieldLabel><FieldInput id="sd-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
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
