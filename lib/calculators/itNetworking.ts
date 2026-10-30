/** IT networking — educational (no live DNS). */

export type ItNetworkingSlug =
  | "it-subnet-calculator"
  | "it-cidr-calculator"
  | "it-ip-range-calculator"
  | "it-ipv4-to-ipv6-converter"
  | "it-mac-address-converter"
  | "it-network-throughput-calculator"
  | "it-latency-calculator"
  | "it-packet-loss-calculator"
  | "it-dns-lookup-tool"
  | "it-port-number-reference-tool"
  | "it-mtu-calculator"
  | "it-broadcast-address-calculator";

export type ItNetworkingInput = {
  ip?: string;
  cidr?: number;
  mac?: string;
  bitsPerSecond?: number;
  distanceKm?: number;
  speedFraction?: number;
  sent?: number;
  lost?: number;
  hostname?: string;
  port?: number;
  mtu?: number;
  overhead?: number;
};

export type ItNetworkingResult =
  | { ok: false; error: string }
  | {
      ok: true;
      network?: string;
      broadcast?: string;
      firstHost?: string;
      lastHost?: string;
      hostCount?: number;
      mask?: string;
      ipv6?: string;
      macFormats?: string;
      throughputMbps?: number;
      latencyMs?: number;
      lossPct?: number;
      portInfo?: string;
      payload?: number;
      note: string;
    };

function ipToInt(ip: string): number | { error: string } {
  const parts = ip.trim().split(".").map((p) => Number(p));
  if (parts.length !== 4 || parts.some((p) => !Number.isInteger(p) || p < 0 || p > 255)) {
    return { error: "Invalid IPv4 address." };
  }
  return ((parts[0]! << 24) >>> 0) + (parts[1]! << 16) + (parts[2]! << 8) + parts[3]!;
}

function intToIp(n: number): string {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
}

function subnetFrom(ip: string, cidr: number) {
  const addr = ipToInt(ip);
  if (typeof addr !== "number") return addr;
  if (!Number.isInteger(cidr) || cidr < 0 || cidr > 32) return { error: "CIDR must be 0–32." };
  const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
  const network = (addr & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  const hostCount = cidr >= 31 ? (cidr === 32 ? 1 : 2) : 2 ** (32 - cidr) - 2;
  const first = cidr >= 31 ? network : network + 1;
  const last = cidr >= 31 ? broadcast : broadcast - 1;
  return {
    network: intToIp(network),
    broadcast: intToIp(broadcast),
    firstHost: intToIp(first),
    lastHost: intToIp(last),
    hostCount,
    mask: intToIp(mask),
  };
}

const WELL_KNOWN: Record<number, string> = {
  20: "FTP data",
  21: "FTP control",
  22: "SSH",
  23: "Telnet",
  25: "SMTP",
  53: "DNS",
  80: "HTTP",
  110: "POP3",
  143: "IMAP",
  443: "HTTPS",
  3306: "MySQL",
  5432: "PostgreSQL",
  6379: "Redis",
  8080: "HTTP alt",
};

export function computeItNetworking(slug: ItNetworkingSlug, input: ItNetworkingInput): ItNetworkingResult {
  switch (slug) {
    case "it-subnet-calculator":
    case "it-cidr-calculator":
    case "it-ip-range-calculator":
    case "it-broadcast-address-calculator": {
      const cidr = input.cidr ?? 24;
      const sub = subnetFrom(input.ip ?? "192.168.1.10", cidr);
      if ("error" in sub) return { ok: false, error: sub.error };
      return { ok: true, ...sub, note: "IPv4 subnet math (host counts exclude network/broadcast when applicable)." };
    }
    case "it-ipv4-to-ipv6-converter": {
      const addr = ipToInt(input.ip ?? "");
      if (typeof addr !== "number") return { ok: false, error: addr.error };
      const hex = addr.toString(16).padStart(8, "0");
      const ipv6 = `::ffff:${hex.slice(0, 4)}:${hex.slice(4)}`;
      return { ok: true, ipv6, note: "IPv4-mapped IPv6 (::ffff:a.b.c.d style as hex)." };
    }
    case "it-mac-address-converter": {
      const raw = (input.mac ?? "").replace(/[^0-9a-fA-F]/g, "");
      if (raw.length !== 12) return { ok: false, error: "MAC needs 12 hex digits." };
      const pairs = raw.match(/.{2}/g)!;
      return {
        ok: true,
        macFormats: `colon=${pairs.join(":")} dash=${pairs.join("-")} cisco=${pairs.slice(0, 2).join("")}.${pairs.slice(2, 4).join("")}.${pairs.slice(4).join("")}`,
        note: "MAC format variants (no OUI lookup).",
      };
    }
    case "it-network-throughput-calculator": {
      const bps = input.bitsPerSecond;
      if (!bps || bps <= 0) return { ok: false, error: "Bits/s must be positive." };
      return { ok: true, throughputMbps: bps / 1e6, note: "Throughput in Mbps from bits/s." };
    }
    case "it-latency-calculator": {
      const km = input.distanceKm;
      if (!km || km <= 0) return { ok: false, error: "Distance (km) must be positive." };
      const frac = input.speedFraction && input.speedFraction > 0 ? input.speedFraction : 0.67;
      const c = 299792.458; // km/s
      const oneWayMs = (km / (c * frac)) * 1000;
      return { ok: true, latencyMs: oneWayMs * 2, note: `RTT ≈ 2× distance/(c×${frac}) fiber-ish propagation only.` };
    }
    case "it-packet-loss-calculator": {
      const sent = input.sent;
      const lost = input.lost ?? 0;
      if (!sent || sent <= 0) return { ok: false, error: "Packets sent must be positive." };
      if (lost < 0 || lost > sent) return { ok: false, error: "Lost must be 0…sent." };
      return { ok: true, lossPct: (lost / sent) * 100, note: "Loss % = lost ÷ sent × 100." };
    }
    case "it-dns-lookup-tool": {
      const host = (input.hostname ?? "").trim().toLowerCase();
      if (!host) return { ok: false, error: "Hostname required." };
      return {
        ok: true,
        note: `Educational only — no live DNS query for "${host}". Use dig/nslookup in your environment.`,
      };
    }
    case "it-port-number-reference-tool": {
      const port = input.port;
      if (port === undefined || !Number.isInteger(port) || port < 0 || port > 65535) {
        return { ok: false, error: "Port must be 0–65535." };
      }
      const info = WELL_KNOWN[port] ?? (port < 1024 ? "System / well-known range" : port < 49152 ? "Registered range" : "Dynamic/private range");
      return { ok: true, portInfo: `${port}: ${info}`, note: "Common-port cheat sheet — not authoritative IANA dump." };
    }
    case "it-mtu-calculator": {
      const mtu = input.mtu ?? 1500;
      const oh = input.overhead ?? 40;
      if (mtu <= 0 || oh < 0) return { ok: false, error: "MTU must be positive; overhead ≥ 0." };
      return { ok: true, payload: Math.max(0, mtu - oh), note: `Approx L4 payload ≈ MTU − ${oh} (IP+TCP-ish).` };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
