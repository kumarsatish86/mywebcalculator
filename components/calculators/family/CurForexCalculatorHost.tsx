"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { CUR_URL } from "@/lib/calculators/curHelpers";
import {
  computeCurForex,
  type CurForexInput,
  type CurForexResult,
  type CurForexSlug,
} from "@/lib/calculators/curForex";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode =
  | "profit"
  | "lotSize"
  | "pipValue"
  | "margin"
  | "leverage"
  | "riskReward"
  | "stopLoss"
  | "swap"
  | "positionSize";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  lDefault: string;
  dDefault: string;
  nDefault: string;
  pDefault: string;
  qDefault: string;
  sDefault: string;
};

const EMPTY = {
  aDefault: "", bDefault: "", cDefault: "", rDefault: "", lDefault: "",
  dDefault: "", nDefault: "", pDefault: "", qDefault: "", sDefault: "",
};

const DISCLAIMER =
  "Teaching FX estimate only — illustrative rates and contract sizes, not live market data.";

const CONFIG: Record<CurForexSlug, Config> = {
  "cur-forex-profit-calculator": {
    title: "Forex profit",
    description: `P/L from entry, exit, lots, and contract size. ${DISCLAIMER}`,
    mode: "profit",
    ...EMPTY, aDefault: "1.1000", bDefault: "1.1050", cDefault: "1", rDefault: "100000",
  },
  "cur-forex-lot-size-calculator": {
    title: "Forex lot size",
    description: `Lots from risk, stop pips, and pip value. ${DISCLAIMER}`,
    mode: "lotSize",
    ...EMPTY, aDefault: "100", dDefault: "20", pDefault: "10",
  },
  "cur-pip-value-calculator": {
    title: "Pip value",
    description: `Pip value from lots, contract, and pip size. ${DISCLAIMER}`,
    mode: "pipValue",
    ...EMPTY, cDefault: "1", rDefault: "100000", pDefault: "0.0001",
  },
  "cur-margin-calculator-forex": {
    title: "Forex margin",
    description: `Margin from lots, price, and leverage. ${DISCLAIMER}`,
    mode: "margin",
    ...EMPTY, cDefault: "1", rDefault: "1.10", lDefault: "100",
  },
  "cur-leverage-calculator": {
    title: "Leverage",
    description: `Leverage = notional ÷ margin. ${DISCLAIMER}`,
    mode: "leverage",
    ...EMPTY, rDefault: "100000", cDefault: "1000",
  },
  "cur-risk-reward-ratio-calculator": {
    title: "Risk/reward ratio",
    description: `R:R = reward ÷ risk. ${DISCLAIMER}`,
    mode: "riskReward",
    ...EMPTY, aDefault: "100", bDefault: "250",
  },
  "cur-stop-loss-calculator": {
    title: "Stop loss price",
    description: `Stop from entry and distance (long direction default). ${DISCLAIMER}`,
    mode: "stopLoss",
    ...EMPTY, aDefault: "1.1000", dDefault: "0.0050",
  },
  "cur-swap-calculator": {
    title: "Swap / rollover",
    description: `Swap ≈ lots × swap/lot/night × nights. ${DISCLAIMER}`,
    mode: "swap",
    ...EMPTY, cDefault: "1", sDefault: "5", nDefault: "3",
  },
  "cur-position-size-calculator": {
    title: "Position size",
    description: `Size from account risk % and stop. ${DISCLAIMER}`,
    mode: "positionSize",
    ...EMPTY, aDefault: "10000", pDefault: "1", dDefault: "20", qDefault: "10",
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

function formatResult(res: CurForexResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.profit !== undefined) rows.push({ label: "Profit", value: num(res.profit, 2) });
  if (res.lotSize !== undefined) rows.push({ label: "Lot size", value: num(res.lotSize, 4) });
  if (res.pipValue !== undefined) rows.push({ label: "Pip value", value: num(res.pipValue, 4) });
  if (res.margin !== undefined) rows.push({ label: "Margin", value: num(res.margin, 2) });
  if (res.leverage !== undefined) rows.push({ label: "Leverage", value: num(res.leverage, 2) });
  if (res.ratio !== undefined) rows.push({ label: "R:R ratio", value: num(res.ratio, 2) });
  if (res.stopPrice !== undefined) rows.push({ label: "Stop price", value: num(res.stopPrice, 5) });
  if (res.swap !== undefined) rows.push({ label: "Swap", value: num(res.swap, 2) });
  if (res.positionSize !== undefined) rows.push({ label: "Position size", value: num(res.positionSize, 4) });
  if (res.riskAmount !== undefined) rows.push({ label: "Risk amount", value: num(res.riskAmount, 2) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.profit !== undefined ? num(res.profit, 2)
    : res.lotSize !== undefined ? num(res.lotSize, 4)
    : res.pipValue !== undefined ? num(res.pipValue, 4)
    : res.margin !== undefined ? num(res.margin, 2)
    : res.leverage !== undefined ? num(res.leverage, 2)
    : res.ratio !== undefined ? num(res.ratio, 2)
    : res.stopPrice !== undefined ? num(res.stopPrice, 5)
    : res.swap !== undefined ? num(res.swap, 2)
    : res.positionSize !== undefined ? num(res.positionSize, 4)
    : "—";
  const primaryLabel =
    res.profit !== undefined ? "Profit"
    : res.lotSize !== undefined ? "Lot size"
    : res.pipValue !== undefined ? "Pip value"
    : res.margin !== undefined ? "Margin"
    : res.leverage !== undefined ? "Leverage"
    : res.ratio !== undefined ? "R:R ratio"
    : res.stopPrice !== undefined ? "Stop price"
    : res.swap !== undefined ? "Swap"
    : "Position size";
  return { primary, primaryLabel, rows };
}

export function CurForexCalculatorHost({ slug }: { slug: string }) {
  const key = slug as CurForexSlug;
  const config = CONFIG[key] ?? CONFIG["cur-forex-profit-calculator"];
  const [a, setA] = useState(useLoanInitialInput(CUR_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(CUR_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(CUR_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(CUR_URL.R, config.rDefault));
  const [l, setL] = useState(useLoanInitialInput(CUR_URL.L, config.lDefault));
  const [d, setD] = useState(useLoanInitialInput(CUR_URL.D, config.dDefault));
  const [n, setN] = useState(useLoanInitialInput(CUR_URL.N, config.nDefault));
  const [p, setP] = useState(useLoanInitialInput(CUR_URL.P, config.pDefault));
  const [q, setQ] = useState(useLoanInitialInput(CUR_URL.Q, config.qDefault));
  const [s, setS] = useState(useLoanInitialInput(CUR_URL.S, config.sDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, val: string) => { if (val.trim() !== "") out[k] = val; };
    switch (config.mode) {
      case "profit":
        put(CUR_URL.A, a); put(CUR_URL.B, b); put(CUR_URL.C, c); put(CUR_URL.R, r);
        break;
      case "lotSize":
        put(CUR_URL.A, a); put(CUR_URL.D, d); put(CUR_URL.P, p);
        break;
      case "pipValue":
        put(CUR_URL.C, c); put(CUR_URL.R, r); put(CUR_URL.P, p);
        break;
      case "margin":
        put(CUR_URL.C, c); put(CUR_URL.R, r); put(CUR_URL.L, l);
        break;
      case "leverage":
        put(CUR_URL.R, r); put(CUR_URL.C, c);
        break;
      case "riskReward":
        put(CUR_URL.A, a); put(CUR_URL.B, b);
        break;
      case "stopLoss":
        put(CUR_URL.A, a); put(CUR_URL.D, d);
        break;
      case "swap":
        put(CUR_URL.C, c); put(CUR_URL.S, s); put(CUR_URL.N, n);
        break;
      case "positionSize":
        put(CUR_URL.A, a); put(CUR_URL.P, p); put(CUR_URL.D, d); put(CUR_URL.Q, q);
        break;
    }
    return out;
  }, [a, b, c, config.mode, d, n, p, r, l, s]);

  useLoanUrlSync(shareParams, [a, b, c, d, l, n, p, q, r, s]);

  const result = useMemo(() => {
    const input: CurForexInput = {};
    switch (config.mode) {
      case "profit": {
        const entry = parsePositive(a, "Entry");
        if (!entry.ok) return { error: entry.error };
        input.entry = entry.value;
        const exit = parsePositive(b, "Exit");
        if (!exit.ok) return { error: exit.error };
        input.exit = exit.value;
        const lots = parsePositive(c, "Lots");
        if (!lots.ok) return { error: lots.error };
        input.lots = lots.value;
        const contract = parsePositive(r, "Contract size");
        if (!contract.ok) return { error: contract.error };
        input.contractSize = contract.value;
        break;
      }
      case "lotSize": {
        const riskAmt = parsePositive(a, "Risk amount");
        if (!riskAmt.ok) return { error: riskAmt.error };
        input.riskAmount = riskAmt.value;
        const stop = parsePositive(d, "Stop pips");
        if (!stop.ok) return { error: stop.error };
        input.stopPips = stop.value;
        const pipVal = parsePositive(p, "Pip value per lot");
        if (!pipVal.ok) return { error: pipVal.error };
        input.pipValue = pipVal.value;
        break;
      }
      case "pipValue": {
        const lots = parsePositive(c, "Lots");
        if (!lots.ok) return { error: lots.error };
        input.lots = lots.value;
        const contract = parsePositive(r, "Contract size");
        if (!contract.ok) return { error: contract.error };
        input.contractSize = contract.value;
        const pipSize = parsePositive(p, "Pip size");
        if (!pipSize.ok) return { error: pipSize.error };
        input.pipValue = pipSize.value;
        break;
      }
      case "margin": {
        const lots = parsePositive(c, "Lots");
        if (!lots.ok) return { error: lots.error };
        input.lots = lots.value;
        const price = parsePositive(r, "Price");
        if (!price.ok) return { error: price.error };
        input.price = price.value;
        const lev = parsePositive(l, "Leverage");
        if (!lev.ok) return { error: lev.error };
        input.leverage = lev.value;
        break;
      }
      case "leverage": {
        const notional = parsePositive(r, "Notional");
        if (!notional.ok) return { error: notional.error };
        input.notional = notional.value;
        const margin = parsePositive(c, "Margin");
        if (!margin.ok) return { error: margin.error };
        input.margin = margin.value;
        break;
      }
      case "riskReward": {
        const risk = parsePositive(a, "Risk");
        if (!risk.ok) return { error: risk.error };
        input.risk = risk.value;
        const reward = parsePositive(b, "Reward");
        if (!reward.ok) return { error: reward.error };
        input.reward = reward.value;
        break;
      }
      case "stopLoss": {
        const entry = parsePositive(a, "Entry");
        if (!entry.ok) return { error: entry.error };
        input.entry = entry.value;
        const stop = parsePositive(d, "Stop distance");
        if (!stop.ok) return { error: stop.error };
        input.stopPips = stop.value;
        break;
      }
      case "swap": {
        const lots = parsePositive(c, "Lots");
        if (!lots.ok) return { error: lots.error };
        input.lots = lots.value;
        const swap = optNonNeg(s, "Swap per lot/night");
        if (swap && typeof swap === "object") return { error: swap.error };
        if (typeof swap === "number") input.swapPerLot = swap;
        const nights = parsePositive(n, "Nights");
        if (!nights.ok) return { error: nights.error };
        input.nights = nights.value;
        break;
      }
      case "positionSize": {
        const account = parsePositive(a, "Account");
        if (!account.ok) return { error: account.error };
        input.account = account.value;
        const riskPct = parsePositive(p, "Risk %");
        if (!riskPct.ok) return { error: riskPct.error };
        input.riskPct = riskPct.value;
        const stop = parsePositive(d, "Stop pips");
        if (!stop.ok) return { error: stop.error };
        input.stopPips = stop.value;
        const pipVal = parsePositive(q, "Pip value per unit");
        if (!pipVal.ok) return { error: pipVal.error };
        input.pipValue = pipVal.value;
        break;
      }
    }
    return formatResult(
      computeCurForex(key in CONFIG ? key : "cur-forex-profit-calculator", input),
      num,
    );
  }, [a, b, c, config.mode, d, key, l, n, p, q, r, s]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "profit" ? (
            <>
              <div><FieldLabel htmlFor="cur-a">Entry</FieldLabel><FieldInput id="cur-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-b">Exit</FieldLabel><FieldInput id="cur-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-c">Lots</FieldLabel><FieldInput id="cur-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-r">Contract size</FieldLabel><FieldInput id="cur-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "lotSize" ? (
            <>
              <div><FieldLabel htmlFor="cur-a">Risk amount</FieldLabel><FieldInput id="cur-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-d">Stop pips</FieldLabel><FieldInput id="cur-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-p">Pip value per lot</FieldLabel><FieldInput id="cur-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "pipValue" ? (
            <>
              <div><FieldLabel htmlFor="cur-c">Lots</FieldLabel><FieldInput id="cur-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-r">Contract size</FieldLabel><FieldInput id="cur-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-p">Pip size</FieldLabel><FieldInput id="cur-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "margin" ? (
            <>
              <div><FieldLabel htmlFor="cur-c">Lots</FieldLabel><FieldInput id="cur-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-r">Price</FieldLabel><FieldInput id="cur-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-l">Leverage</FieldLabel><FieldInput id="cur-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "leverage" ? (
            <>
              <div><FieldLabel htmlFor="cur-r">Notional</FieldLabel><FieldInput id="cur-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-c">Margin</FieldLabel><FieldInput id="cur-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "riskReward" ? (
            <>
              <div><FieldLabel htmlFor="cur-a">Risk</FieldLabel><FieldInput id="cur-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-b">Reward</FieldLabel><FieldInput id="cur-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "stopLoss" ? (
            <>
              <div><FieldLabel htmlFor="cur-a">Entry</FieldLabel><FieldInput id="cur-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-d">Stop distance</FieldLabel><FieldInput id="cur-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "swap" ? (
            <>
              <div><FieldLabel htmlFor="cur-c">Lots</FieldLabel><FieldInput id="cur-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-s">Swap per lot/night</FieldLabel><FieldInput id="cur-s" value={s} onChange={(ev) => setS(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-n">Nights</FieldLabel><FieldInput id="cur-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "positionSize" ? (
            <>
              <div><FieldLabel htmlFor="cur-a">Account</FieldLabel><FieldInput id="cur-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-p">Risk %</FieldLabel><FieldInput id="cur-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-d">Stop pips</FieldLabel><FieldInput id="cur-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-q">Pip value per unit</FieldLabel><FieldInput id="cur-q" value={q} onChange={(ev) => setQ(ev.target.value)} inputMode="decimal" /></div>
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
