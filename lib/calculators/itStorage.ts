/** IT data storage & size — educational. */

export type ItStorageSlug =
  | "it-data-storage-converter-kb-mb-gb-tb-pb"
  | "it-file-size-calculator"
  | "it-data-transfer-calculator"
  | "it-bandwidth-calculator"
  | "it-download-time-calculator"
  | "it-upload-time-calculator"
  | "it-storage-cost-calculator"
  | "it-backup-size-estimator"
  | "it-compression-ratio-calculator";

export type ItStorageInput = {
  value?: number;
  unit?: string;
  bitsPerSecond?: number;
  sizeBytes?: number;
  costPerGb?: number;
  compressionRatio?: number;
  changeRatePct?: number;
  rows?: number;
  bytesPerRow?: number;
};

export type ItStorageResult =
  | { ok: false; error: string }
  | {
      ok: true;
      bytes?: number;
      kb?: number;
      mb?: number;
      gb?: number;
      tb?: number;
      pb?: number;
      seconds?: number;
      cost?: number;
      compressedBytes?: number;
      note: string;
    };

const UNIT_TO_BYTES: Record<string, number> = {
  b: 1,
  byte: 1,
  bytes: 1,
  kb: 1024,
  kib: 1024,
  mb: 1024 ** 2,
  mib: 1024 ** 2,
  gb: 1024 ** 3,
  gib: 1024 ** 3,
  tb: 1024 ** 4,
  tib: 1024 ** 4,
  pb: 1024 ** 5,
  pib: 1024 ** 5,
};

function toBytes(value: number, unit: string): number | { error: string } {
  if (!Number.isFinite(value) || value < 0) return { error: "Value must be ≥ 0." };
  const u = (unit || "mb").toLowerCase();
  const f = UNIT_TO_BYTES[u];
  if (!f) return { error: "Unknown unit (use B/KB/MB/GB/TB/PB)." };
  return value * f;
}

function fromBytes(bytes: number) {
  return {
    bytes,
    kb: bytes / 1024,
    mb: bytes / 1024 ** 2,
    gb: bytes / 1024 ** 3,
    tb: bytes / 1024 ** 4,
    pb: bytes / 1024 ** 5,
  };
}

export function computeItStorage(slug: ItStorageSlug, input: ItStorageInput): ItStorageResult {
  switch (slug) {
    case "it-data-storage-converter-kb-mb-gb-tb-pb":
    case "it-file-size-calculator": {
      const bytes = toBytes(input.value ?? 0, input.unit ?? "mb");
      if (typeof bytes !== "number") return { ok: false, error: bytes.error };
      return { ok: true, ...fromBytes(bytes), note: "Binary (1024) units — IEC-style KiB/MiB naming omitted for brevity." };
    }
    case "it-data-transfer-calculator":
    case "it-bandwidth-calculator": {
      const bytes = toBytes(input.value ?? input.sizeBytes ?? 0, input.unit ?? "gb");
      if (typeof bytes !== "number") return { ok: false, error: bytes.error };
      const bps = input.bitsPerSecond;
      if (!bps || bps <= 0) return { ok: false, error: "Bandwidth (bits/s) must be positive." };
      const seconds = (bytes * 8) / bps;
      return { ok: true, ...fromBytes(bytes), seconds, note: "Time = size_bits ÷ bandwidth. Ignores protocol overhead." };
    }
    case "it-download-time-calculator":
    case "it-upload-time-calculator": {
      const bytes = toBytes(input.value ?? input.sizeBytes ?? 0, input.unit ?? "mb");
      if (typeof bytes !== "number") return { ok: false, error: bytes.error };
      const bps = input.bitsPerSecond;
      if (!bps || bps <= 0) return { ok: false, error: "Link speed (bits/s) must be positive." };
      return {
        ok: true,
        ...fromBytes(bytes),
        seconds: (bytes * 8) / bps,
        note: slug.includes("upload") ? "Upload time estimate." : "Download time estimate.",
      };
    }
    case "it-storage-cost-calculator": {
      const bytes = toBytes(input.value ?? 0, input.unit ?? "gb");
      if (typeof bytes !== "number") return { ok: false, error: bytes.error };
      const rate = input.costPerGb ?? 0;
      const gb = bytes / 1024 ** 3;
      return { ok: true, ...fromBytes(bytes), cost: gb * rate, note: "Cost ≈ GB × $/GB (list price; egress/extra fees excluded)." };
    }
    case "it-backup-size-estimator": {
      const bytes = toBytes(input.value ?? 0, input.unit ?? "gb");
      if (typeof bytes !== "number") return { ok: false, error: bytes.error };
      const change = (input.changeRatePct ?? 10) / 100;
      const full = bytes;
      const incr = bytes * change;
      return {
        ok: true,
        ...fromBytes(full),
        compressedBytes: incr,
        note: `Full backup ≈ source size; incremental ≈ ${change * 100}% change volume (rough).`,
      };
    }
    case "it-compression-ratio-calculator": {
      const orig = toBytes(input.value ?? 0, input.unit ?? "mb");
      if (typeof orig !== "number") return { ok: false, error: orig.error };
      const ratio = input.compressionRatio && input.compressionRatio > 0 ? input.compressionRatio : 2;
      const compressed = orig / ratio;
      return {
        ok: true,
        ...fromBytes(orig),
        compressedBytes: compressed,
        note: `Compressed ≈ original ÷ ${ratio}. Real ratios depend on data entropy.`,
      };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
