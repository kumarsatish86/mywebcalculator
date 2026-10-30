/** IT programming & logic — educational. */

export type ItLogicSlug =
  | "it-time-complexity-calculator"
  | "it-algorithm-complexity-estimator"
  | "it-loop-iteration-calculator"
  | "it-recursion-depth-calculator"
  | "it-code-execution-time-estimator"
  | "it-big-o-calculator"
  | "it-logic-gate-calculator"
  | "it-boolean-algebra-calculator"
  | "it-truth-table-generator";

export type ItLogicInput = {
  n?: number;
  kind?: string;
  opsPerSec?: number;
  a?: number;
  b?: number;
  gate?: string;
  expr?: string;
};

export type ItLogicResult =
  | { ok: false; error: string }
  | {
      ok: true;
      ops?: number;
      seconds?: number;
      bigO?: string;
      resultBit?: number;
      table?: string;
      note: string;
    };

function growth(kind: string, n: number): number {
  switch (kind) {
    case "1":
    case "const":
      return 1;
    case "logn":
      return Math.log2(Math.max(n, 1));
    case "n":
      return n;
    case "nlogn":
      return n * Math.log2(Math.max(n, 1));
    case "n2":
      return n * n;
    case "n3":
      return n * n * n;
    case "2n":
      return Math.min(1e15, 2 ** Math.min(n, 50));
    default:
      return n;
  }
}

export function computeItLogic(slug: ItLogicSlug, input: ItLogicInput): ItLogicResult {
  switch (slug) {
    case "it-time-complexity-calculator":
    case "it-algorithm-complexity-estimator":
    case "it-big-o-calculator": {
      const n = input.n;
      if (!n || n <= 0) return { ok: false, error: "n must be positive." };
      const kind = (input.kind ?? "nlogn").toLowerCase();
      const ops = growth(kind, n);
      const label =
        kind === "const" || kind === "1"
          ? "O(1)"
          : kind === "logn"
            ? "O(log n)"
            : kind === "n"
              ? "O(n)"
              : kind === "n2"
                ? "O(n²)"
                : kind === "n3"
                  ? "O(n³)"
                  : kind === "2n"
                    ? "O(2ⁿ)"
                    : "O(n log n)";
      return { ok: true, ops, bigO: label, note: `Rough operation count proxy for ${label} at n=${n}.` };
    }
    case "it-loop-iteration-calculator": {
      const n = input.n;
      if (!n || n <= 0) return { ok: false, error: "Iterations / n must be positive." };
      const kind = (input.kind ?? "single").toLowerCase();
      const ops = kind === "nested" ? n * n : kind === "triple" ? n * n * n : n;
      return { ok: true, ops, note: kind === "nested" ? "Nested loops ≈ n²." : kind === "triple" ? "Triple nested ≈ n³." : "Single loop ≈ n." };
    }
    case "it-recursion-depth-calculator": {
      const n = input.n;
      if (!n || n <= 0) return { ok: false, error: "Depth / n must be positive." };
      return {
        ok: true,
        ops: n,
        note: `Max recursion depth teaching value=${n}. Stack limits vary by runtime.`,
      };
    }
    case "it-code-execution-time-estimator": {
      const n = input.n;
      if (!n || n <= 0) return { ok: false, error: "Operations must be positive." };
      const opsPerSec = input.opsPerSec && input.opsPerSec > 0 ? input.opsPerSec : 1e8;
      return { ok: true, ops: n, seconds: n / opsPerSec, note: `Time ≈ ops ÷ ${opsPerSec} ops/s (rough machine model).` };
    }
    case "it-logic-gate-calculator": {
      const a = input.a ? 1 : 0;
      const b = input.b ? 1 : 0;
      const gate = (input.gate ?? "and").toLowerCase();
      let r = 0;
      if (gate === "or") r = a | b;
      else if (gate === "xor") r = a ^ b;
      else if (gate === "nand") r = a & b ? 0 : 1;
      else if (gate === "nor") r = a | b ? 0 : 1;
      else if (gate === "not") r = a ? 0 : 1;
      else r = a & b;
      return { ok: true, resultBit: r, note: `${gate.toUpperCase()} gate result.` };
    }
    case "it-boolean-algebra-calculator": {
      const expr = (input.expr ?? "A AND B").toUpperCase();
      const A = input.a ? 1 : 0;
      const B = input.b ? 1 : 0;
      let r = 0;
      if (expr.includes("XOR")) r = A ^ B;
      else if (expr.includes("OR") && !expr.includes("XOR") && !expr.includes("NOR")) r = A | B;
      else if (expr.includes("NAND")) r = A & B ? 0 : 1;
      else if (expr.includes("NOR")) r = A | B ? 0 : 1;
      else if (expr.includes("NOT") && !expr.includes("AND")) r = A ? 0 : 1;
      else r = A & B;
      return { ok: true, resultBit: r, note: `Evaluated simplified expression for A=${A}, B=${B}.` };
    }
    case "it-truth-table-generator": {
      const gate = (input.gate ?? "and").toLowerCase();
      const rows: string[] = ["A B | Out"];
      for (const A of [0, 1]) {
        for (const B of [0, 1]) {
          let out = 0;
          if (gate === "or") out = A | B;
          else if (gate === "xor") out = A ^ B;
          else if (gate === "nand") out = A & B ? 0 : 1;
          else if (gate === "nor") out = A | B ? 0 : 1;
          else out = A & B;
          rows.push(`${A} ${B} | ${out}`);
        }
      }
      return { ok: true, table: rows.join("\n"), note: `Truth table for ${gate.toUpperCase()}.` };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
