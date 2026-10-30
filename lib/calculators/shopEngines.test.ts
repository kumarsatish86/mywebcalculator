import { describe, expect, it } from "vitest";
import { computeShopPricing } from "./shopPricing";
import { computeShopTax } from "./shopTax";
import { computeShopSeller } from "./shopSeller";
import { computeShopMargin } from "./shopMargin";
import { computeShopCompare } from "./shopCompare";
import { computeShopCoupon } from "./shopCoupon";
import { computeShopPayment } from "./shopPayment";
import { computeShopDelivery } from "./shopDelivery";
import { computeShopCurrency } from "./shopCurrency";
import { computeShopSmart } from "./shopSmart";

describe("shopping-discount engines smoke", () => {
  it("discount", () => {
    const r = computeShopPricing("shop-discount-calculator", { price: 100, pct: 20 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.final).toBe(80);
  });

  it("gst", () => {
    const r = computeShopTax("shop-gst-calculator", { amount: 1000, taxPct: 18 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.total).toBe(1180);
  });

  it("commission", () => {
    const r = computeShopSeller("shop-marketplace-commission-calculator", {
      sale: 1000,
      commissionPct: 10,
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.fee).toBe(100);
  });

  it("gross margin", () => {
    const r = computeShopMargin("shop-gross-margin-calculator", { revenue: 100, cogs: 40 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.pct).toBe(60);
  });

  it("unit compare", () => {
    const r = computeShopCompare("shop-unit-price-comparison-calculator", {
      priceA: 10,
      unitsA: 2,
      priceB: 12,
      unitsB: 3,
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.cheaper).toBe("B");
  });

  it("coupon stack", () => {
    const r = computeShopCoupon("shop-coupon-stack-calculator", { price: 100, pct1: 10, pct2: 10 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.final).toBeCloseTo(81);
  });

  it("emi", () => {
    const r = computeShopPayment("shop-emi-calculator", {
      principal: 12000,
      annualRatePct: 0,
      months: 12,
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.emi).toBe(1000);
  });

  it("dim weight", () => {
    const r = computeShopDelivery("shop-dimensional-weight-calculator", {
      lengthCm: 50,
      widthCm: 40,
      heightCm: 30,
      dimDivisor: 5000,
      weightKg: 5,
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.dimWeightKg).toBe(12);
  });

  it("fx", () => {
    const r = computeShopCurrency("shop-currency-converter-purchase-calculator", {
      amount: 100,
      rate: 83,
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.converted).toBe(8300);
  });

  it("elasticity", () => {
    const r = computeShopSmart("shop-price-elasticity-estimator", {
      pctPriceChange: -10,
      pctQtyChange: 20,
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.elasticity).toBe(-2);
  });
});
