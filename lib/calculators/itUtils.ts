/** IT developer utilities — educational. */

export type ItUtilsSlug =
  | "it-uuid-generator"
  | "it-random-number-generator"
  | "it-random-string-generator"
  | "it-slug-generator"
  | "it-case-converter-upper-lower-snake-camel"
  | "it-text-diff-checker"
  | "it-line-count-tool"
  | "it-character-count-tool"
  | "it-regex-tester";

export type ItUtilsInput = {
  text?: string;
  textB?: string;
  min?: number;
  max?: number;
  length?: number;
  alphabet?: string;
  mode?: string;
  pattern?: string;
  flags?: string;
};

export type ItUtilsResult =
  | { ok: false; error: string }
  | {
      ok: true;
      output?: string;
      count?: number;
      lines?: number;
      chars?: number;
      words?: number;
      matches?: string;
      note: string;
    };

function uuidv4(): string {
  const bytes = new Array(16).fill(0).map(() => Math.floor(Math.random() * 256));
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const hex = bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function toSnake(s: string): string {
  return s
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[\s\-]+/g, "_")
    .toLowerCase();
}

function toCamel(s: string): string {
  const p = s.replace(/[_\-\s]+(.)/g, (_, c: string) => c.toUpperCase());
  return p.charAt(0).toLowerCase() + p.slice(1);
}

export function computeItUtils(slug: ItUtilsSlug, input: ItUtilsInput): ItUtilsResult {
  switch (slug) {
    case "it-uuid-generator":
      return { ok: true, output: uuidv4(), note: "UUID v4-shaped (Math.random — prefer crypto.randomUUID when available)." };
    case "it-random-number-generator": {
      const min = input.min ?? 0;
      const max = input.max ?? 100;
      if (!Number.isFinite(min) || !Number.isFinite(max) || max < min) return { ok: false, error: "Invalid min/max." };
      const n = Math.floor(Math.random() * (max - min + 1)) + min;
      return { ok: true, output: String(n), count: n, note: `Random integer in [${min}, ${max}].` };
    }
    case "it-random-string-generator": {
      const len = Math.min(256, Math.max(1, Math.floor(input.length ?? 12)));
      const alpha = input.alphabet || "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let out = "";
      for (let i = 0; i < len; i++) out += alpha[Math.floor(Math.random() * alpha.length)];
      return { ok: true, output: out, note: `Random string length ${len}.` };
    }
    case "it-slug-generator": {
      const slugOut = (input.text ?? "")
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      return { ok: true, output: slugOut, note: "URL slug from text." };
    }
    case "it-case-converter-upper-lower-snake-camel": {
      const t = input.text ?? "";
      const mode = (input.mode ?? "upper").toLowerCase();
      const output =
        mode === "lower"
          ? t.toLowerCase()
          : mode === "snake"
            ? toSnake(t)
            : mode === "camel"
              ? toCamel(t)
              : t.toUpperCase();
      return { ok: true, output, note: `Case mode: ${mode}.` };
    }
    case "it-text-diff-checker": {
      const a = (input.text ?? "").split(/\r?\n/);
      const b = (input.textB ?? "").split(/\r?\n/);
      const max = Math.max(a.length, b.length);
      const diffs: string[] = [];
      for (let i = 0; i < max; i++) {
        if (a[i] !== b[i]) diffs.push(`L${i + 1}: -${a[i] ?? ""} | +${b[i] ?? ""}`);
      }
      return {
        ok: true,
        output: diffs.length ? diffs.join("\n") : "(identical)",
        count: diffs.length,
        note: "Line-oriented diff (not a full Myers diff).",
      };
    }
    case "it-line-count-tool": {
      const t = input.text ?? "";
      const lines = t === "" ? 0 : t.split(/\r?\n/).length;
      return { ok: true, lines, note: "Line count." };
    }
    case "it-character-count-tool": {
      const t = input.text ?? "";
      const words = t.trim() ? t.trim().split(/\s+/).length : 0;
      return { ok: true, chars: t.length, words, note: "Characters (incl. spaces) and words." };
    }
    case "it-regex-tester": {
      const pattern = input.pattern ?? "";
      if (!pattern) return { ok: false, error: "Pattern required." };
      try {
        const re = new RegExp(pattern, input.flags ?? "g");
        const t = input.text ?? "";
        const found = [...t.matchAll(re)].map((m) => m[0]);
        return {
          ok: true,
          matches: found.length ? found.join(" | ") : "(no matches)",
          count: found.length,
          note: "JavaScript RegExp test (client-side).",
        };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : "Invalid regex." };
      }
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
