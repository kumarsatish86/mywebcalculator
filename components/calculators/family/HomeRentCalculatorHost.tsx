"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { HOME_URL } from "@/lib/calculators/homeHelpers";
import {
  computeHomeRent,
  type HomeRentInput,
  type HomeRentResult,
  type HomeRentSlug,
} from "@/lib/calculators/homeRent";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "afford" | "split" | "rentVsBuy" | "lease" | "maint" | "ownership" | "society";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  tDefault: string;
  nDefault: string;
  pDefault: string;
  mDefault: string;
  lDefault: string;
  wDefault: string;
};

const DISCLAIMER =
  "Daily-life planning estimate only — tariffs, taxes, and local rules vary. Verify current rates before budgeting.";

const CONFIG: Record<HomeRentSlug, Config> = {
  "home-rent-affordability-calculator": {
    title: "Rent affordability",
    description: `Affordable rent from income and % rule. ${DISCLAIMER}`,
    mode: "afford", aDefault: "5000", bDefault: "30", cDefault: "", rDefault: "", tDefault: "",
    nDefault: "", pDefault: "", mDefault: "", lDefault: "", wDefault: "",
  },
  "home-rent-split-roommates-calculator": {
    title: "Rent split",
    description: `Equal split among roommates. ${DISCLAIMER}`,
    mode: "split", aDefault: "2400", bDefault: "", cDefault: "", rDefault: "", tDefault: "",
    nDefault: "3", pDefault: "", mDefault: "", lDefault: "", wDefault: "",
  },
  "home-rent-vs-buy-calculator": {
    title: "Rent vs buy",
    description: `Cash outflow comparison over years. ${DISCLAIMER}`,
    mode: "rentVsBuy", aDefault: "1800", bDefault: "2500", cDefault: "", rDefault: "", tDefault: "5",
    nDefault: "", pDefault: "", mDefault: "", lDefault: "", wDefault: "",
  },
  "home-lease-cost-calculator": {
    title: "Lease cost",
    description: `Total lease cash including deposit. ${DISCLAIMER}`,
    mode: "lease", aDefault: "1500", bDefault: "", cDefault: "", rDefault: "", tDefault: "2",
    nDefault: "2", pDefault: "", mDefault: "", lDefault: "", wDefault: "",
  },
  "home-property-maintenance-cost-calculator": {
    title: "Property maintenance",
    description: `Annual maintenance from property value. ${DISCLAIMER}`,
    mode: "maint", aDefault: "", bDefault: "", cDefault: "", rDefault: "", tDefault: "",
    nDefault: "", pDefault: "1", mDefault: "350000", lDefault: "", wDefault: "",
  },
  "home-ownership-cost-calculator": {
    title: "Ownership cost",
    description: `Annual ownership from monthly costs. ${DISCLAIMER}`,
    mode: "ownership", aDefault: "2200", bDefault: "3600", cDefault: "", rDefault: "", tDefault: "",
    nDefault: "", pDefault: "", mDefault: "", lDefault: "", wDefault: "",
  },
  "home-society-charges-calculator": {
    title: "Society charges",
    description: `Monthly society fee from rate × area. ${DISCLAIMER}`,
    mode: "society", aDefault: "", bDefault: "", cDefault: "", rDefault: "3.5", tDefault: "",
    nDefault: "", pDefault: "", mDefault: "", lDefault: "1200", wDefault: "",
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

function optPos(raw: string, label: string): number | undefined | { error: string } {
  if (raw.trim() === "") return undefined;
  const p = parsePositive(raw, label);
  if (!p.ok) return { error: p.error };
  return p.value;
}

function optNonNeg(raw: string, label: string): number | undefined | { error: string } {
  if (raw.trim() === "") return undefined;
  const p = parseNonNegative(raw, label);
  if (!p.ok) return { error: p.error };
  return p.value;
}

function formatResult(res: HomeRentResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.affordableRent !== undefined) rows.push({ label: "Affordable rent", value: num(res.affordableRent, 0) });
  if (res.perPerson !== undefined) rows.push({ label: "Per person", value: num(res.perPerson, 0) });
  if (res.total !== undefined) rows.push({ label: "Total", value: num(res.total, 0) });
  if (res.better) rows.push({ label: "Better option", value: res.better });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.perPerson !== undefined ? num(res.perPerson, 0)
    : res.affordableRent !== undefined ? num(res.affordableRent, 0)
    : res.total !== undefined ? num(res.total, 0)
    : res.better ?? "—";
  const primaryLabel =
    res.perPerson !== undefined ? "Per person"
    : res.affordableRent !== undefined ? "Affordable rent"
    : res.better ? "Better option"
    : "Total";
  return { primary, primaryLabel, rows };
}

export function HomeRentCalculatorHost({ slug }: { slug: string }) {
  const key = slug as HomeRentSlug;
  const config = CONFIG[key] ?? CONFIG["home-rent-affordability-calculator"];
  const [a, setA] = useState(useLoanInitialInput(HOME_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(HOME_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(HOME_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(HOME_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(HOME_URL.T, config.tDefault));
  const [n, setN] = useState(useLoanInitialInput(HOME_URL.N, config.nDefault));
  const [p, setP] = useState(useLoanInitialInput(HOME_URL.P, config.pDefault));
  const [m, setM] = useState(useLoanInitialInput(HOME_URL.M, config.mDefault));
  const [l, setL] = useState(useLoanInitialInput(HOME_URL.L, config.lDefault));
  const [w, setW] = useState(useLoanInitialInput(HOME_URL.W, config.wDefault));

  const num = (nVal: number, dec = 0) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, val: string) => { if (val.trim() !== "") out[k] = val; };
    switch (config.mode) {
      case "afford":
        put(HOME_URL.A, a); put(HOME_URL.B, b);
        break;
      case "split":
        put(HOME_URL.A, a); put(HOME_URL.N, n);
        break;
      case "rentVsBuy":
        put(HOME_URL.A, a); put(HOME_URL.B, b); put(HOME_URL.T, t);
        break;
      case "lease":
        put(HOME_URL.A, a); put(HOME_URL.T, t); put(HOME_URL.N, n);
        break;
      case "maint":
        put(HOME_URL.M, m); put(HOME_URL.P, p);
        break;
      case "ownership":
        put(HOME_URL.A, a); put(HOME_URL.B, b);
        break;
      case "society":
        put(HOME_URL.R, r); put(HOME_URL.L, l);
        break;
    }
    return out;
  }, [a, b, config.mode, l, m, n, p, r, t]);

  useLoanUrlSync(shareParams, [a, b, c, l, m, n, p, r, t, w]);

  const result = useMemo(() => {
    const input: HomeRentInput = {};
    switch (config.mode) {
      case "afford": {
        const income = parsePositive(a, "Monthly income");
        if (!income.ok) return { error: income.error };
        input.income = income.value;
        const pct = optPos(b, "Rent %");
        if (pct && typeof pct === "object") return { error: pct.error };
        if (typeof pct === "number") input.rentPct = pct;
        break;
      }
      case "split": {
        const rent = parsePositive(a, "Total rent");
        if (!rent.ok) return { error: rent.error };
        input.rent = rent.value;
        const roommates = optPos(n, "Roommates");
        if (roommates && typeof roommates === "object") return { error: roommates.error };
        if (typeof roommates === "number") input.roommates = roommates;
        break;
      }
      case "rentVsBuy": {
        const rent = parsePositive(a, "Monthly rent");
        if (!rent.ok) return { error: rent.error };
        input.rent = rent.value;
        const buy = parsePositive(b, "Buy monthly");
        if (!buy.ok) return { error: buy.error };
        input.buyMonthly = buy.value;
        const years = optPos(t, "Years");
        if (years && typeof years === "object") return { error: years.error };
        if (typeof years === "number") input.years = years;
        break;
      }
      case "lease": {
        const rent = parsePositive(a, "Monthly rent");
        if (!rent.ok) return { error: rent.error };
        input.rent = rent.value;
        const years = optPos(t, "Lease years");
        if (years && typeof years === "object") return { error: years.error };
        if (typeof years === "number") input.years = years;
        const dep = optNonNeg(n, "Deposit months");
        if (dep && typeof dep === "object") return { error: dep.error };
        if (typeof dep === "number") input.depositMonths = dep;
        break;
      }
      case "maint": {
        const value = parsePositive(m, "Property value");
        if (!value.ok) return { error: value.error };
        input.propertyValue = value.value;
        const pct = optPos(p, "Maintenance %");
        if (pct && typeof pct === "object") return { error: pct.error };
        if (typeof pct === "number") input.maintenancePct = pct;
        break;
      }
      case "ownership": {
        const buy = parsePositive(a, "Monthly ownership cost");
        if (!buy.ok) return { error: buy.error };
        input.buyMonthly = buy.value;
        const tax = optNonNeg(b, "Annual tax/insurance");
        if (tax && typeof tax === "object") return { error: tax.error };
        if (typeof tax === "number") input.taxInsurance = tax;
        break;
      }
      case "society": {
        const rate = parsePositive(r, "Charge per sqft");
        if (!rate.ok) return { error: rate.error };
        input.societyPerSqft = rate.value;
        const area = parsePositive(l, "Area sqft");
        if (!area.ok) return { error: area.error };
        input.areaSqft = area.value;
        break;
      }
    }
    return formatResult(
      computeHomeRent(key in CONFIG ? key : "home-rent-affordability-calculator", input),
      num,
    );
  }, [a, b, config.mode, key, l, m, n, p, r, t]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "afford" ? (
            <>
              <div><FieldLabel htmlFor="hr-a">Monthly income</FieldLabel><FieldInput id="hr-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hr-b">Rent % of income</FieldLabel><FieldInput id="hr-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "split" ? (
            <>
              <div><FieldLabel htmlFor="hr-a">Total rent</FieldLabel><FieldInput id="hr-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hr-n">Roommates</FieldLabel><FieldInput id="hr-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "rentVsBuy" ? (
            <>
              <div><FieldLabel htmlFor="hr-a">Monthly rent</FieldLabel><FieldInput id="hr-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hr-b">Buy monthly (EMI + costs)</FieldLabel><FieldInput id="hr-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hr-t">Years</FieldLabel><FieldInput id="hr-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "lease" ? (
            <>
              <div><FieldLabel htmlFor="hr-a">Monthly rent</FieldLabel><FieldInput id="hr-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hr-t">Lease years</FieldLabel><FieldInput id="hr-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hr-n">Deposit (months of rent)</FieldLabel><FieldInput id="hr-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "maint" ? (
            <>
              <div><FieldLabel htmlFor="hr-m">Property value</FieldLabel><FieldInput id="hr-m" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hr-p">Maintenance % per year</FieldLabel><FieldInput id="hr-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "ownership" ? (
            <>
              <div><FieldLabel htmlFor="hr-a">Monthly ownership cost</FieldLabel><FieldInput id="hr-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hr-b">Annual tax/insurance</FieldLabel><FieldInput id="hr-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "society" ? (
            <>
              <div><FieldLabel htmlFor="hr-r">Charge per sqft</FieldLabel><FieldInput id="hr-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hr-l">Area (sqft)</FieldLabel><FieldInput id="hr-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
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
