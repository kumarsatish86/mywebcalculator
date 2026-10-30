/** IT API & encoding — educational. */

export type ItApiSlug =
  | "it-url-encoder-decoder"
  | "it-json-formatter-validator"
  | "it-xml-formatter"
  | "it-csv-to-json-converter"
  | "it-json-to-csv-converter"
  | "it-html-encoder-decoder"
  | "it-unicode-converter"
  | "it-ascii-converter"
  | "it-mime-type-finder";

export type ItApiInput = {
  text?: string;
  mode?: string;
  extension?: string;
};

export type ItApiResult =
  | { ok: false; error: string }
  | { ok: true; output?: string; valid?: boolean; mime?: string; note: string };

const MIME: Record<string, string> = {
  html: "text/html",
  htm: "text/html",
  css: "text/css",
  js: "application/javascript",
  json: "application/json",
  xml: "application/xml",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  svg: "image/svg+xml",
  pdf: "application/pdf",
  txt: "text/plain",
  csv: "text/csv",
  zip: "application/zip",
  wasm: "application/wasm",
};

export function computeItApi(slug: ItApiSlug, input: ItApiInput): ItApiResult {
  const text = input.text ?? "";
  const mode = (input.mode ?? "encode").toLowerCase();

  switch (slug) {
    case "it-url-encoder-decoder": {
      try {
        const output = mode === "decode" ? decodeURIComponent(text) : encodeURIComponent(text);
        return { ok: true, output, note: mode === "decode" ? "URL decode." : "URL encode." };
      } catch {
        return { ok: false, error: "Invalid URL encoding." };
      }
    }
    case "it-json-formatter-validator": {
      try {
        const parsed = JSON.parse(text);
        return { ok: true, valid: true, output: JSON.stringify(parsed, null, 2), note: "Valid JSON (pretty-printed)." };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : "Invalid JSON." };
      }
    }
    case "it-xml-formatter": {
      const compact = text.replace(/>\s+</g, "><").trim();
      let indent = 0;
      const out: string[] = [];
      compact.replace(/<[^>]+>|[^<]+/g, (tok) => {
        if (tok.startsWith("</")) indent = Math.max(0, indent - 1);
        if (tok.trim()) out.push(`${"  ".repeat(indent)}${tok.trim()}`);
        if (tok.startsWith("<") && !tok.startsWith("</") && !tok.endsWith("/>") && !tok.startsWith("<?") && !tok.startsWith("<!")) {
          indent++;
        }
        return tok;
      });
      return { ok: true, output: out.join("\n"), note: "Best-effort XML indent (not a full XML parser)." };
    }
    case "it-csv-to-json-converter": {
      const lines = text.trim().split(/\r?\n/).filter(Boolean);
      if (lines.length < 2) return { ok: false, error: "Need header + at least one row." };
      const headers = lines[0]!.split(",").map((h) => h.trim());
      const rows = lines.slice(1).map((line) => {
        const cols = line.split(",");
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => {
          obj[h] = (cols[i] ?? "").trim();
        });
        return obj;
      });
      return { ok: true, output: JSON.stringify(rows, null, 2), note: "Simple CSV→JSON (no quoted commas)." };
    }
    case "it-json-to-csv-converter": {
      try {
        const data = JSON.parse(text);
        const arr = Array.isArray(data) ? data : [data];
        if (!arr.length || typeof arr[0] !== "object") return { ok: false, error: "Expect JSON array of objects." };
        const keys = Object.keys(arr[0] as object);
        const lines = [keys.join(",")];
        for (const row of arr) {
          lines.push(keys.map((k) => String((row as Record<string, unknown>)[k] ?? "")).join(","));
        }
        return { ok: true, output: lines.join("\n"), note: "JSON array → CSV." };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : "Invalid JSON." };
      }
    }
    case "it-html-encoder-decoder": {
      if (mode === "decode") {
        const output = text
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&amp;/g, "&");
        return { ok: true, output, note: "HTML entity decode (common set)." };
      }
      const output = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
      return { ok: true, output, note: "HTML entity encode." };
    }
    case "it-unicode-converter": {
      const cps = [...text].map((ch) => `U+${ch.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0")}`);
      return { ok: true, output: cps.join(" "), note: "Code points for each character." };
    }
    case "it-ascii-converter": {
      if (mode === "decode") {
        const nums = text.trim().split(/[\s,]+/).filter(Boolean).map(Number);
        if (nums.some((n) => !Number.isInteger(n) || n < 0 || n > 127)) {
          return { ok: false, error: "ASCII codes must be integers 0–127." };
        }
        return { ok: true, output: String.fromCharCode(...nums), note: "ASCII codes → text." };
      }
      const codes = [...text].map((ch) => {
        const c = ch.charCodeAt(0);
        return c <= 127 ? String(c) : "?";
      });
      return { ok: true, output: codes.join(" "), note: "Text → ASCII codes (non-ASCII → ?)." };
    }
    case "it-mime-type-finder": {
      const ext = (input.extension ?? text).replace(/^\./, "").toLowerCase().trim();
      if (!ext) return { ok: false, error: "File extension required." };
      return { ok: true, mime: MIME[ext] ?? "application/octet-stream", note: MIME[ext] ? "Common MIME mapping." : "Unknown extension → octet-stream." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
