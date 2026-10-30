"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { CUR_URL, ILLUSTRATIVE } from "@/lib/calculators/curHelpers";
import {
  computeCurCrypto,
  type CurCryptoInput,
  type CurCryptoResult,
  type CurCryptoSlug,
} from "@/lib/calculators/curCrypto";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode =
  | "convert"
  | "profit"
  | "mining"
  | "staking"
  | "tax"
  | "portfolio"
  | "roi"
  | "gas";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  rDefault: string;
  pDefault: string;
  dDefault: string;
  cDefault: string;
  mDefault: string;
  vDefault: string;
  hDefault: string;
  wDefault: string;
};

const EMPTY = {
  aDefault: "", bDefault: "", rDefault: "", pDefault: "", dDefault: "",
  cDefault: "", mDefault: "", vDefault: "", hDefault: "", wDefault: "",
};

const DISCLAIMER =
  "Teaching crypto estimate only — illustrative prices, not live market data.";

const CONFIG: Record<CurCryptoSlug, Config> = {
  "cur-bitcoin-to-inr-calculator": {
    title: "Bitcoin to INR",
    description: `BTC × illustrative INR price (example ~55L). ${DISCLAIMER}`,
    mode: "convert",
    ...EMPTY, aDefault: "0.1", rDefault: String(ILLUSTRATIVE.BTC_INR),
  },
  "cur-ethereum-to-usd-calculator": {
    title: "Ethereum to USD",
    description: `ETH × illustrative USD price (example ${ILLUSTRATIVE.ETH_USD}). ${DISCLAIMER}`,
    mode: "convert",
    ...EMPTY, aDefault: "1", rDefault: String(ILLUSTRATIVE.ETH_USD),
  },
  "cur-crypto-profit-calculator": {
    title: "Crypto profit",
    description: `(Sell − buy) × units − fees. ${DISCLAIMER}`,
    mode: "profit",
    ...EMPTY, aDefault: "1", bDefault: "50000", rDefault: "65000", pDefault: "0.5",
  },
  "cur-crypto-mining-calculator": {
    title: "Crypto mining",
    description: `Net ≈ (reward − power) × days. ${DISCLAIMER}`,
    mode: "mining",
    ...EMPTY, rDefault: "15", dDefault: "30", mDefault: "3", hDefault: "1",
  },
  "cur-crypto-staking-calculator": {
    title: "Crypto staking",
    description: `Yield ≈ stake × APY × days/365. ${DISCLAIMER}`,
    mode: "staking",
    ...EMPTY, aDefault: "1000", pDefault: "5", dDefault: "365",
  },
  "cur-crypto-tax-calculator": {
    title: "Crypto tax",
    description: `Tax ≈ gain × tax%. Not tax advice. ${DISCLAIMER}`,
    mode: "tax",
    ...EMPTY, aDefault: "50000", pDefault: "30",
  },
  "cur-crypto-portfolio-calculator": {
    title: "Crypto portfolio",
    description: `Σ(holding × illustrative price). ${DISCLAIMER}`,
    mode: "portfolio",
    ...EMPTY, aDefault: "0.5", rDefault: "5500000", bDefault: "2", pDefault: "3200",
  },
  "cur-crypto-roi-calculator": {
    title: "Crypto ROI",
    description: `ROI% = (current − cost) ÷ cost × 100. ${DISCLAIMER}`,
    mode: "roi",
    ...EMPTY, cDefault: "10000", aDefault: "15000",
  },
  "cur-ethereum-gas-fee-calculator": {
    title: "Ethereum gas fee",
    description: `Fee = gas × gwei / 1e9 ETH × ETH price. ${DISCLAIMER}`,
    mode: "gas",
    ...EMPTY, aDefault: "21000", pDefault: "30", rDefault: String(ILLUSTRATIVE.ETH_USD),
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

function formatResult(res: CurCryptoResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.converted !== undefined) rows.push({ label: "Converted", value: num(res.converted, 2) });
  if (res.profit !== undefined) rows.push({ label: "Profit", value: num(res.profit, 2) });
  if (res.netMining !== undefined) rows.push({ label: "Net mining", value: num(res.netMining, 2) });
  if (res.stakingYield !== undefined) rows.push({ label: "Staking yield", value: num(res.stakingYield, 2) });
  if (res.tax !== undefined) rows.push({ label: "Tax", value: num(res.tax, 2) });
  if (res.portfolio !== undefined) rows.push({ label: "Portfolio", value: num(res.portfolio, 2) });
  if (res.roiPct !== undefined) rows.push({ label: "ROI %", value: num(res.roiPct, 2) });
  if (res.gasFee !== undefined) rows.push({ label: "Gas fee (USD)", value: num(res.gasFee, 2) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.portfolio !== undefined ? num(res.portfolio, 2)
    : res.converted !== undefined ? num(res.converted, 2)
    : res.profit !== undefined ? num(res.profit, 2)
    : res.netMining !== undefined ? num(res.netMining, 2)
    : res.stakingYield !== undefined ? num(res.stakingYield, 2)
    : res.tax !== undefined ? num(res.tax, 2)
    : res.roiPct !== undefined ? num(res.roiPct, 2)
    : res.gasFee !== undefined ? num(res.gasFee, 2)
    : "—";
  const primaryLabel =
    res.portfolio !== undefined ? "Portfolio"
    : res.converted !== undefined ? "Converted"
    : res.profit !== undefined ? "Profit"
    : res.netMining !== undefined ? "Net mining"
    : res.stakingYield !== undefined ? "Staking yield"
    : res.tax !== undefined ? "Tax"
    : res.roiPct !== undefined ? "ROI %"
    : "Gas fee";
  return { primary, primaryLabel, rows };
}

export function CurCryptoCalculatorHost({ slug }: { slug: string }) {
  const key = slug as CurCryptoSlug;
  const config = CONFIG[key] ?? CONFIG["cur-bitcoin-to-inr-calculator"];
  const [a, setA] = useState(useLoanInitialInput(CUR_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(CUR_URL.B, config.bDefault));
  const [r, setR] = useState(useLoanInitialInput(CUR_URL.R, config.rDefault));
  const [p, setP] = useState(useLoanInitialInput(CUR_URL.P, config.pDefault));
  const [d, setD] = useState(useLoanInitialInput(CUR_URL.D, config.dDefault));
  const [c, setC] = useState(useLoanInitialInput(CUR_URL.C, config.cDefault));
  const [m, setM] = useState(useLoanInitialInput(CUR_URL.M, config.mDefault));
  const [h, setH] = useState(useLoanInitialInput(CUR_URL.H, config.hDefault));
  const [w, setW] = useState(useLoanInitialInput(CUR_URL.W, config.wDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, val: string) => { if (val.trim() !== "") out[k] = val; };
    switch (config.mode) {
      case "convert":
        put(CUR_URL.A, a); put(CUR_URL.R, r);
        break;
      case "profit":
        put(CUR_URL.A, a); put(CUR_URL.B, b); put(CUR_URL.R, r); put(CUR_URL.P, p);
        break;
      case "mining":
        put(CUR_URL.R, r); put(CUR_URL.D, d); put(CUR_URL.M, m); put(CUR_URL.H, h);
        break;
      case "staking":
        put(CUR_URL.A, a); put(CUR_URL.P, p); put(CUR_URL.D, d);
        break;
      case "tax":
        put(CUR_URL.A, a); put(CUR_URL.P, p);
        break;
      case "portfolio":
        put(CUR_URL.A, a); put(CUR_URL.R, r); put(CUR_URL.B, b); put(CUR_URL.P, p);
        break;
      case "roi":
        put(CUR_URL.C, c); put(CUR_URL.A, a);
        break;
      case "gas":
        put(CUR_URL.A, a); put(CUR_URL.P, p); put(CUR_URL.R, r);
        break;
    }
    return out;
  }, [a, b, c, config.mode, d, h, m, p, r]);

  useLoanUrlSync(shareParams, [a, b, c, d, h, m, p, r, w]);

  const result = useMemo(() => {
    const input: CurCryptoInput = {};
    switch (config.mode) {
      case "convert": {
        const amt = parsePositive(a, "Amount");
        if (!amt.ok) return { error: amt.error };
        input.amount = amt.value;
        const rate = parsePositive(r, "Rate");
        if (!rate.ok) return { error: rate.error };
        input.rate = rate.value;
        break;
      }
      case "profit": {
        const amt = parsePositive(a, "Units");
        if (!amt.ok) return { error: amt.error };
        input.amount = amt.value;
        const buy = parsePositive(b, "Buy price");
        if (!buy.ok) return { error: buy.error };
        input.buyPrice = buy.value;
        const sell = parsePositive(r, "Sell price");
        if (!sell.ok) return { error: sell.error };
        input.sellPrice = sell.value;
        const feePct = optNonNeg(p, "Fee %");
        if (feePct && typeof feePct === "object") return { error: feePct.error };
        if (typeof feePct === "number") input.feePct = feePct;
        break;
      }
      case "mining": {
        const reward = parsePositive(r, "Daily reward value");
        if (!reward.ok) return { error: reward.error };
        input.rewardPerDay = reward.value;
        const days = parsePositive(d, "Days");
        if (!days.ok) return { error: days.error };
        input.days = days.value;
        const power = optNonNeg(m, "Daily power cost");
        if (power && typeof power === "object") return { error: power.error };
        if (typeof power === "number") input.powerCost = power;
        const hash = optNonNeg(h, "Hashrate scale");
        if (hash && typeof hash === "object") return { error: hash.error };
        if (typeof hash === "number") input.hashrate = hash;
        break;
      }
      case "staking": {
        const amt = parsePositive(a, "Staked amount");
        if (!amt.ok) return { error: amt.error };
        input.amount = amt.value;
        const apy = optNonNeg(p, "APY %");
        if (apy && typeof apy === "object") return { error: apy.error };
        if (typeof apy === "number") input.apyPct = apy;
        const days = parsePositive(d, "Days");
        if (!days.ok) return { error: days.error };
        input.days = days.value;
        break;
      }
      case "tax": {
        const gain = parsePositive(a, "Taxable gain");
        if (!gain.ok) return { error: gain.error };
        input.gain = gain.value;
        const taxPct = optNonNeg(p, "Tax %");
        if (taxPct && typeof taxPct === "object") return { error: taxPct.error };
        if (typeof taxPct === "number") input.taxPct = taxPct;
        break;
      }
      case "portfolio": {
        const ha = optNonNeg(a, "Holding A");
        if (ha && typeof ha === "object") return { error: ha.error };
        if (typeof ha === "number") input.holdingA = ha;
        const pa = optNonNeg(r, "Price A");
        if (pa && typeof pa === "object") return { error: pa.error };
        if (typeof pa === "number") input.priceA = pa;
        const hb = optNonNeg(b, "Holding B");
        if (hb && typeof hb === "object") return { error: hb.error };
        if (typeof hb === "number") input.holdingB = hb;
        const pb = optNonNeg(p, "Price B");
        if (pb && typeof pb === "object") return { error: pb.error };
        if (typeof pb === "number") input.priceB = pb;
        break;
      }
      case "roi": {
        const cost = parsePositive(c, "Cost basis");
        if (!cost.ok) return { error: cost.error };
        input.cost = cost.value;
        const current = parsePositive(a, "Current value");
        if (!current.ok) return { error: current.error };
        input.current = current.value;
        break;
      }
      case "gas": {
        const gas = parsePositive(a, "Gas units");
        if (!gas.ok) return { error: gas.error };
        input.gasUnits = gas.value;
        const gwei = parsePositive(p, "Gwei");
        if (!gwei.ok) return { error: gwei.error };
        input.gwei = gwei.value;
        const ethPrice = parsePositive(r, "ETH price");
        if (!ethPrice.ok) return { error: ethPrice.error };
        input.ethPrice = ethPrice.value;
        break;
      }
    }
    return formatResult(
      computeCurCrypto(key in CONFIG ? key : "cur-bitcoin-to-inr-calculator", input),
      num,
    );
  }, [a, b, c, config.mode, d, h, key, m, p, r]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {(config.mode === "convert" || config.mode === "staking" || config.mode === "tax") ? (
            <div>
              <FieldLabel htmlFor="cur-a">{config.mode === "tax" ? "Taxable gain" : config.mode === "staking" ? "Staked amount" : "Amount"}</FieldLabel>
              <FieldInput id="cur-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}
          {config.mode === "profit" ? (
            <>
              <div><FieldLabel htmlFor="cur-a">Units</FieldLabel><FieldInput id="cur-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-b">Buy price</FieldLabel><FieldInput id="cur-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-r">Sell price</FieldLabel><FieldInput id="cur-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-p">Fee %</FieldLabel><FieldInput id="cur-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "mining" ? (
            <>
              <div><FieldLabel htmlFor="cur-r">Daily reward value</FieldLabel><FieldInput id="cur-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-d">Days</FieldLabel><FieldInput id="cur-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-m">Daily power cost</FieldLabel><FieldInput id="cur-m" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-h">Hashrate scale</FieldLabel><FieldInput id="cur-h" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {(config.mode === "staking" || config.mode === "tax" || config.mode === "gas") ? (
            <div>
              <FieldLabel htmlFor="cur-p">{config.mode === "tax" ? "Tax %" : config.mode === "gas" ? "Gwei" : "APY %"}</FieldLabel>
              <FieldInput id="cur-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}
          {config.mode === "staking" ? (
            <div><FieldLabel htmlFor="cur-d">Days</FieldLabel><FieldInput id="cur-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
          ) : null}
          {config.mode === "portfolio" ? (
            <>
              <div><FieldLabel htmlFor="cur-a">Holding A</FieldLabel><FieldInput id="cur-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-r">Price A</FieldLabel><FieldInput id="cur-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-b">Holding B</FieldLabel><FieldInput id="cur-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-p">Price B</FieldLabel><FieldInput id="cur-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "roi" ? (
            <>
              <div><FieldLabel htmlFor="cur-c">Cost basis</FieldLabel><FieldInput id="cur-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-a">Current value</FieldLabel><FieldInput id="cur-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {(config.mode === "convert" || config.mode === "gas") ? (
            <div>
              <FieldLabel htmlFor="cur-r">{config.mode === "gas" ? "ETH price (example)" : "Rate (example)"}</FieldLabel>
              <FieldInput id="cur-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}
          {config.mode === "gas" ? (
            <div><FieldLabel htmlFor="cur-a">Gas units</FieldLabel><FieldInput id="cur-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
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
