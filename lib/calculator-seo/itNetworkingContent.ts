import type { RichArticle } from "./types";

const HUB_HREF = "/engineering/it-dev/it-networking";
const HUB_LABEL = "Engineering · IT/Dev · Networking calculators";
const SHELL =
  "IT and developer education tools that run in your browser. Not a substitute for production security review, certified capacity planning, or vendor documentation. Stack assumptions and defaults are simplified — validate with your team before deploying.";

function article(
  slug: string,
  heading: string,
  paragraphs: string[],
  faq: { question: string; answer: string },
  seoTitle: string,
  seoDescription: string,
  keywords: string[],
): RichArticle {
  return {
    slug,
    vertical: "engineering-electrical",
    category: "engineering",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "Networking tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Subnet calculator", "Network, broadcast, host range from mask"],
          ["CIDR calculator", "Prefix length ↔ subnet mask"],
          ["IP range", "First/last host in a block"],
          ["IPv4 ↔ IPv6", "Mapped or translated address forms"],
          ["MAC converter", "Colon, hyphen, dot notation"],
          ["Throughput", "Goodput from bandwidth and overhead"],
          ["Latency", "RTT and one-way delay estimates"],
          ["Packet loss", "Effective throughput vs loss rate"],
          ["DNS lookup", "Resolve names to records (when built)"],
          ["Port reference", "Well-known port lookup"],
          ["MTU", "Max payload size path planning"],
          ["Broadcast address", "Last address in subnet"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your networking inputs. Educational IT aid only — verify designs with network engineering standards.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const IT_NETWORKING_ARTICLES: Record<string, RichArticle> = {
  "it-subnet-calculator": article(
    "it-subnet-calculator",
    "Subnet calculator",
    [
      "Derives network address, broadcast, and usable host range from an IPv4 address and subnet mask.",
      "Reserved addresses, VLSM plans, and provider assignments may differ — confirm with your IP address management policy.",
    ],
    {
      question: "How many usable hosts in a /24?",
      answer:
        "A /24 has 256 addresses; typically 254 usable hosts when network and broadcast are reserved in classic IPv4 subnetting.",
    },
    "Subnet Calculator — Network, Broadcast & Host Range",
    "Calculate IPv4 subnet details from address and mask. Educational networking aid — validate with your IP plan.",
    ["subnet calculator", "ipv4 subnet mask", "usable hosts calculator"],
  ),
  "it-cidr-calculator": article(
    "it-cidr-calculator",
    "CIDR calculator",
    [
      "Converts CIDR prefix length (e.g. /26) to dotted-decimal mask and host counts for routing and firewall rules.",
      "Summarization and supernets aggregate multiple prefixes — this tool focuses on a single prefix literacy view.",
    ],
    {
      question: "What does /26 mean?",
      answer:
        "The prefix is 26 bits of network portion — 6 host bits remain, yielding 64 addresses in that block (including network/broadcast in classic counting).",
    },
    "CIDR Calculator — Prefix Length & Subnet Mask",
    "Convert CIDR notation to mask and host math. Developer education tool — not a replacement for IPAM.",
    ["cidr calculator", "prefix length to mask", "cidr host count"],
  ),
  "it-ip-range-calculator": article(
    "it-ip-range-calculator",
    "IP range calculator",
    [
      "Lists first and last addresses in a contiguous IPv4 block from start IP and count or end IP.",
      "Private RFC1918 space and public routing require different planning — check overlap with existing VLANs.",
    ],
    {
      question: "Can I use the network and broadcast addresses as hosts?",
      answer:
        "Modern networks often use /31 or /32 exceptions, but classic subnets reserve network and broadcast — follow your platform's rules.",
    },
    "IP Range Calculator — First & Last Address in Block",
    "Determine IPv4 address ranges for allocation planning. Educational aid — coordinate with network operations.",
    ["ip range calculator", "ipv4 address range", "first last ip in subnet"],
  ),
  "it-ipv4-to-ipv6-converter": article(
    "it-ipv4-to-ipv6-converter",
    "IPv4 to IPv6 converter",
    [
      "Shows mapped IPv6 forms (e.g. ::ffff:x.x.x.x) used in dual-stack and transition teaching scenarios.",
      "Real deployment uses SLAAC, DHCPv6, and routing policies — mapping is one literacy pattern among many.",
    ],
    {
      question: "Does IPv4-mapped IPv6 replace NAT?",
      answer:
        "No. It is a representation for sockets and documentation. Transition strategies include dual stack, NAT64, and native IPv6.",
    },
    "IPv4 to IPv6 Converter — Mapped Address Forms",
    "Explore IPv4-mapped IPv6 notation for dual-stack literacy. Educational tool — follow your org's IPv6 design.",
    ["ipv4 to ipv6 converter", "ipv4 mapped ipv6", "dual stack address"],
  ),
  "it-mac-address-converter": article(
    "it-mac-address-converter",
    "MAC address converter",
    [
      "Reformats 48-bit MAC addresses among colon, hyphen, Cisco dot, and bare hex styles for scripts and logs.",
      "Locally administered vs universal bits and EUI-64 derivation for IPv6 are separate concerns — validate OUI when sourcing hardware.",
    ],
    {
      question: "Are MAC formats interchangeable?",
      answer:
        "Same 48 bits, different separators. Parsers must accept your target format — normalize before string comparison.",
    },
    "MAC Address Converter — Colon, Hyphen & Dot Notation",
    "Convert MAC address formatting for logs and automation. Educational IT aid — not an ARP or switch manager.",
    ["mac address converter", "mac format colon hyphen", "normalize mac address"],
  ),
  "it-network-throughput-calculator": article(
    "it-network-throughput-calculator",
    "Network throughput calculator",
    [
      "Relates link speed, protocol overhead, and efficiency to expected goodput for capacity planning.",
      "Encryption, retransmits, and concurrent flows reduce sustained throughput below interface line rate.",
    ],
    {
      question: "Why is goodput lower than Mbps on the NIC?",
      answer:
        "Headers, ACKs, retransmissions, and CPU limits consume capacity. Measure with iperf or application metrics on your path.",
    },
    "Network Throughput Calculator — Goodput & Overhead",
    "Estimate effective throughput from link speed and efficiency. Planning aid — benchmark production paths.",
    ["network throughput calculator", "goodput estimate", "link capacity planning"],
  ),
  "it-latency-calculator": article(
    "it-latency-calculator",
    "Latency calculator",
    [
      "Estimates one-way or round-trip delay from distance, medium, and processing hops for teaching queueing basics.",
      "Speed of light in fiber and routing detours dominate WAN RTT — ping measurements beat back-of-envelope math.",
    ],
    {
      question: "Is latency only about distance?",
      answer:
        "No. Serialization, queuing, TLS handshakes, and server processing add milliseconds even on short paths.",
    },
    "Latency Calculator — RTT & Delay Estimates",
    "Reason about network latency for architecture discussions. Educational tool — measure RTT in your environment.",
    ["latency calculator", "network rtt estimate", "round trip delay"],
  ),
  "it-packet-loss-calculator": article(
    "it-packet-loss-calculator",
    "Packet loss calculator",
    [
      "Shows how loss percentage degrades effective throughput and retry behavior for TCP-like flows.",
      "Wireless, congested queues, and faulty optics cause bursty loss — average loss rate oversimplifies real paths.",
    ],
    {
      question: "How much loss is acceptable?",
      answer:
        "Voice and gaming want well under 1%. TCP can survive small loss but throughput collapses as loss rises — monitor SLIs.",
    },
    "Packet Loss Calculator — Throughput Impact",
    "Explore how packet loss affects effective data delivery. Educational networking aid — use active monitoring in prod.",
    ["packet loss calculator", "tcp throughput loss", "network loss impact"],
  ),
  "it-dns-lookup-tool": article(
    "it-dns-lookup-tool",
    "DNS lookup tool",
    [
      "Resolves hostnames to A, AAAA, CNAME, MX, and TXT records when implemented — useful for quick integration checks.",
      "Resolver cache, split-horizon DNS, and DNSSEC validation affect answers — not authoritative for production cutovers.",
    ],
    {
      question: "Why do I get different answers than my colleague?",
      answer:
        "Resolvers, TTL caching, geo DNS, and internal vs public views return different records. Query the authoritative server when debugging.",
    },
    "DNS Lookup Tool — Resolve Records in Browser",
    "Look up DNS records for hostname troubleshooting literacy. Educational aid — confirm changes at authority NS.",
    ["dns lookup tool", "resolve a record", "mx txt lookup"],
  ),
  "it-port-number-reference-tool": article(
    "it-port-number-reference-tool",
    "Port number reference tool",
    [
      "Look up well-known TCP/UDP port assignments for HTTP, HTTPS, SSH, and common services during integration work.",
      "Ephemeral ports and custom app registrations are not exhaustive — IANA registry is the canonical source.",
    ],
    {
      question: "Can any app use port 443?",
      answer:
        "Technically yes on a private host, but firewalls and clients expect HTTPS on 443. Use registered ports to avoid collisions.",
    },
    "Port Number Reference — Well-Known TCP/UDP Ports",
    "Quick reference for common network port assignments. Educational IT tool — verify with IANA for new services.",
    ["port number reference", "well known ports", "tcp udp port list"],
  ),
  "it-mtu-calculator": article(
    "it-mtu-calculator",
    "MTU calculator",
    [
      "Computes maximum transmission unit implications for IP headers, TCP MSS, and fragmentation on a path.",
      "Path MTU discovery and tunnel overhead (VPN, GRE) often require lowering MSS below interface MTU.",
    ],
    {
      question: "What MTU should I use on VPN?",
      answer:
        "Subtract tunnel headers from physical MTU — common safe MSS values are 1360–1400 bytes; test with ping don't fragment.",
    },
    "MTU Calculator — Payload Size & MSS Planning",
    "Plan MTU and MSS to avoid fragmentation on your path. Educational aid — run path MTU discovery in production.",
    ["mtu calculator", "tcp mss calculator", "path mtu planning"],
  ),
  "it-broadcast-address-calculator": article(
    "it-broadcast-address-calculator",
    "Broadcast address calculator",
    [
      "Finds the broadcast address for an IPv4 subnet — the destination for LAN-wide frames in classic Ethernet designs.",
      "Modern networks limit broadcast domains with VLANs; directed broadcast is often filtered at routers.",
    ],
    {
      question: "Is broadcast still used?",
      answer:
        "DHCP and ARP still use broadcast on L2 segments. Routed IP broadcast is restricted on most secure networks.",
    },
    "Broadcast Address Calculator — IPv4 Subnet Broadcast",
    "Calculate the broadcast address for an IPv4 network. Educational networking tool — follow your L2/L3 design.",
    ["broadcast address calculator", "ipv4 broadcast", "subnet broadcast ip"],
  ),
};
