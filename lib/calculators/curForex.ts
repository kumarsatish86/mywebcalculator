/** Forex trading calculators — teaching lot/pip/margin estimates. */
import { nonNeg, pos } from "./curHelpers";

export type CurForexSlug =
  | "cur-forex-profit-calculator"
  | "cur-forex-lot-size-calculator"
  | "cur-pip-value-calculator"
  | "cur-margin-calculator-forex"
  | "cur-leverage-calculator"
  | "cur-risk-reward-ratio-calculator"
  | "cur-stop-loss-calculator"
  | "cur-swap-calculator"
  | "cur-position-size-calculator";

export const ALL_CUR_FOREX_SLUGS: CurForexSlug[] = [
  "cur-forex-profit-calculator",
  "cur-forex-lot-size-calculator",
  "cur-pip-value-calculator",
  "cur-margin-calculator-forex",
  "cur-leverage-calculator",
  "cur-risk-reward-ratio-calculator",
  "cur-stop-loss-calculator",
  "cur-swap-calculator",
  "cur-position-size-calculator",
];

export type CurForexInput = {
  entry?: number;
  exit?: number;
  lots?: number;
  contractSize?: number;
  pipValue?: number;
  stopPips?: number;
  riskAmount?: number;
  account?: number;
  riskPct?: number;
  price?: number;
  leverage?: number;
  reward?: number;
  risk?: number;
  direction?: number;
  swapPerLot?: number;
  nights?: number;
  notional?: number;
  margin?: number;
};

export type CurForexResult =
  | { ok: false; error: string }
  | {
      ok: true;
      profit?: number;
      lotSize?: number;
      pipValue?: number;
      margin?: number;
      leverage?: number;
      ratio?: number;
      stopPrice?: number;
      swap?: number;
      positionSize?: number;
      riskAmount?: number;
      note: string;
    };

export function computeCurForex(slug: CurForexSlug, input: CurForexInput): CurForexResult {
  switch (slug) {
    case "cur-forex-profit-calculator": {
      const entry = pos(input.entry, "Entry");
      if (typeof entry !== "number") return { ok: false, error: entry.error };
      const exit = pos(input.exit, "Exit");
      if (typeof exit !== "number") return { ok: false, error: exit.error };
      const lots = pos(input.lots ?? 1, "Lots");
      if (typeof lots !== "number") return { ok: false, error: lots.error };
      const contract = pos(input.contractSize ?? 100_000, "Contract size");
      if (typeof contract !== "number") return { ok: false, error: contract.error };
      const dir = input.direction === -1 ? -1 : 1;
      return {
        ok: true,
        profit: (exit - entry) * dir * lots * contract,
        note: "P/L ≈ (exit−entry)×direction×lots×contract (quote units).",
      };
    }
    case "cur-forex-lot-size-calculator": {
      const riskAmt = pos(input.riskAmount, "Risk amount");
      if (typeof riskAmt !== "number") return { ok: false, error: riskAmt.error };
      const stop = pos(input.stopPips, "Stop pips");
      if (typeof stop !== "number") return { ok: false, error: stop.error };
      const pipVal = pos(input.pipValue, "Pip value per lot");
      if (typeof pipVal !== "number") return { ok: false, error: pipVal.error };
      return {
        ok: true,
        lotSize: riskAmt / (stop * pipVal),
        note: "Lots ≈ risk ÷ (stop pips × pip value/lot).",
      };
    }
    case "cur-pip-value-calculator": {
      const lots = pos(input.lots ?? 1, "Lots");
      if (typeof lots !== "number") return { ok: false, error: lots.error };
      const contract = pos(input.contractSize ?? 100_000, "Contract size");
      if (typeof contract !== "number") return { ok: false, error: contract.error };
      const pipSize = pos(input.pipValue ?? 0.0001, "Pip size");
      if (typeof pipSize !== "number") return { ok: false, error: pipSize.error };
      return {
        ok: true,
        pipValue: lots * contract * pipSize,
        note: "Pip value ≈ lots × contract × pip size (teaching form).",
      };
    }
    case "cur-margin-calculator-forex": {
      const lots = pos(input.lots ?? 1, "Lots");
      if (typeof lots !== "number") return { ok: false, error: lots.error };
      const contract = pos(input.contractSize ?? 100_000, "Contract size");
      if (typeof contract !== "number") return { ok: false, error: contract.error };
      const price = pos(input.price ?? input.entry, "Price");
      if (typeof price !== "number") return { ok: false, error: price.error };
      const lev = pos(input.leverage ?? 100, "Leverage");
      if (typeof lev !== "number") return { ok: false, error: lev.error };
      return {
        ok: true,
        margin: (lots * contract * price) / lev,
        note: "Margin ≈ (lots × contract × price) ÷ leverage.",
      };
    }
    case "cur-leverage-calculator": {
      const notional = pos(input.notional ?? input.price, "Notional");
      if (typeof notional !== "number") return { ok: false, error: notional.error };
      const margin = pos(input.margin ?? input.riskAmount, "Margin");
      if (typeof margin !== "number") return { ok: false, error: margin.error };
      return {
        ok: true,
        leverage: notional / margin,
        note: "Leverage ≈ notional ÷ margin.",
      };
    }
    case "cur-risk-reward-ratio-calculator": {
      const risk = pos(input.risk, "Risk");
      if (typeof risk !== "number") return { ok: false, error: risk.error };
      const reward = pos(input.reward, "Reward");
      if (typeof reward !== "number") return { ok: false, error: reward.error };
      return { ok: true, ratio: reward / risk, note: "R:R = reward ÷ risk." };
    }
    case "cur-stop-loss-calculator": {
      const entry = pos(input.entry, "Entry");
      if (typeof entry !== "number") return { ok: false, error: entry.error };
      const stop = pos(input.stopPips, "Stop distance (price units)");
      if (typeof stop !== "number") return { ok: false, error: stop.error };
      const dir = input.direction === -1 ? -1 : 1;
      return {
        ok: true,
        stopPrice: entry - dir * stop,
        note: "Stop = entry − direction × stop distance (long=1).",
      };
    }
    case "cur-swap-calculator": {
      const lots = pos(input.lots ?? 1, "Lots");
      if (typeof lots !== "number") return { ok: false, error: lots.error };
      const swap = nonNeg(input.swapPerLot ?? 0, "Swap per lot/night");
      if (typeof swap !== "number") return { ok: false, error: swap.error };
      const nights = pos(input.nights ?? 1, "Nights");
      if (typeof nights !== "number") return { ok: false, error: nights.error };
      return {
        ok: true,
        swap: lots * swap * nights,
        note: "Swap ≈ lots × swap/lot/night × nights.",
      };
    }
    case "cur-position-size-calculator": {
      const account = pos(input.account, "Account");
      if (typeof account !== "number") return { ok: false, error: account.error };
      const riskPct = pos(input.riskPct, "Risk %");
      if (typeof riskPct !== "number") return { ok: false, error: riskPct.error };
      const stop = pos(input.stopPips, "Stop pips");
      if (typeof stop !== "number") return { ok: false, error: stop.error };
      const pipVal = pos(input.pipValue, "Pip value per unit");
      if (typeof pipVal !== "number") return { ok: false, error: pipVal.error };
      const riskAmt = account * (riskPct / 100);
      return {
        ok: true,
        positionSize: riskAmt / (stop * pipVal),
        riskAmount: riskAmt,
        note: "Size ≈ (account×risk%) ÷ (stop×pip value).",
      };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
