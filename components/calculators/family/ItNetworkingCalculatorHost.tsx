"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { IT_URL } from "@/lib/calculators/itHelpers";
import {
  computeItNetworking,
  type ItNetworkingInput,
  type ItNetworkingResult,
  type ItNetworkingSlug,
} from "@/lib/calculators/itNetworking";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "subnet" | "ipv6" | "mac" | "throughput" | "latency" | "loss" | "dns" | "port" | "mtu";

type Config = {
  title: string; description: string; mode: Mode;
  aDefault: string; bDefault: string; cDefault: string; rDefault: string; tDefault: string;
  mDefault: string; nDefault: string; pDefault: string; qDefault: string; vDefault: string;
};

const DISCLAIMER =
  "Educational developer utility — not a security product, production crypto suite, or network scanner.";

const CONFIG: Record<ItNetworkingSlug, Config> = {
  "it-subnet-calculator": { title: "Subnet calculator", description: `IPv4 subnet math. ${DISCLAIMER}`, mode: "subnet", aDefault: "192.168.1.10", bDefault: "24", cDefault: "", rDefault: "", tDefault: "", mDefault: "", nDefault: "", pDefault: "", qDefault: "", vDefault: "" },
  "it-cidr-calculator": { title: "CIDR calculator", description: `Network/broadcast from CIDR. ${DISCLAIMER}`, mode: "subnet", aDefault: "10.0.0.5", bDefault: "16", cDefault: "", rDefault: "", tDefault: "", mDefault: "", nDefault: "", pDefault: "", qDefault: "", vDefault: "" },
  "it-ip-range-calculator": { title: "IP range", description: `First/last host in range. ${DISCLAIMER}`, mode: "subnet", aDefault: "172.16.0.1", bDefault: "22", cDefault: "", rDefault: "", tDefault: "", mDefault: "", nDefault: "", pDefault: "", qDefault: "", vDefault: "" },
  "it-broadcast-address-calculator": { title: "Broadcast address", description: `Broadcast from IP + CIDR. ${DISCLAIMER}`, mode: "subnet", aDefault: "192.168.0.100", bDefault: "24", cDefault: "", rDefault: "", tDefault: "", mDefault: "", nDefault: "", pDefault: "", qDefault: "", vDefault: "" },
  "it-ipv4-to-ipv6-converter": { title: "IPv4 to IPv6", description: `IPv4-mapped IPv6. ${DISCLAIMER}`, mode: "ipv6", aDefault: "192.168.1.1", bDefault: "", cDefault: "", rDefault: "", tDefault: "", mDefault: "", nDefault: "", pDefault: "", qDefault: "", vDefault: "" },
  "it-mac-address-converter": { title: "MAC converter", description: `Colon/dash/Cisco formats. ${DISCLAIMER}`, mode: "mac", aDefault: "", bDefault: "", cDefault: "001122334455", rDefault: "", tDefault: "", mDefault: "", nDefault: "", pDefault: "", qDefault: "", vDefault: "" },
  "it-network-throughput-calculator": { title: "Throughput", description: `Mbps from bits/s. ${DISCLAIMER}`, mode: "throughput", aDefault: "", bDefault: "", cDefault: "", rDefault: "1000000000", tDefault: "", mDefault: "", nDefault: "", pDefault: "", qDefault: "", vDefault: "" },
  "it-latency-calculator": { title: "Latency (RTT)", description: `Propagation RTT estimate. ${DISCLAIMER}`, mode: "latency", aDefault: "", bDefault: "", cDefault: "", rDefault: "", tDefault: "1000", mDefault: "", nDefault: "", pDefault: "", qDefault: "", vDefault: "0.67" },
  "it-packet-loss-calculator": { title: "Packet loss", description: `Loss % = lost ÷ sent. ${DISCLAIMER}`, mode: "loss", aDefault: "", bDefault: "", cDefault: "", rDefault: "100", tDefault: "1000", mDefault: "", nDefault: "", pDefault: "", qDefault: "", vDefault: "" },
  "it-dns-lookup-tool": { title: "DNS lookup (info)", description: `Educational — no live DNS. ${DISCLAIMER}`, mode: "dns", aDefault: "", bDefault: "", cDefault: "", rDefault: "", tDefault: "", mDefault: "example.com", nDefault: "", pDefault: "", qDefault: "", vDefault: "" },
  "it-port-number-reference-tool": { title: "Port reference", description: `Well-known port cheat sheet. ${DISCLAIMER}`, mode: "port", aDefault: "", bDefault: "", cDefault: "", rDefault: "", tDefault: "", mDefault: "", nDefault: "443", pDefault: "", qDefault: "", vDefault: "" },
  "it-mtu-calculator": { title: "MTU payload", description: `L4 payload ≈ MTU − overhead. ${DISCLAIMER}`, mode: "mtu", aDefault: "", bDefault: "", cDefault: "", rDefault: "", tDefault: "", mDefault: "", nDefault: "", pDefault: "1500", qDefault: "40", vDefault: "" },
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono text-right break-all">{value}</span>
    </div>
  );
}

function formatResult(res: ItNetworkingResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.network) rows.push({ label: "Network", value: res.network });
  if (res.broadcast) rows.push({ label: "Broadcast", value: res.broadcast });
  if (res.firstHost) rows.push({ label: "First host", value: res.firstHost });
  if (res.lastHost) rows.push({ label: "Last host", value: res.lastHost });
  if (res.hostCount !== undefined) rows.push({ label: "Host count", value: String(res.hostCount) });
  if (res.mask) rows.push({ label: "Mask", value: res.mask });
  if (res.ipv6) rows.push({ label: "IPv6", value: res.ipv6 });
  if (res.macFormats) rows.push({ label: "Formats", value: res.macFormats });
  if (res.throughputMbps !== undefined) rows.push({ label: "Mbps", value: num(res.throughputMbps, 2) });
  if (res.latencyMs !== undefined) rows.push({ label: "RTT (ms)", value: num(res.latencyMs, 2) });
  if (res.lossPct !== undefined) rows.push({ label: "Loss %", value: num(res.lossPct, 2) });
  if (res.portInfo) rows.push({ label: "Port", value: res.portInfo });
  if (res.payload !== undefined) rows.push({ label: "Payload (bytes)", value: String(res.payload) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.network ?? res.ipv6 ?? res.portInfo ?? res.macFormats?.slice(0, 40)
    ?? (res.throughputMbps !== undefined ? num(res.throughputMbps, 2)
    : res.latencyMs !== undefined ? num(res.latencyMs, 2)
    : res.lossPct !== undefined ? num(res.lossPct, 2)
    : res.payload !== undefined ? String(res.payload)
    : res.note.slice(0, 60));
  const primaryLabel =
    res.network ? "Network" : res.ipv6 ? "IPv6" : res.portInfo ? "Port info"
    : res.throughputMbps !== undefined ? "Throughput (Mbps)"
    : res.latencyMs !== undefined ? "RTT (ms)"
    : res.lossPct !== undefined ? "Loss %"
    : "Result";
  return { primary: primary ?? "—", primaryLabel, rows };
}

export function ItNetworkingCalculatorHost({ slug }: { slug: string }) {
  const key = slug as ItNetworkingSlug;
  const config = CONFIG[key] ?? CONFIG["it-subnet-calculator"];
  const [a, setA] = useState(useLoanInitialInput(IT_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(IT_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(IT_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(IT_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(IT_URL.T, config.tDefault));
  const [m, setM] = useState(useLoanInitialInput(IT_URL.M, config.mDefault));
  const [n, setN] = useState(useLoanInitialInput(IT_URL.N, config.nDefault));
  const [p, setP] = useState(useLoanInitialInput(IT_URL.P, config.pDefault));
  const [q, setQ] = useState(useLoanInitialInput(IT_URL.Q, config.qDefault));
  const [v, setV] = useState(useLoanInitialInput(IT_URL.V, config.vDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, val: string) => { if (val.trim() !== "") out[k] = val; };
    switch (config.mode) {
      case "subnet": case "ipv6": put(IT_URL.A, a); put(IT_URL.B, b); break;
      case "mac": put(IT_URL.C, c); break;
      case "throughput": put(IT_URL.R, r); break;
      case "latency": put(IT_URL.T, t); put(IT_URL.V, v); break;
      case "loss": put(IT_URL.T, t); put(IT_URL.R, r); break;
      case "dns": put(IT_URL.M, m); break;
      case "port": put(IT_URL.N, n); break;
      case "mtu": put(IT_URL.P, p); put(IT_URL.Q, q); break;
    }
    return out;
  }, [a, b, c, config.mode, m, n, p, q, r, t, v]);

  useLoanUrlSync(shareParams, [a, b, c, m, n, p, q, r, t, v]);

  const result = useMemo(() => {
    const input: ItNetworkingInput = {};
    switch (config.mode) {
      case "subnet": case "ipv6":
        input.ip = a.trim() || undefined;
        if (b.trim() !== "") {
          const cidr = parseFiniteNumber(b, "CIDR");
          if (!cidr.ok) return { error: cidr.error };
          input.cidr = Math.round(cidr.value);
        }
        break;
      case "mac":
        input.mac = c.trim() || undefined;
        break;
      case "throughput": {
        const bps = parsePositive(r, "Bits/s");
        if (!bps.ok) return { error: bps.error };
        input.bitsPerSecond = bps.value;
        break;
      }
      case "latency": {
        const km = parsePositive(t, "Distance (km)");
        if (!km.ok) return { error: km.error };
        input.distanceKm = km.value;
        if (v.trim() !== "") {
          const frac = parsePositive(v, "Speed fraction");
          if (!frac.ok) return { error: frac.error };
          input.speedFraction = frac.value;
        }
        break;
      }
      case "loss": {
        const sent = parsePositive(t, "Packets sent");
        const lost = parseNonNegative(r, "Packets lost");
        if (!sent.ok) return { error: sent.error };
        if (!lost.ok) return { error: lost.error };
        input.sent = sent.value;
        input.lost = lost.value;
        break;
      }
      case "dns":
        input.hostname = m.trim() || undefined;
        break;
      case "port": {
        const port = parseFiniteNumber(n, "Port");
        if (!port.ok) return { error: port.error };
        input.port = Math.round(port.value);
        break;
      }
      case "mtu": {
        const mtu = parsePositive(p, "MTU");
        if (!mtu.ok) return { error: mtu.error };
        input.mtu = Math.round(mtu.value);
        if (q.trim() !== "") {
          const oh = parseNonNegative(q, "Overhead");
          if (!oh.ok) return { error: oh.error };
          input.overhead = Math.round(oh.value);
        }
        break;
      }
    }
    return formatResult(computeItNetworking(key in CONFIG ? key : "it-subnet-calculator", input), num);
  }, [a, b, c, config.mode, key, m, n, p, q, r, t, v]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "subnet" || config.mode === "ipv6" ? (
            <>
              <div><FieldLabel htmlFor="itn-a">IPv4 address</FieldLabel><FieldInput id="itn-a" value={a} onChange={(ev) => setA(ev.target.value)} /></div>
              {config.mode === "subnet" ? (
                <div><FieldLabel htmlFor="itn-b">CIDR (0–32)</FieldLabel><FieldInput id="itn-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="numeric" /></div>
              ) : null}
            </>
          ) : null}
          {config.mode === "mac" ? (
            <div><FieldLabel htmlFor="itn-c">MAC (12 hex digits)</FieldLabel><FieldInput id="itn-c" value={c} onChange={(ev) => setC(ev.target.value)} /></div>
          ) : null}
          {config.mode === "throughput" ? (
            <div><FieldLabel htmlFor="itn-r">Bits per second</FieldLabel><FieldInput id="itn-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
          ) : null}
          {config.mode === "latency" ? (
            <>
              <div><FieldLabel htmlFor="itn-t">Distance (km)</FieldLabel><FieldInput id="itn-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="itn-v">Speed fraction (default 0.67)</FieldLabel><FieldInput id="itn-v" value={v} onChange={(ev) => setV(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "loss" ? (
            <>
              <div><FieldLabel htmlFor="itn-t">Packets sent</FieldLabel><FieldInput id="itn-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="numeric" /></div>
              <div><FieldLabel htmlFor="itn-r">Packets lost</FieldLabel><FieldInput id="itn-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="numeric" /></div>
            </>
          ) : null}
          {config.mode === "dns" ? (
            <div><FieldLabel htmlFor="itn-m">Hostname</FieldLabel><FieldInput id="itn-m" value={m} onChange={(ev) => setM(ev.target.value)} /></div>
          ) : null}
          {config.mode === "port" ? (
            <div><FieldLabel htmlFor="itn-n">Port (0–65535)</FieldLabel><FieldInput id="itn-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="numeric" /></div>
          ) : null}
          {config.mode === "mtu" ? (
            <>
              <div><FieldLabel htmlFor="itn-p">MTU (bytes)</FieldLabel><FieldInput id="itn-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="numeric" /></div>
              <div><FieldLabel htmlFor="itn-q">Overhead (bytes)</FieldLabel><FieldInput id="itn-q" value={q} onChange={(ev) => setQ(ev.target.value)} inputMode="numeric" /></div>
            </>
          ) : null}
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          {"error" in result ? (
            <p className="text-sm text-red-600">{result.error}</p>
          ) : (
            <div className="space-y-4">
              <div><p className="text-sm text-[var(--muted)]">{result.primaryLabel}</p><p className="mt-1 text-2xl font-semibold tracking-tight break-all">{result.primary}</p></div>
              <div className="space-y-2 text-sm">{result.rows.map((row) => (<Row key={row.label} label={row.label} value={row.value} />))}</div>
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
