/** IT performance & load — educational. */

export type ItPerfSlug =
  | "it-load-time-calculator"
  | "it-requests-per-second-calculator"
  | "it-concurrent-users-calculator"
  | "it-throughput-calculator"
  | "it-response-time-calculator"
  | "it-cpu-usage-calculator"
  | "it-memory-usage-calculator"
  | "it-disk-io-calculator"
  | "it-cache-hit-ratio-calculator";

export type ItPerfInput = {
  bytes?: number;
  bandwidthBps?: number;
  requests?: number;
  seconds?: number;
  users?: number;
  thinkTimeSec?: number;
  responseMs?: number;
  cpuBusy?: number;
  cpuIdle?: number;
  usedMb?: number;
  totalMb?: number;
  hits?: number;
  misses?: number;
  iops?: number;
  ioKb?: number;
};

export type ItPerfResult =
  | { ok: false; error: string }
  | {
      ok: true;
      seconds?: number;
      rps?: number;
      concurrency?: number;
      throughput?: number;
      responseMs?: number;
      cpuPct?: number;
      memPct?: number;
      hitRatio?: number;
      note: string;
    };

export function computeItPerf(slug: ItPerfSlug, input: ItPerfInput): ItPerfResult {
  switch (slug) {
    case "it-load-time-calculator": {
      const bytes = input.bytes;
      const bps = input.bandwidthBps;
      if (!bytes || bytes <= 0 || !bps || bps <= 0) return { ok: false, error: "Bytes and bandwidth must be positive." };
      return { ok: true, seconds: bytes / bps, note: "Load time ≈ payload ÷ bandwidth (no RTT/TLS)." };
    }
    case "it-requests-per-second-calculator":
    case "it-throughput-calculator": {
      const req = input.requests;
      const sec = input.seconds;
      if (!req || req < 0 || !sec || sec <= 0) return { ok: false, error: "Requests ≥ 0 and seconds > 0." };
      return { ok: true, rps: req / sec, throughput: req / sec, note: "RPS = requests ÷ window seconds." };
    }
    case "it-concurrent-users-calculator": {
      const users = input.users;
      const think = input.thinkTimeSec ?? 1;
      const resp = (input.responseMs ?? 200) / 1000;
      if (!users || users <= 0) return { ok: false, error: "Users must be positive." };
      const concurrency = users * (resp / (resp + think));
      return { ok: true, concurrency, note: "Little’s law-ish: concurrency ≈ users × (service/(service+think))." };
    }
    case "it-response-time-calculator": {
      const rps = input.requests && input.seconds ? input.requests / input.seconds : undefined;
      const concurrency = input.users;
      if (rps && rps > 0 && concurrency && concurrency > 0) {
        return { ok: true, responseMs: (concurrency / rps) * 1000, note: "Response ≈ concurrency/RPS (Little’s law)." };
      }
      const ms = input.responseMs;
      if (!ms || ms <= 0) return { ok: false, error: "Provide responseMs or users+requests/seconds." };
      return { ok: true, responseMs: ms, note: "Echoed response time input." };
    }
    case "it-cpu-usage-calculator": {
      const busy = input.cpuBusy ?? 0;
      const idle = input.cpuIdle ?? 0;
      if (busy < 0 || idle < 0 || busy + idle <= 0) return { ok: false, error: "Busy/idle ticks must sum > 0." };
      return { ok: true, cpuPct: (busy / (busy + idle)) * 100, note: "CPU% = busy/(busy+idle)." };
    }
    case "it-memory-usage-calculator": {
      const used = input.usedMb;
      const total = input.totalMb;
      if (used === undefined || used < 0 || !total || total <= 0) return { ok: false, error: "Used ≥ 0 and total > 0." };
      return { ok: true, memPct: (used / total) * 100, note: "Memory% = used/total." };
    }
    case "it-disk-io-calculator": {
      const iops = input.iops;
      const kb = input.ioKb ?? 8;
      if (!iops || iops <= 0) return { ok: false, error: "IOPS must be positive." };
      return { ok: true, throughput: (iops * kb) / 1024, note: `MB/s ≈ IOPS×${kb}KiB.` };
    }
    case "it-cache-hit-ratio-calculator": {
      const hits = input.hits ?? 0;
      const misses = input.misses ?? 0;
      if (hits < 0 || misses < 0 || hits + misses <= 0) return { ok: false, error: "Hits+misses must be > 0." };
      return { ok: true, hitRatio: hits / (hits + misses), note: "Hit ratio = hits/(hits+misses)." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
