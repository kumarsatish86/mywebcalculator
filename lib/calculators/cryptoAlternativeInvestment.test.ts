import { describe, expect, it } from "vitest";
import {
  cryptoCagr,
  cryptoProfit,
  goldInvestment,
  nftRoi,
  realEstateRoi,
  rentalYield,
  stakingReward,
} from "./cryptoAlternativeInvestment";

describe("cryptoAlternativeInvestment", () => {
  it("computes crypto profit with fees", () => {
    const result = cryptoProfit({
      buyPrice: 100,
      sellPrice: 150,
      quantity: 2,
      feePercent: 1,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.profit).toBeGreaterThan(0);
    expect(result.fees).toBeCloseTo(5, 5);
  });

  it("computes crypto CAGR", () => {
    const result = cryptoCagr({ initialValue: 1000, finalValue: 2000, years: 5 });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.cagrPercent).toBeCloseTo(14.87, 1);
  });

  it("compounds staking rewards", () => {
    const result = stakingReward({
      principal: 10000,
      apyPercent: 5,
      years: 1,
      compoundPerYear: 365,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.endingBalance).toBeGreaterThan(10000);
    expect(result.rewards).toBeGreaterThan(490);
  });

  it("computes NFT ROI", () => {
    const result = nftRoi({
      mintOrBuyCost: 1000,
      sellPrice: 2000,
      gasAndFees: 50,
      marketplaceFeePercent: 2.5,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.profit).toBeCloseTo(2000 * 0.975 - 1050, 2);
  });

  it("computes gold investment", () => {
    const result = goldInvestment({
      grams: 10,
      buyPricePerGram: 6000,
      sellPricePerGram: 7000,
      makingChargePercent: 5,
      years: 2,
    });
    expect("error" in result).toBe(false);
    if ("error" in result) return;
    expect(result.totalInvested).toBe(63000);
    expect(result.sellValue).toBe(70000);
    expect(result.cagrPercent).not.toBeNull();
  });

  it("computes real estate ROI and rental yield", () => {
    const re = realEstateRoi({
      purchasePrice: 5000000,
      currentOrSaleValue: 6000000,
      annualRent: 240000,
      annualExpenses: 40000,
      yearsHeld: 5,
      closingCosts: 100000,
    });
    expect("error" in re).toBe(false);
    if ("error" in re) return;
    expect(re.totalProfit).toBeGreaterThan(0);

    const y = rentalYield({
      propertyValue: 5000000,
      annualRent: 240000,
      annualExpenses: 40000,
    });
    expect("error" in y).toBe(false);
    if ("error" in y) return;
    expect(y.grossYieldPercent).toBeCloseTo(4.8, 4);
    expect(y.netYieldPercent).toBeCloseTo(4, 4);
  });
});
