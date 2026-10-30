"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { IT_URL } from "@/lib/calculators/itHelpers";
import {
  computeItCrypto,
  type ItCryptoInput,
  type ItCryptoResult,
  type ItCryptoSlug,
} from "@/lib/calculators/itCrypto";
import { parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "hash" | "compare" | "b64" | "jwt" | "cipher" | "pwStrength" | "pwGen" | "salt" | "hmac" | "cert" | "keygen" | "checksum";

type Config = {
  title: string; description: string; mode: Mode;
  aDefault: string; bDefault: string; cDefault: string; rDefault: string; nDefault: string; tDefault: string;
};

const DISCLAIMER =
  "Educational developer utility — not a security product, production crypto suite, or network scanner.";

const CONFIG: Record<ItCryptoSlug, Config> = {
  "it-hash-generator-md5-sha256-sha512": { title: "Hash generator", description: `Educational hash preview. ${DISCLAIMER}`, mode: "hash", aDefault: "hello", bDefault: "", cDefault: "fnv", rDefault: "", nDefault: "", tDefault: "" },
  "it-hash-compare-tool": { title: "Hash compare", description: `Compare two digests. ${DISCLAIMER}`, mode: "compare", aDefault: "", bDefault: "", cDefault: "", rDefault: "", nDefault: "", tDefault: "" },
  "it-base64-encode-decode": { title: "Base64", description: `Encode/decode UTF-8. ${DISCLAIMER}`, mode: "b64", aDefault: "hello", bDefault: "", cDefault: "encode", rDefault: "", nDefault: "", tDefault: "" },
  "it-jwt-decoder": { title: "JWT decoder", description: `Decode only — no verify. ${DISCLAIMER}`, mode: "jwt", aDefault: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIn0.sig", bDefault: "", cDefault: "", rDefault: "", nDefault: "", tDefault: "" },
  "it-encryption-decryption-tool": { title: "XOR demo cipher", description: `Demo only — not secure. ${DISCLAIMER}`, mode: "cipher", aDefault: "secret", bDefault: "", cDefault: "encrypt", rDefault: "key", nDefault: "", tDefault: "" },
  "it-password-strength-checker": { title: "Password strength", description: `Heuristic entropy score. ${DISCLAIMER}`, mode: "pwStrength", aDefault: "P@ssw0rd!", bDefault: "", cDefault: "", rDefault: "", nDefault: "", tDefault: "" },
  "it-random-password-generator": { title: "Random password", description: `Math.random demo. ${DISCLAIMER}`, mode: "pwGen", aDefault: "", bDefault: "", cDefault: "", rDefault: "", nDefault: "16", tDefault: "" },
  "it-salt-generator": { title: "Salt generator", description: `Hex salt sample. ${DISCLAIMER}`, mode: "salt", aDefault: "", bDefault: "", cDefault: "", rDefault: "", nDefault: "16", tDefault: "" },
  "it-hmac-generator": { title: "HMAC (demo)", description: `Educational HMAC stand-in. ${DISCLAIMER}`, mode: "hmac", aDefault: "message", bDefault: "", cDefault: "", rDefault: "secret", nDefault: "", tDefault: "" },
  "it-ssl-certificate-decoder": { title: "SSL cert (PEM scan)", description: `Structural PEM scan only. ${DISCLAIMER}`, mode: "cert", aDefault: "", bDefault: "", cDefault: "", rDefault: "", nDefault: "", tDefault: "-----BEGIN CERTIFICATE-----\nMIIB...\n-----END CERTIFICATE-----" },
  "it-public-private-key-generator": { title: "Key generator (demo)", description: `Placeholder keys only. ${DISCLAIMER}`, mode: "keygen", aDefault: "", bDefault: "", cDefault: "", rDefault: "", nDefault: "32", tDefault: "" },
  "it-checksum-calculator": { title: "Checksum", description: `16-bit additive checksum. ${DISCLAIMER}`, mode: "checksum", aDefault: "data", bDefault: "", cDefault: "", rDefault: "", nDefault: "", tDefault: "" },
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono text-right break-all">{value}</span>
    </div>
  );
}

function formatResult(res: ItCryptoResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.output) rows.push({ label: "Output", value: res.output });
  if (res.match !== undefined) rows.push({ label: "Match", value: res.match ? "yes" : "no" });
  if (res.score !== undefined) rows.push({ label: "Score", value: String(res.score) });
  if (res.entropyBits !== undefined) rows.push({ label: "Entropy (bits)", value: num(res.entropyBits, 1) });
  if (res.headers) rows.push({ label: "Decoded", value: res.headers });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.output?.slice(0, 80) ?? (res.match !== undefined ? (res.match ? "Match" : "No match")
    : res.score !== undefined ? String(res.score)
    : res.headers?.slice(0, 80) ?? "—");
  const primaryLabel =
    res.match !== undefined ? "Compare" : res.score !== undefined ? "Strength score" : res.headers ? "Decoded" : "Output";
  return { primary: primary ?? "—", primaryLabel, rows };
}

export function ItCryptoCalculatorHost({ slug }: { slug: string }) {
  const key = slug as ItCryptoSlug;
  const config = CONFIG[key] ?? CONFIG["it-hash-generator-md5-sha256-sha512"];
  const [a, setA] = useState(useLoanInitialInput(IT_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(IT_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(IT_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(IT_URL.R, config.rDefault));
  const [n, setN] = useState(useLoanInitialInput(IT_URL.N, config.nDefault));
  const [t, setT] = useState(useLoanInitialInput(IT_URL.T, config.tDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, v: string) => { if (v.trim() !== "") out[k] = v; };
    switch (config.mode) {
      case "hash": put(IT_URL.A, a); put(IT_URL.C, c); break;
      case "compare": put(IT_URL.A, a); put(IT_URL.B, b); break;
      case "b64": case "jwt": case "pwStrength": case "checksum": put(IT_URL.A, a); if (config.mode === "b64") put(IT_URL.C, c); break;
      case "cipher": case "hmac": put(IT_URL.A, a); put(IT_URL.R, r); if (config.mode === "cipher") put(IT_URL.C, c); break;
      case "pwGen": case "salt": case "keygen": put(IT_URL.N, n); break;
      case "cert": put(IT_URL.T, t); break;
    }
    return out;
  }, [a, b, c, config.mode, n, r, t]);

  useLoanUrlSync(shareParams, [a, b, c, n, r, t]);

  const result = useMemo(() => {
    const input: ItCryptoInput = {};
    switch (config.mode) {
      case "hash":
        input.text = a; input.algo = c.trim() || "fnv";
        break;
      case "compare":
        input.text = a; input.textB = b;
        break;
      case "b64":
        input.text = a; input.mode = c.trim() || "encode";
        break;
      case "jwt":
        input.text = a;
        break;
      case "cipher":
        input.text = a; input.key = r; input.mode = c.trim() || "encrypt";
        break;
      case "pwStrength":
        input.text = a;
        break;
      case "pwGen": case "salt": case "keygen": {
        const len = parsePositive(n, "Length");
        if (!len.ok) return { error: len.error };
        input.length = Math.floor(len.value);
        break;
      }
      case "hmac":
        input.text = a; input.key = r;
        break;
      case "cert":
        input.pem = t; input.text = t;
        break;
      case "checksum":
        input.text = a;
        break;
    }
    return formatResult(computeItCrypto(key in CONFIG ? key : "it-hash-generator-md5-sha256-sha512", input), num);
  }, [a, b, c, config.mode, key, n, r, t]);

  const showText = config.mode !== "pwGen" && config.mode !== "salt" && config.mode !== "keygen";
  const textLabel =
    config.mode === "compare" ? "Hash A" : config.mode === "jwt" ? "JWT" : config.mode === "cert" ? "" : "Text / input";

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {showText && config.mode !== "cert" ? (
            <div><FieldLabel htmlFor="itc-a">{textLabel}</FieldLabel><FieldInput id="itc-a" value={a} onChange={(ev) => setA(ev.target.value)} /></div>
          ) : null}
          {config.mode === "compare" ? (
            <div><FieldLabel htmlFor="itc-b">Hash B</FieldLabel><FieldInput id="itc-b" value={b} onChange={(ev) => setB(ev.target.value)} /></div>
          ) : null}
          {config.mode === "hash" ? (
            <div><FieldLabel htmlFor="itc-c">Algo (fnv, checksum, sha256…)</FieldLabel><FieldInput id="itc-c" value={c} onChange={(ev) => setC(ev.target.value)} /></div>
          ) : null}
          {config.mode === "b64" || config.mode === "cipher" ? (
            <div><FieldLabel htmlFor="itc-c">Mode (encode/decode or encrypt/decrypt)</FieldLabel><FieldInput id="itc-c" value={c} onChange={(ev) => setC(ev.target.value)} /></div>
          ) : null}
          {config.mode === "cipher" || config.mode === "hmac" ? (
            <div><FieldLabel htmlFor="itc-r">Key</FieldLabel><FieldInput id="itc-r" value={r} onChange={(ev) => setR(ev.target.value)} /></div>
          ) : null}
          {config.mode === "pwGen" || config.mode === "salt" || config.mode === "keygen" ? (
            <div><FieldLabel htmlFor="itc-n">Length</FieldLabel><FieldInput id="itc-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="numeric" /></div>
          ) : null}
          {config.mode === "cert" ? (
            <div><FieldLabel htmlFor="itc-t">PEM certificate</FieldLabel><FieldInput id="itc-t" value={t} onChange={(ev) => setT(ev.target.value)} /></div>
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
