/** IT cryptography & security — educational (not for production secrets). */

export type ItCryptoSlug =
  | "it-hash-generator-md5-sha256-sha512"
  | "it-hash-compare-tool"
  | "it-base64-encode-decode"
  | "it-jwt-decoder"
  | "it-encryption-decryption-tool"
  | "it-password-strength-checker"
  | "it-random-password-generator"
  | "it-salt-generator"
  | "it-hmac-generator"
  | "it-ssl-certificate-decoder"
  | "it-public-private-key-generator"
  | "it-checksum-calculator";

export type ItCryptoInput = {
  text?: string;
  textB?: string;
  mode?: string;
  algo?: string;
  length?: number;
  key?: string;
  pem?: string;
};

export type ItCryptoResult =
  | { ok: false; error: string }
  | {
      ok: true;
      output?: string;
      match?: boolean;
      score?: number;
      entropyBits?: number;
      headers?: string;
      note: string;
    };

/** FNV-1a 32-bit — educational stand-in when WebCrypto not used in sync engine. */
function fnv1a(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

function simpleChecksum(s: string): string {
  let sum = 0;
  for (let i = 0; i < s.length; i++) sum = (sum + s.charCodeAt(i)) & 0xffff;
  return sum.toString(16).padStart(4, "0");
}

function b64Encode(s: string): string {
  if (typeof btoa === "function") return btoa(unescape(encodeURIComponent(s)));
  return Buffer.from(s, "utf8").toString("base64");
}

function b64Decode(s: string): string | { error: string } {
  try {
    if (typeof atob === "function") return decodeURIComponent(escape(atob(s)));
    return Buffer.from(s, "base64").toString("utf8");
  } catch {
    return { error: "Invalid Base64." };
  }
}

function xorCipher(text: string, key: string): string {
  if (!key) return text;
  let out = "";
  for (let i = 0; i < text.length; i++) {
    out += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return out;
}

function passwordScore(pw: string): { score: number; entropyBits: number } {
  const len = pw.length;
  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/[0-9]/.test(pw)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) pool += 32;
  const entropy = len * Math.log2(Math.max(pool, 1));
  let score = Math.min(100, Math.round((entropy / 80) * 100));
  if (len < 8) score = Math.min(score, 40);
  return { score, entropyBits: entropy };
}

const ALPHA = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

function randomFrom(alphabet: string, n: number): string {
  let out = "";
  for (let i = 0; i < n; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)]!;
  }
  return out;
}

export function computeItCrypto(slug: ItCryptoSlug, input: ItCryptoInput): ItCryptoResult {
  switch (slug) {
    case "it-hash-generator-md5-sha256-sha512": {
      const text = input.text ?? "";
      const algo = (input.algo ?? "fnv").toLowerCase();
      // Sync educational hashes; host may upgrade SHA via SubtleCrypto.
      const out =
        algo === "checksum"
          ? simpleChecksum(text)
          : algo.includes("sha")
            ? `sha-preview:${fnv1a(text + algo)} (use SubtleCrypto in host for real SHA)`
            : fnv1a(text);
      return {
        ok: true,
        output: out,
        note: "Educational hash preview. Prefer Web Crypto SHA-256/512 in the UI for real digests; MD5 is obsolete for security.",
      };
    }
    case "it-hash-compare-tool": {
      const a = (input.text ?? "").trim().toLowerCase();
      const b = (input.textB ?? "").trim().toLowerCase();
      if (!a || !b) return { ok: false, error: "Provide both hashes." };
      return { ok: true, match: a === b, note: a === b ? "Hashes match." : "Hashes differ." };
    }
    case "it-base64-encode-decode": {
      const text = input.text ?? "";
      const mode = (input.mode ?? "encode").toLowerCase();
      if (mode === "decode") {
        const d = b64Decode(text);
        if (typeof d !== "string") return { ok: false, error: d.error };
        return { ok: true, output: d, note: "Base64 decode (UTF-8)." };
      }
      return { ok: true, output: b64Encode(text), note: "Base64 encode (UTF-8)." };
    }
    case "it-jwt-decoder": {
      const jwt = (input.text ?? "").trim();
      const parts = jwt.split(".");
      if (parts.length < 2) return { ok: false, error: "JWT needs header.payload[.sig]." };
      try {
        const pad = (s: string) => s + "=".repeat((4 - (s.length % 4)) % 4);
        const header = JSON.parse(
          typeof atob === "function"
            ? atob(pad(parts[0]!.replace(/-/g, "+").replace(/_/g, "/")))
            : Buffer.from(parts[0]!, "base64url").toString("utf8"),
        );
        const payload = JSON.parse(
          typeof atob === "function"
            ? atob(pad(parts[1]!.replace(/-/g, "+").replace(/_/g, "/")))
            : Buffer.from(parts[1]!, "base64url").toString("utf8"),
        );
        return {
          ok: true,
          headers: JSON.stringify({ header, payload }, null, 2),
          note: "Decode only — signature NOT verified. Never trust unverified JWTs.",
        };
      } catch {
        return { ok: false, error: "Could not decode JWT segments." };
      }
    }
    case "it-encryption-decryption-tool": {
      const text = input.text ?? "";
      const key = input.key ?? "key";
      const mode = (input.mode ?? "encrypt").toLowerCase();
      const raw = xorCipher(text, key);
      const output = mode === "decrypt" ? raw : b64Encode(raw);
      const decoded =
        mode === "decrypt"
          ? (() => {
              const d = b64Decode(text);
              if (typeof d !== "string") return null;
              return xorCipher(d, key);
            })()
          : null;
      return {
        ok: true,
        output: decoded ?? output,
        note: "Demo XOR cipher only — NOT secure encryption. Use real crypto libraries for secrets.",
      };
    }
    case "it-password-strength-checker": {
      const pw = input.text ?? "";
      if (!pw) return { ok: false, error: "Password required." };
      const { score, entropyBits } = passwordScore(pw);
      return { ok: true, score, entropyBits, note: "Heuristic strength — not a breach check." };
    }
    case "it-random-password-generator": {
      const len = Math.min(128, Math.max(4, Math.floor(input.length ?? 16)));
      return { ok: true, output: randomFrom(ALPHA, len), note: `Random password length ${len} (Math.random — prefer crypto.getRandomValues in production).` };
    }
    case "it-salt-generator": {
      const len = Math.min(64, Math.max(4, Math.floor(input.length ?? 16)));
      return { ok: true, output: randomFrom("abcdef0123456789", len), note: "Hex salt sample." };
    }
    case "it-hmac-generator": {
      const text = input.text ?? "";
      const key = input.key ?? "";
      return {
        ok: true,
        output: fnv1a(key + ":" + text),
        note: "Educational HMAC stand-in (FNV). Host may use SubtleCrypto HMAC-SHA256.",
      };
    }
    case "it-ssl-certificate-decoder": {
      const pem = input.pem ?? input.text ?? "";
      if (!pem.includes("BEGIN CERTIFICATE") && !pem.includes("BEGIN")) {
        return { ok: false, error: "Paste a PEM block (BEGIN CERTIFICATE…)." };
      }
      const lines = pem.split(/\r?\n/).filter((l) => l && !l.includes("BEGIN") && !l.includes("END"));
      return {
        ok: true,
        headers: `PEM lines=${lines.length}, approx_bytes=${lines.join("").length * 0.75}`,
        note: "Structural PEM scan only — not X.509 field parsing. Use openssl x509 -text for full decode.",
      };
    }
    case "it-public-private-key-generator": {
      const len = Math.min(64, Math.max(16, Math.floor(input.length ?? 32)));
      return {
        ok: true,
        output: `demo-pub=${randomFrom("abcdef0123456789", len)}\ndemo-priv=${randomFrom("abcdef0123456789", len)}`,
        note: "Placeholder key material only. Generate real keys with Web Crypto / openssl.",
      };
    }
    case "it-checksum-calculator": {
      return {
        ok: true,
        output: simpleChecksum(input.text ?? ""),
        note: "Simple 16-bit additive checksum (teaching). Use CRC32/SHA for integrity.",
      };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
