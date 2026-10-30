"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { SHOP_URL } from "@/lib/calculators/shopHelpers";
import {
  computeShopCoupon,
  type ShopCouponInput,
  type ShopCouponResult,
  type ShopCouponSlug,
} from "@/lib/calculators/shopCoupon";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "stack" | "cashback" | "bankOffer" | "buyXGetY" | "minPurchase" | "firstOrder";

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

const CONFIG: Record<ShopCouponSlug, Config> = {
  "shop-coupon-stack-calculator": {
    title: "Coupon stack",
    description: `Stacked coupons (multiplicative). ${DISCLAIMER}`,
    mode: "stack",
    ...EMPTY, aDefault: "100", bDefault: "10", cDefault: "5",
  },
  "shop-cashback-equivalent-discount-calculator": {
    title: "Cashback equivalent",
    description: `Effective discount from cashback. ${DISCLAIMER}`,
    mode: "cashback",
    ...EMPTY, aDefault: "200", bDefault: "20",
  },
  "shop-bank-offer-effective-discount-calculator": {
    title: "Bank offer discount",
    description: `Bank offer with optional cap. ${DISCLAIMER}`,
    mode: "bankOffer",
    ...EMPTY, aDefault: "5000", bDefault: "10", cDefault: "500",
  },
  "shop-wallet-cashback-calculator": {
    title: "Wallet cashback",
    description: `Net price after wallet cashback. ${DISCLAIMER}`,
    mode: "cashback",
    ...EMPTY, aDefault: "150", bDefault: "15",
  },
  "shop-buy-x-get-y-calculator": {
    title: "Buy X get Y",
    description: `Pay for X, get X+Y items. ${DISCLAIMER}`,
    mode: "buyXGetY",
    ...EMPTY, aDefault: "25", bDefault: "2", cDefault: "1",
  },
  "shop-minimum-purchase-offer-calculator": {
    title: "Minimum purchase offer",
    description: `Unlock discount when cart meets minimum. ${DISCLAIMER}`,
    mode: "minPurchase",
    ...EMPTY, aDefault: "80", bDefault: "100", cDefault: "15",
  },
  "shop-first-order-bonus-calculator": {
    title: "First order bonus",
    description: `First-order bonus discount. ${DISCLAIMER}`,
    mode: "firstOrder",
    ...EMPTY, aDefault: "75", bDefault: "10",
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

function formatResult(res: ShopCouponResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.final !== undefined) rows.push({ label: "Final", value: num(res.final, 2) });
  if (res.saved !== undefined) rows.push({ label: "Saved", value: num(res.saved, 2) });
  if (res.effectivePct !== undefined) rows.push({ label: "Effective %", value: num(res.effectivePct, 1) });
  if (res.eligible !== undefined) rows.push({ label: "Eligible", value: res.eligible ? "Yes" : "No" });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.final !== undefined ? num(res.final, 2)
    : res.saved !== undefined ? num(res.saved, 2)
    : "—";
  const primaryLabel = res.final !== undefined ? "Final price" : "Saved";
  return { primary, primaryLabel, rows };
}

export function ShopCouponCalculatorHost({ slug }: { slug: string }) {
  const key = slug as ShopCouponSlug;
  const config = CONFIG[key] ?? CONFIG["shop-coupon-stack-calculator"];
  const [a, setA] = useState(useLoanInitialInput(SHOP_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(SHOP_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(SHOP_URL.C, config.cDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, val: string) => { if (val.trim() !== "") out[k] = val; };
    switch (config.mode) {
      case "stack":
      case "bankOffer":
      case "buyXGetY":
      case "minPurchase":
        put(SHOP_URL.A, a); put(SHOP_URL.B, b); put(SHOP_URL.C, c);
        break;
      case "cashback":
      case "firstOrder":
        put(SHOP_URL.A, a); put(SHOP_URL.B, b);
        break;
    }
    return out;
  }, [a, b, c, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c]);

  const result = useMemo(() => {
    const input: ShopCouponInput = {};
    switch (config.mode) {
      case "stack": {
        const price = parsePositive(a, "Price");
        if (!price.ok) return { error: price.error };
        input.price = price.value;
        const p1 = optNonNeg(b, "Coupon 1 %");
        if (p1 && typeof p1 === "object") return { error: p1.error };
        if (typeof p1 === "number") input.pct1 = p1;
        const p2 = optNonNeg(c, "Coupon 2 %");
        if (p2 && typeof p2 === "object") return { error: p2.error };
        if (typeof p2 === "number") input.pct2 = p2;
        break;
      }
      case "cashback": {
        const price = parsePositive(a, "Price");
        if (!price.ok) return { error: price.error };
        input.price = price.value;
        const cb = optNonNeg(b, "Cashback");
        if (cb && typeof cb === "object") return { error: cb.error };
        if (typeof cb === "number") input.cashback = cb;
        break;
      }
      case "bankOffer": {
        const price = parsePositive(a, "Price");
        if (!price.ok) return { error: price.error };
        input.price = price.value;
        const pct = optNonNeg(b, "Bank offer %");
        if (pct && typeof pct === "object") return { error: pct.error };
        if (typeof pct === "number") input.bankPct = pct;
        const cap = optNonNeg(c, "Cap");
        if (cap && typeof cap === "object") return { error: cap.error };
        if (typeof cap === "number") input.cap = cap;
        break;
      }
      case "buyXGetY": {
        const price = parsePositive(a, "Unit price");
        if (!price.ok) return { error: price.error };
        input.price = price.value;
        const x = parsePositive(b, "Buy X");
        if (!x.ok) return { error: x.error };
        input.buyX = x.value;
        const y = optNonNeg(c, "Get Y");
        if (y && typeof y === "object") return { error: y.error };
        if (typeof y === "number") input.getY = y;
        break;
      }
      case "minPurchase": {
        const cart = optNonNeg(a, "Cart");
        if (cart && typeof cart === "object") return { error: cart.error };
        if (typeof cart === "number") input.cart = cart;
        const min = parsePositive(b, "Minimum");
        if (!min.ok) return { error: min.error };
        input.minPurchase = min.value;
        const disc = optNonNeg(c, "Discount amount");
        if (disc && typeof disc === "object") return { error: disc.error };
        if (typeof disc === "number") input.discountAmt = disc;
        break;
      }
      case "firstOrder": {
        const price = parsePositive(a, "Order");
        if (!price.ok) return { error: price.error };
        input.price = price.value;
        const bonus = optNonNeg(b, "Bonus");
        if (bonus && typeof bonus === "object") return { error: bonus.error };
        if (typeof bonus === "number") input.bonusAmt = bonus;
        break;
      }
    }
    return formatResult(computeShopCoupon(key in CONFIG ? key : "shop-coupon-stack-calculator", input), num);
  }, [a, b, c, config.mode, key]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "stack" ? (
            <>
              <div><FieldLabel htmlFor="sco-a">Price</FieldLabel><FieldInput id="sco-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sco-b">Coupon 1 %</FieldLabel><FieldInput id="sco-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sco-c">Coupon 2 %</FieldLabel><FieldInput id="sco-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "cashback" ? (
            <>
              <div><FieldLabel htmlFor="sco-a">Price</FieldLabel><FieldInput id="sco-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sco-b">Cashback</FieldLabel><FieldInput id="sco-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "bankOffer" ? (
            <>
              <div><FieldLabel htmlFor="sco-a">Price</FieldLabel><FieldInput id="sco-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sco-b">Bank offer %</FieldLabel><FieldInput id="sco-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sco-c">Cap (optional)</FieldLabel><FieldInput id="sco-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "buyXGetY" ? (
            <>
              <div><FieldLabel htmlFor="sco-a">Unit price</FieldLabel><FieldInput id="sco-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sco-b">Buy X</FieldLabel><FieldInput id="sco-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sco-c">Get Y free</FieldLabel><FieldInput id="sco-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "minPurchase" ? (
            <>
              <div><FieldLabel htmlFor="sco-a">Cart total</FieldLabel><FieldInput id="sco-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sco-b">Minimum purchase</FieldLabel><FieldInput id="sco-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sco-c">Discount amount</FieldLabel><FieldInput id="sco-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "firstOrder" ? (
            <>
              <div><FieldLabel htmlFor="sco-a">Order amount</FieldLabel><FieldInput id="sco-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sco-b">Bonus amount</FieldLabel><FieldInput id="sco-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
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
