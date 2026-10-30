"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { IT_URL } from "@/lib/calculators/itHelpers";
import {
  computeItBinary,
  type ItBinaryInput,
  type ItBinaryResult,
  type ItBinarySlug,
} from "@/lib/calculators/itBinary";
import { parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "decBin" | "binDec" | "hexDec" | "decHex" | "octAll" | "binHex" | "bitwise" | "twos" | "signed" | "binAdd";

type Config = { title: string; description: string; mode: Mode; aDefault: string; bDefault: string; cDefault: string; nDefault: string };

const DISCLAIMER =
  "Educational developer utility — not a security product, production crypto suite, or network scanner.";

const CONFIG: Record<ItBinarySlug, Config> = {
  "it-binary-calculator": { title: "Binary calculator", description: `Decimal ↔ binary/hex/octal. ${DISCLAIMER}`, mode: "decBin", aDefault: "42", bDefault: "", cDefault: "", nDefault: "" },
  "it-decimal-to-binary-converter": { title: "Decimal to binary", description: `Convert decimal to binary. ${DISCLAIMER}`, mode: "decBin", aDefault: "10", bDefault: "", cDefault: "", nDefault: "" },
  "it-binary-to-decimal-converter": { title: "Binary to decimal", description: `Convert binary to decimal. ${DISCLAIMER}`, mode: "binDec", aDefault: "1010", bDefault: "", cDefault: "", nDefault: "" },
  "it-hexadecimal-to-decimal-converter": { title: "Hex to decimal", description: `Convert hex to decimal. ${DISCLAIMER}`, mode: "hexDec", aDefault: "FF", bDefault: "", cDefault: "", nDefault: "" },
  "it-decimal-to-hex-converter": { title: "Decimal to hex", description: `Convert decimal to hex. ${DISCLAIMER}`, mode: "decHex", aDefault: "255", bDefault: "", cDefault: "", nDefault: "" },
  "it-octal-converter-all-formats": { title: "Octal converter", description: `Octal ↔ decimal/binary/hex. ${DISCLAIMER}`, mode: "octAll", aDefault: "52", bDefault: "", cDefault: "", nDefault: "" },
  "it-binary-to-hex-converter": { title: "Binary to hex", description: `Convert binary to hex. ${DISCLAIMER}`, mode: "binHex", aDefault: "11111111", bDefault: "", cDefault: "", nDefault: "" },
  "it-bitwise-calculator-and-or-xor-not": { title: "Bitwise calculator", description: `AND/OR/XOR/NOT on integers. ${DISCLAIMER}`, mode: "bitwise", aDefault: "5", bDefault: "3", cDefault: "and", nDefault: "" },
  "it-twos-complement-calculator": { title: "Two's complement", description: `Two's complement bit pattern. ${DISCLAIMER}`, mode: "twos", aDefault: "-5", bDefault: "", cDefault: "", nDefault: "32" },
  "it-signed-unsigned-number-converter": { title: "Signed/unsigned", description: `JS 32-bit signed vs unsigned. ${DISCLAIMER}`, mode: "signed", aDefault: "-1", bDefault: "", cDefault: "", nDefault: "" },
  "it-binary-addition-subtraction-calculator": { title: "Binary add/sub", description: `Binary addition or subtraction. ${DISCLAIMER}`, mode: "binAdd", aDefault: "1010", bDefault: "0011", cDefault: "add", nDefault: "" },
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

function formatResult(res: ItBinaryResult) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.decimal !== undefined) rows.push({ label: "Decimal", value: String(res.decimal) });
  if (res.binary) rows.push({ label: "Binary", value: res.binary });
  if (res.hex) rows.push({ label: "Hex", value: res.hex });
  if (res.octal) rows.push({ label: "Octal", value: res.octal });
  if (res.result) rows.push({ label: "Result", value: res.result });
  rows.push({ label: "Note", value: res.note });
  const primary = res.result ?? res.binary ?? res.hex ?? (res.decimal !== undefined ? String(res.decimal) : "—");
  const primaryLabel = res.result ? "Result" : res.binary ? "Binary" : res.hex ? "Hex" : "Decimal";
  return { primary, primaryLabel, rows };
}

export function ItBinaryCalculatorHost({ slug }: { slug: string }) {
  const key = slug as ItBinarySlug;
  const config = CONFIG[key] ?? CONFIG["it-binary-calculator"];
  const [a, setA] = useState(useLoanInitialInput(IT_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(IT_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(IT_URL.C, config.cDefault));
  const [n, setN] = useState(useLoanInitialInput(IT_URL.N, config.nDefault));

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, v: string) => { if (v.trim() !== "") out[k] = v; };
    put(IT_URL.A, a);
    if (config.mode === "bitwise" || config.mode === "binAdd") { put(IT_URL.B, b); put(IT_URL.C, c); }
    if (config.mode === "twos") put(IT_URL.N, n);
    return out;
  }, [a, b, c, config.mode, n]);

  useLoanUrlSync(shareParams, [a, b, c, n]);

  const result = useMemo(() => {
    const input: ItBinaryInput = { value: a.trim() || undefined, valueB: b.trim() || undefined, op: c.trim() || undefined };
    if (config.mode === "twos" && n.trim() !== "") {
      const bits = parsePositive(n, "Bits");
      if (!bits.ok) return { error: bits.error };
      input.bits = Math.floor(bits.value);
    }
    return formatResult(computeItBinary(key in CONFIG ? key : "it-binary-calculator", input));
  }, [a, b, c, config.mode, key, n]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <FieldLabel htmlFor="itb-a">
              {config.mode === "binDec" || config.mode === "binHex" || config.mode === "binAdd" ? "Binary value" : config.mode === "hexDec" ? "Hex value" : "Value"}
            </FieldLabel>
            <FieldInput id="itb-a" value={a} onChange={(ev) => setA(ev.target.value)} />
          </div>
          {config.mode === "bitwise" || config.mode === "binAdd" ? (
            <>
              <div><FieldLabel htmlFor="itb-b">B (decimal or binary)</FieldLabel><FieldInput id="itb-b" value={b} onChange={(ev) => setB(ev.target.value)} /></div>
              <div><FieldLabel htmlFor="itb-c">{config.mode === "binAdd" ? "Op (add or sub)" : "Op (and, or, xor, not)"}</FieldLabel><FieldInput id="itb-c" value={c} onChange={(ev) => setC(ev.target.value)} /></div>
            </>
          ) : null}
          {config.mode === "twos" ? (
            <div><FieldLabel htmlFor="itb-n">Bit width</FieldLabel><FieldInput id="itb-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="numeric" /></div>
          ) : null}
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          {"error" in result ? (
            <p className="text-sm text-red-600">{result.error}</p>
          ) : (
            <div className="space-y-4">
              <div><p className="text-sm text-[var(--muted)]">{result.primaryLabel}</p><p className="mt-1 text-2xl font-semibold tracking-tight">{result.primary}</p></div>
              <div className="space-y-2 text-sm">{result.rows.map((row) => (<Row key={row.label} label={row.label} value={row.value} />))}</div>
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
