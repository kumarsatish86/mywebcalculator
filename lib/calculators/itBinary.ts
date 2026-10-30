/** IT number systems & binary — educational. */

export type ItBinarySlug =
  | "it-binary-calculator"
  | "it-decimal-to-binary-converter"
  | "it-binary-to-decimal-converter"
  | "it-hexadecimal-to-decimal-converter"
  | "it-decimal-to-hex-converter"
  | "it-octal-converter-all-formats"
  | "it-binary-to-hex-converter"
  | "it-bitwise-calculator-and-or-xor-not"
  | "it-twos-complement-calculator"
  | "it-signed-unsigned-number-converter"
  | "it-binary-addition-subtraction-calculator";

export type ItBinaryInput = {
  value?: string;
  valueB?: string;
  bits?: number;
  op?: string;
};

export type ItBinaryResult =
  | { ok: false; error: string }
  | {
      ok: true;
      decimal?: number;
      binary?: string;
      hex?: string;
      octal?: string;
      result?: string;
      note: string;
    };

function cleanBin(s: string): string {
  return s.replace(/[\s_]/g, "");
}

function parseIntSafe(s: string, radix: number, label: string): number | { error: string } {
  const t = s.trim();
  if (!t) return { error: `${label} is required.` };
  const n = parseInt(t, radix);
  if (!Number.isFinite(n)) return { error: `Invalid ${label}.` };
  return n;
}

export function computeItBinary(slug: ItBinarySlug, input: ItBinaryInput): ItBinaryResult {
  const bits = input.bits && input.bits > 0 ? Math.min(64, Math.floor(input.bits)) : 32;

  switch (slug) {
    case "it-decimal-to-binary-converter":
    case "it-binary-calculator": {
      const n = parseIntSafe(input.value ?? "", 10, "Decimal");
      if (typeof n !== "number") return { ok: false, error: n.error };
      return {
        ok: true,
        decimal: n,
        binary: (n >>> 0).toString(2),
        hex: (n >>> 0).toString(16).toUpperCase(),
        octal: (n >>> 0).toString(8),
        note: "Unsigned 32-bit view via >>> 0 for display consistency.",
      };
    }
    case "it-binary-to-decimal-converter": {
      const n = parseIntSafe(cleanBin(input.value ?? ""), 2, "Binary");
      if (typeof n !== "number") return { ok: false, error: n.error };
      return { ok: true, decimal: n, binary: cleanBin(input.value ?? ""), note: "Binary → decimal." };
    }
    case "it-hexadecimal-to-decimal-converter": {
      const n = parseIntSafe(input.value ?? "", 16, "Hex");
      if (typeof n !== "number") return { ok: false, error: n.error };
      return { ok: true, decimal: n, hex: (input.value ?? "").toUpperCase(), note: "Hex → decimal." };
    }
    case "it-decimal-to-hex-converter": {
      const n = parseIntSafe(input.value ?? "", 10, "Decimal");
      if (typeof n !== "number") return { ok: false, error: n.error };
      return { ok: true, decimal: n, hex: (n >>> 0).toString(16).toUpperCase(), note: "Decimal → hex." };
    }
    case "it-octal-converter-all-formats": {
      const raw = (input.value ?? "").trim();
      if (!raw) return { ok: false, error: "Value required." };
      let n: number;
      if (/^0o/i.test(raw) || /^[0-7]+$/.test(raw)) {
        const p = parseIntSafe(raw.replace(/^0o/i, ""), 8, "Octal");
        if (typeof p !== "number") return { ok: false, error: p.error };
        n = p;
      } else {
        const p = parseIntSafe(raw, 10, "Decimal");
        if (typeof p !== "number") return { ok: false, error: p.error };
        n = p;
      }
      return {
        ok: true,
        decimal: n,
        octal: (n >>> 0).toString(8),
        binary: (n >>> 0).toString(2),
        hex: (n >>> 0).toString(16).toUpperCase(),
        note: "Octal ↔ decimal/binary/hex.",
      };
    }
    case "it-binary-to-hex-converter": {
      const n = parseIntSafe(cleanBin(input.value ?? ""), 2, "Binary");
      if (typeof n !== "number") return { ok: false, error: n.error };
      return { ok: true, binary: cleanBin(input.value ?? ""), hex: n.toString(16).toUpperCase(), note: "Binary → hex." };
    }
    case "it-bitwise-calculator-and-or-xor-not": {
      const a = parseIntSafe(input.value ?? "0", 10, "A");
      if (typeof a !== "number") return { ok: false, error: a.error };
      const op = (input.op ?? "and").toLowerCase();
      if (op === "not") {
        const r = ~a;
        return { ok: true, result: String(r >>> 0), decimal: r, note: "Bitwise NOT (32-bit display)." };
      }
      const b = parseIntSafe(input.valueB ?? "0", 10, "B");
      if (typeof b !== "number") return { ok: false, error: b.error };
      const r = op === "or" ? a | b : op === "xor" ? a ^ b : a & b;
      return { ok: true, result: String(r >>> 0), decimal: r, note: `Bitwise ${op.toUpperCase()}.` };
    }
    case "it-twos-complement-calculator": {
      const n = parseIntSafe(input.value ?? "", 10, "Value");
      if (typeof n !== "number") return { ok: false, error: n.error };
      const mask = bits === 64 ? undefined : (1 << bits) - 1;
      const twos = bits >= 32 ? (n >>> 0).toString(2).padStart(32, "0") : ((n & mask!) >>> 0).toString(2).padStart(bits, "0");
      return { ok: true, binary: twos, decimal: n, note: `Two’s complement bit pattern (${bits}-bit pad for display).` };
    }
    case "it-signed-unsigned-number-converter": {
      const n = parseIntSafe(input.value ?? "", 10, "Value");
      if (typeof n !== "number") return { ok: false, error: n.error };
      const unsigned = n >>> 0;
      const signed = unsigned | 0;
      return {
        ok: true,
        decimal: signed,
        result: `signed=${signed}, unsigned=${unsigned}`,
        note: "JS 32-bit signed vs unsigned reinterpretation.",
      };
    }
    case "it-binary-addition-subtraction-calculator": {
      const a = parseIntSafe(cleanBin(input.value ?? ""), 2, "A (binary)");
      if (typeof a !== "number") return { ok: false, error: a.error };
      const b = parseIntSafe(cleanBin(input.valueB ?? ""), 2, "B (binary)");
      if (typeof b !== "number") return { ok: false, error: b.error };
      const op = (input.op ?? "add").toLowerCase();
      const r = op === "sub" ? a - b : a + b;
      return {
        ok: true,
        decimal: r,
        binary: (r >>> 0).toString(2),
        note: op === "sub" ? "Binary subtraction (decimal intermediate)." : "Binary addition.",
      };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
