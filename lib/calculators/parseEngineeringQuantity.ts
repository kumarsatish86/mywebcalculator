/** Parse engineering quantities with optional unit suffixes → SI base units. */

export type QuantityKind = "length" | "resistivity";

export type ParsedQuantity =
  | { ok: true; value: number; unit: string }
  | { ok: false; error: string };

const LENGTH_TO_M: Record<string, number> = {
  m: 1,
  meter: 1,
  meters: 1,
  metre: 1,
  metres: 1,
  cm: 0.01,
  mm: 0.001,
  km: 1000,
  ft: 0.3048,
  feet: 0.3048,
  "'": 0.3048,
  in: 0.0254,
  inch: 0.0254,
  inches: 0.0254,
  '"': 0.0254,
};

/** Resistivity factors → Ω·m */
const RHO_TO_OHM_M: Record<string, number> = {
  "ohm-m": 1,
  "ohm.m": 1,
  ohmm: 1,
  ohm: 1,
};

function splitNumberUnit(raw: string): { num: string; unit: string } | null {
  const s = raw.trim().toLowerCase().replace(/,/g, "");
  if (!s) return null;
  const m = s.match(/^([+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)\s*(.*)$/i);
  if (!m) return null;
  return { num: m[1]!, unit: (m[2] ?? "").trim().replace(/\s+/g, "") };
}

/**
 * Parse a length string to metres. Bare numbers are treated as metres.
 */
export function parseLengthToMetres(raw: string, label = "Length"): ParsedQuantity {
  const parts = splitNumberUnit(raw);
  if (!parts) return { ok: false, error: `${label}: enter a number (e.g. 35m, 114.8ft).` };
  const n = Number(parts.num);
  if (!Number.isFinite(n) || n <= 0) return { ok: false, error: `${label}: must be a positive number.` };
  const u = parts.unit || "m";
  const factor = LENGTH_TO_M[u];
  if (factor == null) {
    return { ok: false, error: `${label}: unknown unit “${parts.unit}”. Use m, cm, mm, ft, or in.` };
  }
  return { ok: true, value: n * factor, unit: "m" };
}

/**
 * Parse soil resistivity to Ω·m. Bare numbers are Ω·m.
 */
export function parseResistivityOhmM(raw: string, label = "Resistivity"): ParsedQuantity {
  const parts = splitNumberUnit(raw);
  if (!parts) return { ok: false, error: `${label}: enter a number (e.g. 100 or 100 ohm-m).` };
  const n = Number(parts.num);
  if (!Number.isFinite(n) || n <= 0) return { ok: false, error: `${label}: must be a positive number.` };
  const u = parts.unit || "ohm-m";
  const norm = u.replace(/ω/g, "ohm").replace(/·/g, "-").replace(/\./g, "-");
  if (norm === "" || norm === "ohm-m" || norm === "ohmm" || norm === "ohm") {
    return { ok: true, value: n, unit: "ohm-m" };
  }
  const factor = RHO_TO_OHM_M[norm] ?? RHO_TO_OHM_M[u];
  if (factor == null && norm !== "ohm-m") {
    // accept ohm-m variants already handled; otherwise fail
    if (!["ohm-m", "ohmm"].includes(norm)) {
      return { ok: false, error: `${label}: use Ω·m (e.g. 100 ohm-m).` };
    }
  }
  return { ok: true, value: n * (factor ?? 1), unit: "ohm-m" };
}
