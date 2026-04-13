/** Single-query-param share payload for basic math calculators. */

export const BASIC_MATH_URL_KEY = "ms";

const VERSION = 1;
/** Rough browser limit guard; skip writing if encoding exceeds this. */
export const BASIC_MATH_SHARE_MAX_LEN = 1800;

export type BasicMathSharePayload = {
  v: typeof VERSION;
  slug: string;
  fields: Record<string, string>;
};

function toBase64Url(json: string): string {
  if (typeof btoa !== "undefined") {
    const b = btoa(unescape(encodeURIComponent(json)));
    return b.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  return Buffer.from(json, "utf-8").toString("base64url");
}

function fromBase64Url(s: string): string {
  let pad = s.replace(/-/g, "+").replace(/_/g, "/");
  while (pad.length % 4) pad += "=";
  if (typeof atob !== "undefined") {
    return decodeURIComponent(escape(atob(pad)));
  }
  return Buffer.from(pad, "base64").toString("utf-8");
}

export function encodeBasicMathShareState(slug: string, fields: Record<string, string>): string | null {
  const payload: BasicMathSharePayload = { v: VERSION, slug, fields };
  try {
    const json = JSON.stringify(payload);
    const out = toBase64Url(json);
    if (out.length > BASIC_MATH_SHARE_MAX_LEN) return null;
    return out;
  } catch {
    return null;
  }
}

export function decodeBasicMathShareState(encoded: string | undefined | null): BasicMathSharePayload | null {
  if (!encoded || encoded.trim() === "") return null;
  try {
    const json = fromBase64Url(encoded.trim());
    const o = JSON.parse(json) as BasicMathSharePayload;
    if (o.v !== VERSION || typeof o.slug !== "string" || typeof o.fields !== "object" || o.fields === null) {
      return null;
    }
    const fields: Record<string, string> = {};
    for (const [k, v] of Object.entries(o.fields)) {
      if (typeof v === "string") fields[k] = v;
    }
    return { v: VERSION, slug: o.slug, fields };
  } catch {
    return null;
  }
}

export function parseMsFromSearchParams(sp: Record<string, string | string[] | undefined> | undefined): string | undefined {
  if (!sp) return undefined;
  const raw = sp[BASIC_MATH_URL_KEY];
  const v = Array.isArray(raw) ? raw[0] : raw;
  return typeof v === "string" && v.trim() !== "" ? v.trim() : undefined;
}
