"use client";

import type { ShopPricingSlug } from "@/lib/calculators/shopPricing";
import type { ShopTaxSlug } from "@/lib/calculators/shopTax";
import type { ShopSellerSlug } from "@/lib/calculators/shopSeller";
import type { ShopMarginSlug } from "@/lib/calculators/shopMargin";
import type { ShopCompareSlug } from "@/lib/calculators/shopCompare";
import type { ShopCouponSlug } from "@/lib/calculators/shopCoupon";
import type { ShopPaymentSlug } from "@/lib/calculators/shopPayment";
import type { ShopDeliverySlug } from "@/lib/calculators/shopDelivery";
import type { ShopCurrencySlug } from "@/lib/calculators/shopCurrency";
import type { ShopSmartSlug } from "@/lib/calculators/shopSmart";
import { ShopPricingCalculatorHost } from "./ShopPricingCalculatorHost";
import { ShopTaxCalculatorHost } from "./ShopTaxCalculatorHost";
import { ShopSellerCalculatorHost } from "./ShopSellerCalculatorHost";
import { ShopMarginCalculatorHost } from "./ShopMarginCalculatorHost";
import { ShopCompareCalculatorHost } from "./ShopCompareCalculatorHost";
import { ShopCouponCalculatorHost } from "./ShopCouponCalculatorHost";
import { ShopPaymentCalculatorHost } from "./ShopPaymentCalculatorHost";
import { ShopDeliveryCalculatorHost } from "./ShopDeliveryCalculatorHost";
import { ShopCurrencyCalculatorHost } from "./ShopCurrencyCalculatorHost";
import { ShopSmartCalculatorHost } from "./ShopSmartCalculatorHost";

const PRICING = new Set<string>([
  "shop-discount-calculator",
  "shop-percentage-off-calculator",
  "shop-multiple-discount-calculator",
  "shop-buy-one-get-one-calculator",
  "shop-price-after-discount-calculator",
  "shop-original-price-calculator",
  "shop-markup-calculator",
  "shop-markdown-calculator",
  "shop-sale-price-calculator",
  "shop-clearance-price-calculator",
  "shop-bundle-discount-calculator",
  "shop-tiered-discount-calculator",
  "shop-volume-discount-calculator",
  "shop-wholesale-price-calculator",
  "shop-retail-price-calculator",
  "shop-cost-plus-pricing-calculator",
  "shop-price-per-unit-calculator",
  "shop-msrp-vs-selling-price-calculator",
  "shop-trade-in-value-calculator",
  "shop-membership-discount-calculator",
  "shop-loyalty-points-value-calculator",
] satisfies ShopPricingSlug[]);

const TAX = new Set<string>([
  "shop-sales-tax-calculator",
  "shop-gst-calculator",
  "shop-vat-calculator",
  "shop-tax-inclusive-price-calculator",
  "shop-tax-exclusive-price-calculator",
  "shop-reverse-tax-calculator",
  "shop-multi-rate-tax-calculator",
  "shop-invoice-total-calculator",
  "shop-line-item-discount-calculator",
  "shop-service-charge-calculator",
  "shop-tip-calculator-bill-split",
  "shop-rounding-adjustment-calculator",
] satisfies ShopTaxSlug[]);

const SELLER = new Set<string>([
  "shop-marketplace-commission-calculator",
  "shop-platform-fee-calculator",
  "shop-payment-gateway-fee-calculator",
  "shop-seller-payout-calculator",
  "shop-net-revenue-calculator",
  "shop-free-shipping-threshold-calculator",
  "shop-shipping-included-price-calculator",
  "shop-return-rate-impact-calculator",
  "shop-cogs-calculator",
  "shop-inventory-turnover-calculator",
] satisfies ShopSellerSlug[]);

const MARGIN = new Set<string>([
  "shop-gross-margin-calculator",
  "shop-net-profit-calculator",
  "shop-profit-margin-percent-calculator",
  "shop-break-even-units-calculator",
  "shop-break-even-revenue-calculator",
  "shop-markup-from-cost-calculator",
  "shop-target-margin-price-calculator",
  "shop-discounted-margin-calculator",
] satisfies ShopMarginSlug[]);

const COMPARE = new Set<string>([
  "shop-unit-price-comparison-calculator",
  "shop-pack-size-comparison-calculator",
  "shop-bulk-vs-retail-comparison-calculator",
  "shop-subscription-vs-one-time-calculator",
  "shop-cheapest-option-calculator",
  "shop-value-for-money-calculator",
  "shop-inflation-adjusted-comparison-calculator",
] satisfies ShopCompareSlug[]);

const COUPON = new Set<string>([
  "shop-coupon-stack-calculator",
  "shop-cashback-equivalent-discount-calculator",
  "shop-bank-offer-effective-discount-calculator",
  "shop-wallet-cashback-calculator",
  "shop-buy-x-get-y-calculator",
  "shop-minimum-purchase-offer-calculator",
  "shop-first-order-bonus-calculator",
] satisfies ShopCouponSlug[]);

const PAYMENT = new Set<string>([
  "shop-emi-calculator",
  "shop-no-cost-emi-comparison-calculator",
  "shop-bnpl-total-cost-calculator",
  "shop-installment-plan-comparison-calculator",
  "shop-down-payment-calculator",
  "shop-interest-on-deferred-payment-calculator",
] satisfies ShopPaymentSlug[]);

const DELIVERY = new Set<string>([
  "shop-shipping-cost-estimator",
  "shop-dimensional-weight-calculator",
  "shop-cod-extra-fee-calculator",
  "shop-free-shipping-cart-threshold-calculator",
  "shop-split-shipment-cost-calculator",
] satisfies ShopDeliverySlug[]);

const CURRENCY = new Set<string>([
  "shop-currency-converter-purchase-calculator",
  "shop-import-duty-estimator",
  "shop-landed-cost-calculator",
  "shop-tax-refund-tourist-calculator",
  "shop-international-shipping-total-calculator",
] satisfies ShopCurrencySlug[]);

const SMART = new Set<string>([
  "shop-price-elasticity-estimator",
  "shop-dynamic-pricing-scenario-calculator",
  "shop-segmented-discount-calculator",
  "shop-cart-abandonment-recovery-discount-calculator",
  "shop-lifetime-value-discount-calculator",
] satisfies ShopSmartSlug[]);

export function ShopDiscountCalculatorRouter({ slug }: { slug: string }) {
  if (PRICING.has(slug)) return <ShopPricingCalculatorHost slug={slug} />;
  if (TAX.has(slug)) return <ShopTaxCalculatorHost slug={slug} />;
  if (SELLER.has(slug)) return <ShopSellerCalculatorHost slug={slug} />;
  if (MARGIN.has(slug)) return <ShopMarginCalculatorHost slug={slug} />;
  if (COMPARE.has(slug)) return <ShopCompareCalculatorHost slug={slug} />;
  if (COUPON.has(slug)) return <ShopCouponCalculatorHost slug={slug} />;
  if (PAYMENT.has(slug)) return <ShopPaymentCalculatorHost slug={slug} />;
  if (DELIVERY.has(slug)) return <ShopDeliveryCalculatorHost slug={slug} />;
  if (CURRENCY.has(slug)) return <ShopCurrencyCalculatorHost slug={slug} />;
  if (SMART.has(slug)) return <ShopSmartCalculatorHost slug={slug} />;
  return <ShopPricingCalculatorHost slug={slug} />;
}
