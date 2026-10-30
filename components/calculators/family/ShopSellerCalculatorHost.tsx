"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { SHOP_URL } from "@/lib/calculators/shopHelpers";
import {
  computeShopSeller,
  type ShopSellerInput,
  type ShopSellerResult,
  type ShopSellerSlug,
} from "@/lib/calculators/shopSeller";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode =
  | "commission"
  | "gateway"
  | "payout"
  | "freeShip"
  | "shipIncluded"
  | "returnImpact"
  | "cogs"
  | "turnover";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  dDefault: string;
  tDefault: string;
};

const EMPTY = { aDefault: "", bDefault: "", cDefault: "", dDefault: "", tDefault: "" };

const DISCLAIMER =
  "Daily-life shopping estimate only — offers, taxes, FX, and fees vary. Verify current terms before buying.";

const CONFIG: Record<ShopSellerSlug, Config> = {
  "shop-marketplace-commission-calculator": {
    title: "Marketplace commission",
    description: `Platform fee from sale and commission %. ${DISCLAIMER}`,
    mode: "commission",
    ...EMPTY, aDefault: "1000", bDefault: "10", cDefault: "0",
  },
  "shop-platform-fee-calculator": {
    title: "Platform fee",
    description: `Fee = % of sale + fixed charge. ${DISCLAIMER}`,
    mode: "commission",
    ...EMPTY, aDefault: "500", bDefault: "15", cDefault: "2",
  },
  "shop-payment-gateway-fee-calculator": {
    title: "Payment gateway fee",
    description: `Gateway % + fixed per transaction. ${DISCLAIMER}`,
    mode: "gateway",
    ...EMPTY, aDefault: "250", bDefault: "2", cDefault: "0.30",
  },
  "shop-seller-payout-calculator": {
    title: "Seller payout",
    description: `Net payout after fees and shipping. ${DISCLAIMER}`,
    mode: "payout",
    ...EMPTY, aDefault: "2000", bDefault: "12", cDefault: "2", dDefault: "50", tDefault: "0",
  },
  "shop-net-revenue-calculator": {
    title: "Net revenue",
    description: `Net after commission, gateway, shipping. ${DISCLAIMER}`,
    mode: "payout",
    ...EMPTY, aDefault: "1500", bDefault: "10", cDefault: "2.5", dDefault: "30",
  },
  "shop-free-shipping-threshold-calculator": {
    title: "Free shipping threshold",
    description: `Amount needed to unlock free shipping. ${DISCLAIMER}`,
    mode: "freeShip",
    ...EMPTY, aDefault: "45", bDefault: "50",
  },
  "shop-shipping-included-price-calculator": {
    title: "Shipping-included price",
    description: `All-in price = product + shipping. ${DISCLAIMER}`,
    mode: "shipIncluded",
    ...EMPTY, aDefault: "39.99", bDefault: "5.99",
  },
  "shop-return-rate-impact-calculator": {
    title: "Return rate impact",
    description: `Revenue lost to returns. ${DISCLAIMER}`,
    mode: "returnImpact",
    ...EMPTY, aDefault: "10000", bDefault: "8",
  },
  "shop-cogs-calculator": {
    title: "COGS",
    description: `Cost of goods = units × unit cost. ${DISCLAIMER}`,
    mode: "cogs",
    ...EMPTY, aDefault: "100", bDefault: "12",
  },
  "shop-inventory-turnover-calculator": {
    title: "Inventory turnover",
    description: `Turnover = COGS ÷ avg inventory. ${DISCLAIMER}`,
    mode: "turnover",
    ...EMPTY, aDefault: "120000", bDefault: "30000",
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

function formatResult(res: ShopSellerResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.fee !== undefined) rows.push({ label: "Fees / loss", value: num(res.fee, 2) });
  if (res.payout !== undefined) rows.push({ label: "Payout", value: num(res.payout, 2) });
  if (res.net !== undefined) rows.push({ label: "Net", value: num(res.net, 2) });
  if (res.price !== undefined) rows.push({ label: "Price", value: num(res.price, 2) });
  if (res.gap !== undefined) rows.push({ label: "Gap", value: num(res.gap, 2) });
  if (res.turnover !== undefined) rows.push({ label: "Turnover", value: num(res.turnover, 2) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.payout !== undefined ? num(res.payout, 2)
    : res.net !== undefined ? num(res.net, 2)
    : res.price !== undefined ? num(res.price, 2)
    : res.gap !== undefined ? num(res.gap, 2)
    : res.turnover !== undefined ? num(res.turnover, 2)
    : res.fee !== undefined ? num(res.fee, 2)
    : "—";
  const primaryLabel =
    res.payout !== undefined ? "Payout"
    : res.gap !== undefined ? "Amount needed"
    : res.turnover !== undefined ? "Turnover"
    : res.price !== undefined ? "All-in price"
    : "Fees";
  return { primary, primaryLabel, rows };
}

export function ShopSellerCalculatorHost({ slug }: { slug: string }) {
  const key = slug as ShopSellerSlug;
  const config = CONFIG[key] ?? CONFIG["shop-marketplace-commission-calculator"];
  const [a, setA] = useState(useLoanInitialInput(SHOP_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(SHOP_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(SHOP_URL.C, config.cDefault));
  const [d, setD] = useState(useLoanInitialInput(SHOP_URL.D, config.dDefault));
  const [t, setT] = useState(useLoanInitialInput(SHOP_URL.T, config.tDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, val: string) => { if (val.trim() !== "") out[k] = val; };
    switch (config.mode) {
      case "commission":
      case "gateway":
        put(SHOP_URL.A, a); put(SHOP_URL.B, b); put(SHOP_URL.C, c);
        break;
      case "payout":
        put(SHOP_URL.A, a); put(SHOP_URL.B, b); put(SHOP_URL.C, c); put(SHOP_URL.D, d); put(SHOP_URL.T, t);
        break;
      case "freeShip":
        put(SHOP_URL.A, a); put(SHOP_URL.B, b);
        break;
      case "shipIncluded":
      case "returnImpact":
      case "cogs":
      case "turnover":
        put(SHOP_URL.A, a); put(SHOP_URL.B, b);
        break;
    }
    return out;
  }, [a, b, c, config.mode, d, t]);

  useLoanUrlSync(shareParams, [a, b, c, d, t]);

  const result = useMemo(() => {
    const input: ShopSellerInput = {};
    switch (config.mode) {
      case "commission": {
        const sale = parsePositive(a, "Sale amount");
        if (!sale.ok) return { error: sale.error };
        input.sale = sale.value;
        const pct = optNonNeg(b, "Commission %");
        if (pct && typeof pct === "object") return { error: pct.error };
        if (typeof pct === "number") input.commissionPct = pct;
        const fixed = optNonNeg(c, "Fixed fee");
        if (fixed && typeof fixed === "object") return { error: fixed.error };
        if (typeof fixed === "number") input.fixedFee = fixed;
        break;
      }
      case "gateway": {
        const sale = parsePositive(a, "Transaction");
        if (!sale.ok) return { error: sale.error };
        input.sale = sale.value;
        const pct = optNonNeg(b, "Gateway %");
        if (pct && typeof pct === "object") return { error: pct.error };
        if (typeof pct === "number") input.gatewayPct = pct;
        const fixed = optNonNeg(c, "Fixed fee");
        if (fixed && typeof fixed === "object") return { error: fixed.error };
        if (typeof fixed === "number") input.fixedFee = fixed;
        break;
      }
      case "payout": {
        const sale = parsePositive(a, "Gross sale");
        if (!sale.ok) return { error: sale.error };
        input.sale = sale.value;
        const comm = optNonNeg(b, "Commission %");
        if (comm && typeof comm === "object") return { error: comm.error };
        if (typeof comm === "number") input.commissionPct = comm;
        const gw = optNonNeg(c, "Gateway %");
        if (gw && typeof gw === "object") return { error: gw.error };
        if (typeof gw === "number") input.gatewayPct = gw;
        const ship = optNonNeg(d, "Shipping");
        if (ship && typeof ship === "object") return { error: ship.error };
        if (typeof ship === "number") input.shipping = ship;
        const fixed = optNonNeg(t, "Fixed fee");
        if (fixed && typeof fixed === "object") return { error: fixed.error };
        if (typeof fixed === "number") input.fixedFee = fixed;
        break;
      }
      case "freeShip": {
        const cart = optNonNeg(a, "Cart");
        if (cart && typeof cart === "object") return { error: cart.error };
        if (typeof cart === "number") input.cart = cart;
        const thresh = parsePositive(b, "Threshold");
        if (!thresh.ok) return { error: thresh.error };
        input.threshold = thresh.value;
        break;
      }
      case "shipIncluded": {
        const sale = parsePositive(a, "Product price");
        if (!sale.ok) return { error: sale.error };
        input.sale = sale.value;
        const ship = parsePositive(b, "Shipping");
        if (!ship.ok) return { error: ship.error };
        input.shipping = ship.value;
        break;
      }
      case "returnImpact": {
        const sale = parsePositive(a, "Gross sales");
        if (!sale.ok) return { error: sale.error };
        input.sale = sale.value;
        const ret = optNonNeg(b, "Return %");
        if (ret && typeof ret === "object") return { error: ret.error };
        if (typeof ret === "number") input.returnPct = ret;
        break;
      }
      case "cogs": {
        const units = parsePositive(a, "Units");
        if (!units.ok) return { error: units.error };
        input.units = units.value;
        const cost = parsePositive(b, "Unit cost");
        if (!cost.ok) return { error: cost.error };
        input.unitCost = cost.value;
        break;
      }
      case "turnover": {
        const cogs = parsePositive(a, "COGS");
        if (!cogs.ok) return { error: cogs.error };
        input.cogs = cogs.value;
        const inv = parsePositive(b, "Avg inventory");
        if (!inv.ok) return { error: inv.error };
        input.avgInventory = inv.value;
        break;
      }
    }
    return formatResult(computeShopSeller(key in CONFIG ? key : "shop-marketplace-commission-calculator", input), num);
  }, [a, b, c, config.mode, d, key, t]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {(config.mode === "commission" || config.mode === "gateway") ? (
            <>
              <div><FieldLabel htmlFor="ss-a">Sale / transaction</FieldLabel><FieldInput id="ss-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ss-b">{config.mode === "gateway" ? "Gateway %" : "Commission %"}</FieldLabel><FieldInput id="ss-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ss-c">Fixed fee (optional)</FieldLabel><FieldInput id="ss-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "payout" ? (
            <>
              <div><FieldLabel htmlFor="ss-a">Gross sale</FieldLabel><FieldInput id="ss-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ss-b">Commission %</FieldLabel><FieldInput id="ss-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ss-c">Gateway %</FieldLabel><FieldInput id="ss-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ss-d">Shipping</FieldLabel><FieldInput id="ss-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ss-t">Fixed fee (optional)</FieldLabel><FieldInput id="ss-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "freeShip" ? (
            <>
              <div><FieldLabel htmlFor="ss-a">Cart total</FieldLabel><FieldInput id="ss-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ss-b">Free shipping threshold</FieldLabel><FieldInput id="ss-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {(config.mode === "shipIncluded" || config.mode === "returnImpact") ? (
            <>
              <div><FieldLabel htmlFor="ss-a">{config.mode === "shipIncluded" ? "Product price" : "Gross sales"}</FieldLabel><FieldInput id="ss-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ss-b">{config.mode === "shipIncluded" ? "Shipping cost" : "Return %"}</FieldLabel><FieldInput id="ss-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {(config.mode === "cogs" || config.mode === "turnover") ? (
            <>
              <div><FieldLabel htmlFor="ss-a">{config.mode === "cogs" ? "Units" : "COGS"}</FieldLabel><FieldInput id="ss-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ss-b">{config.mode === "cogs" ? "Unit cost" : "Avg inventory"}</FieldLabel><FieldInput id="ss-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
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
