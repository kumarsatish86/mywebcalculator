/** IT database & data — educational sizing. */

export type ItDatabaseSlug =
  | "it-query-cost-estimator"
  | "it-database-size-calculator"
  | "it-table-size-estimator"
  | "it-index-size-calculator"
  | "it-row-size-calculator"
  | "it-data-growth-calculator"
  | "it-backup-time-calculator-db"
  | "it-replication-lag-estimator"
  | "it-storage-iops-calculator";

export type ItDatabaseInput = {
  rows?: number;
  bytesPerRow?: number;
  indexFactor?: number;
  tables?: number;
  growthPct?: number;
  months?: number;
  sizeGb?: number;
  throughputMBps?: number;
  lagBytes?: number;
  replicateMBps?: number;
  iops?: number;
  ioSizeKb?: number;
  seqPages?: number;
  randomPages?: number;
};

export type ItDatabaseResult =
  | { ok: false; error: string }
  | {
      ok: true;
      bytes?: number;
      gb?: number;
      seconds?: number;
      lagSeconds?: number;
      iops?: number;
      costUnits?: number;
      note: string;
    };

export function computeItDatabase(slug: ItDatabaseSlug, input: ItDatabaseInput): ItDatabaseResult {
  switch (slug) {
    case "it-row-size-calculator": {
      const b = input.bytesPerRow;
      if (!b || b <= 0) return { ok: false, error: "Bytes/row must be positive." };
      return { ok: true, bytes: b, note: "Average row size input (includes row overhead if you bake it in)." };
    }
    case "it-table-size-estimator":
    case "it-database-size-calculator": {
      const rows = input.rows;
      const bpr = input.bytesPerRow;
      if (!rows || rows <= 0 || !bpr || bpr <= 0) return { ok: false, error: "Rows and bytes/row must be positive." };
      const tables = input.tables && input.tables > 0 ? input.tables : 1;
      const idx = input.indexFactor !== undefined && input.indexFactor >= 0 ? input.indexFactor : 0.2;
      const bytes = rows * bpr * tables * (1 + idx);
      return {
        ok: true,
        bytes,
        gb: bytes / 1024 ** 3,
        note: `Size ≈ rows×row×tables×(1+indexFactor ${idx}).`,
      };
    }
    case "it-index-size-calculator": {
      const rows = input.rows;
      const bpr = input.bytesPerRow ?? 32;
      if (!rows || rows <= 0) return { ok: false, error: "Rows must be positive." };
      const bytes = rows * bpr;
      return { ok: true, bytes, gb: bytes / 1024 ** 3, note: "Index size ≈ rows × key width (simplified)." };
    }
    case "it-data-growth-calculator": {
      const sizeGb = input.sizeGb;
      const growth = (input.growthPct ?? 10) / 100;
      const months = input.months ?? 12;
      if (!sizeGb || sizeGb <= 0) return { ok: false, error: "Current size (GB) must be positive." };
      const future = sizeGb * Math.pow(1 + growth, months / 12);
      return { ok: true, gb: future, note: `Compound growth ${(growth * 100).toFixed(1)}%/yr over ${months} months.` };
    }
    case "it-backup-time-calculator-db": {
      const sizeGb = input.sizeGb;
      const mbps = input.throughputMBps;
      if (!sizeGb || sizeGb <= 0 || !mbps || mbps <= 0) return { ok: false, error: "Size GB and MB/s must be positive." };
      const seconds = (sizeGb * 1024) / mbps;
      return { ok: true, gb: sizeGb, seconds, note: "Backup time ≈ size ÷ throughput." };
    }
    case "it-replication-lag-estimator": {
      const lagBytes = input.lagBytes;
      const mbps = input.replicateMBps;
      if (lagBytes === undefined || lagBytes < 0 || !mbps || mbps <= 0) {
        return { ok: false, error: "Lag bytes ≥ 0 and replicate MB/s > 0 required." };
      }
      return {
        ok: true,
        lagSeconds: lagBytes / (mbps * 1024 * 1024),
        note: "Lag time ≈ backlog bytes ÷ apply rate.",
      };
    }
    case "it-storage-iops-calculator": {
      const iops = input.iops;
      const ioKb = input.ioSizeKb ?? 8;
      if (!iops || iops <= 0) return { ok: false, error: "IOPS must be positive." };
      const mbps = (iops * ioKb) / 1024;
      return { ok: true, iops, bytes: mbps * 1024 * 1024, note: `Throughput ≈ IOPS × ${ioKb} KiB ≈ ${mbps.toFixed(1)} MB/s.` };
    }
    case "it-query-cost-estimator": {
      const seq = input.seqPages ?? 0;
      const rand = input.randomPages ?? 0;
      if (seq < 0 || rand < 0) return { ok: false, error: "Page counts must be ≥ 0." };
      const cost = seq * 1 + rand * 4;
      return {
        ok: true,
        costUnits: cost,
        note: "Toy cost = seqPages×1 + randomPages×4 (planner teaching model).",
      };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
