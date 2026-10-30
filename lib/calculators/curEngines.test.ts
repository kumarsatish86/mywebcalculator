import { describe, expect, it } from "vitest";
import { ALL_CUR_BASIC_SLUGS, computeCurBasic } from "./curBasic";
import { ALL_CUR_ADVANCED_SLUGS, computeCurAdvanced } from "./curAdvanced";
import { ALL_CUR_FOREX_SLUGS, computeCurForex } from "./curForex";
import { ALL_CUR_CRYPTO_SLUGS, computeCurCrypto } from "./curCrypto";
import { ALL_CUR_BANKING_SLUGS, computeCurBanking } from "./curBanking";
import { ALL_CUR_TRAVEL_SLUGS, computeCurTravel } from "./curTravel";
import { ALL_CUR_BUSINESS_SLUGS, computeCurBusiness } from "./curBusiness";
import { ALL_CUR_INFLATION_SLUGS, computeCurInflation } from "./curInflation";
import { ALL_CUR_SMART_SLUGS, computeCurSmart } from "./curSmart";
import { ALL_CUR_TIME_SLUGS, computeCurTime } from "./curTime";
import { ALL_CUR_MICRO_SLUGS, computeCurMicro } from "./curMicro";

const BASIC_INPUT = { amount: 100, rate: 83 };
const ADVANCED_INPUT = {
  amount: 100,
  rate: 83,
  rateB: 84,
  rateC: 85,
  rows: 5,
  target: 8300,
  feePct: 1,
  fixedFee: 5,
};
const FOREX_INPUT = {
  entry: 1.1,
  exit: 1.12,
  lots: 1,
  contractSize: 100_000,
  riskAmount: 100,
  stopPips: 20,
  pipValue: 10,
  price: 1.1,
  leverage: 100,
  notional: 100_000,
  margin: 1000,
  risk: 100,
  reward: 250,
  swapPerLot: 5,
  nights: 3,
  account: 10_000,
  riskPct: 1,
};
const CRYPTO_INPUT = {
  amount: 1,
  rate: 5500000,
  buyPrice: 50000,
  sellPrice: 65000,
  feePct: 0.5,
  rewardPerDay: 15,
  days: 30,
  powerCost: 3,
  hashrate: 1,
  apyPct: 5,
  gain: 50000,
  taxPct: 30,
  holdingA: 0.5,
  priceA: 5500000,
  holdingB: 2,
  priceB: 3200,
  cost: 10000,
  current: 15000,
  gasUnits: 21000,
  gwei: 30,
  ethPrice: 3200,
};
const BANKING_INPUT = {
  amount: 1000,
  rate: 83,
  feePct: 1,
  fixedFee: 5,
  markupPct: 2,
};
const TRAVEL_INPUT = {
  amount: 1000,
  rate: 0.92,
  rateB: 0.95,
  daily: 100,
  days: 7,
  people: 2,
  total: 450,
};
const BUSINESS_INPUT = {
  amount: 1000,
  rate: 83,
  dutyPct: 10,
  freight: 500,
  cost: 100,
  marginPct: 20,
  markupPct: 15,
  sellPrice: 15000,
};
const INFLATION_INPUT = {
  amount: 1000,
  inflationPct: 5,
  years: 10,
  oldRate: 75,
  newRate: 83,
  basketA: 100,
  basketB: 120,
  income: 50000,
};
const SMART_INPUT = {
  rate: 83,
  expectedMovePct: 2,
  trendScore: 2,
  volatility: 5,
  daily: 100,
  days: 7,
  bufferPct: 10,
  amount: 10000,
  returnA: 5,
  returnB: 3,
  weightA: 60,
};
const TIME_INPUT = {
  startRate: 80,
  endRate: 83,
  highRate: 84,
  lowRate: 79,
  rateA: 82,
  rateB: 83,
  amount: 1000,
};
const MICRO_INPUT = {
  amount: 100000,
  rate: 83,
  rateB: 83.2,
  feePct: 1,
  fixedFee: 5,
  oldRate: 80,
  newRate: 83,
};

describe("currency engines smoke", () => {
  it("covers every basic slug", () => {
    expect(ALL_CUR_BASIC_SLUGS.length).toBe(10);
    for (const slug of ALL_CUR_BASIC_SLUGS) {
      expect(computeCurBasic(slug, BASIC_INPUT).ok, slug).toBe(true);
    }
  });

  it("covers every advanced slug", () => {
    expect(ALL_CUR_ADVANCED_SLUGS.length).toBe(6);
    for (const slug of ALL_CUR_ADVANCED_SLUGS) {
      expect(computeCurAdvanced(slug, ADVANCED_INPUT).ok, slug).toBe(true);
    }
  });

  it("covers every forex slug", () => {
    expect(ALL_CUR_FOREX_SLUGS.length).toBe(9);
    for (const slug of ALL_CUR_FOREX_SLUGS) {
      expect(computeCurForex(slug, FOREX_INPUT).ok, slug).toBe(true);
    }
  });

  it("covers every crypto slug", () => {
    expect(ALL_CUR_CRYPTO_SLUGS.length).toBe(9);
    for (const slug of ALL_CUR_CRYPTO_SLUGS) {
      expect(computeCurCrypto(slug, CRYPTO_INPUT).ok, slug).toBe(true);
    }
  });

  it("covers every banking slug", () => {
    expect(ALL_CUR_BANKING_SLUGS.length).toBe(7);
    for (const slug of ALL_CUR_BANKING_SLUGS) {
      expect(computeCurBanking(slug, BANKING_INPUT).ok, slug).toBe(true);
    }
  });

  it("covers every travel slug", () => {
    expect(ALL_CUR_TRAVEL_SLUGS.length).toBe(5);
    for (const slug of ALL_CUR_TRAVEL_SLUGS) {
      expect(computeCurTravel(slug, TRAVEL_INPUT).ok, slug).toBe(true);
    }
  });

  it("covers every business slug", () => {
    expect(ALL_CUR_BUSINESS_SLUGS.length).toBe(5);
    for (const slug of ALL_CUR_BUSINESS_SLUGS) {
      expect(computeCurBusiness(slug, BUSINESS_INPUT).ok, slug).toBe(true);
    }
  });

  it("covers every inflation slug", () => {
    expect(ALL_CUR_INFLATION_SLUGS.length).toBe(4);
    for (const slug of ALL_CUR_INFLATION_SLUGS) {
      expect(computeCurInflation(slug, INFLATION_INPUT).ok, slug).toBe(true);
    }
  });

  it("covers every smart slug", () => {
    expect(ALL_CUR_SMART_SLUGS.length).toBe(4);
    for (const slug of ALL_CUR_SMART_SLUGS) {
      expect(computeCurSmart(slug, SMART_INPUT).ok, slug).toBe(true);
    }
  });

  it("covers every time slug", () => {
    expect(ALL_CUR_TIME_SLUGS.length).toBe(4);
    for (const slug of ALL_CUR_TIME_SLUGS) {
      expect(computeCurTime(slug, TIME_INPUT).ok, slug).toBe(true);
    }
  });

  it("covers every micro slug", () => {
    expect(ALL_CUR_MICRO_SLUGS.length).toBe(6);
    for (const slug of ALL_CUR_MICRO_SLUGS) {
      expect(computeCurMicro(slug, MICRO_INPUT).ok, slug).toBe(true);
    }
  });

  it("covers all 69 currency slugs combined", () => {
    const all = [
      ...ALL_CUR_BASIC_SLUGS,
      ...ALL_CUR_ADVANCED_SLUGS,
      ...ALL_CUR_FOREX_SLUGS,
      ...ALL_CUR_CRYPTO_SLUGS,
      ...ALL_CUR_BANKING_SLUGS,
      ...ALL_CUR_TRAVEL_SLUGS,
      ...ALL_CUR_BUSINESS_SLUGS,
      ...ALL_CUR_INFLATION_SLUGS,
      ...ALL_CUR_SMART_SLUGS,
      ...ALL_CUR_TIME_SLUGS,
      ...ALL_CUR_MICRO_SLUGS,
    ];
    expect(all.length).toBe(69);
  });
});
