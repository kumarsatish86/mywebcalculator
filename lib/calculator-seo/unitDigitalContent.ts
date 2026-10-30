import type { RichArticle } from "./types";

const STORAGE_HREF = "/conversion/unit-converters/unit-digital-storage";
const STORAGE_LABEL = "Conversion · Digital storage";
const RATE_HREF = "/conversion/unit-converters/unit-data-transfer-rate";
const RATE_LABEL = "Conversion · Data transfer rate";
const SHELL =
  "Browser unit conversion teaching aids. Digital storage and bitrate factors use common SI or IEC references — OS and vendor labeling conventions may differ.";
const CHART = {
  kind: "none" as const,
  title: "Overview",
  caption:
    "Share URL preserves your inputs. Conversion factors are standard references; trade conventions may differ.",
};

function article(
  slug: string,
  heading: string,
  paragraphs: string[],
  faq: { question: string; answer: string },
  seoTitle: string,
  seoDescription: string,
  keywords: string[],
  hubHref: string,
  hubLabel: string,
  tableRows: [string, string][],
  tableTitle: string,
): RichArticle {
  return {
    slug,
    vertical: "finance-loan",
    category: "conversion",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: tableTitle,
        columnHeaders: ["Pair", "Factor idea"],
        rows: tableRows,
      },
    ],
    chart: CHART,
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref,
    hubLabel,
  };
}

const STORAGE_ROWS: [string, string][] = [
  ["KB ↔ MB…", "Decimal ×1000 steps"],
  ["B ↔ bit", "1 byte = 8 bits"],
  ["MB ↔ MiB", "10⁶ vs 2²⁰ bytes"],
];

const RATE_ROWS: [string, string][] = [
  ["Mbps ↔ MBps", "1 MBps = 8 Mbps"],
  ["Kbps ↔ Mbps", "1 Mbps = 1000 Kbps"],
  ["Gbps ↔ Mbps", "1 Gbps = 1000 Mbps"],
];

export const UNIT_DIGITAL_ARTICLES: Record<string, RichArticle> = {
  "unit-kb-mb-gb-tb-converter": article(
    "unit-kb-mb-gb-tb-converter",
    "KB ↔ MB ↔ GB ↔ TB",
    [
      "Scales kilobytes through megabytes, gigabytes, and terabytes with decimal (×1000) SI prefixes.",
      "Drive marketing often uses decimal GB/TB; OS views may use binary GiB/TiB instead.",
    ],
    {
      question: "Why does my 1 TB drive show less free space?",
      answer:
        "Vendors often count 1 TB = 10¹² bytes while OS tools may show TiB (2⁴⁰), so the number looks smaller.",
    },
    "KB MB GB TB Converter — decimal storage",
    "Convert KB to MB, GB, and TB with SI ×1000 prefixes. Digital storage teaching aid.",
    ["kb to mb", "gb to tb converter", "mb to gb"],
    STORAGE_HREF,
    STORAGE_LABEL,
    STORAGE_ROWS,
    "Storage pairs",
  ),
  "unit-byte-bit-converter": article(
    "unit-byte-bit-converter",
    "Byte ↔ bit",
    [
      "Converts bytes to bits with 1 byte = 8 bits for networking and file-size teaching.",
      "ISPs quote bits per second; downloads are often discussed in bytes — divide by 8 carefully.",
    ],
    {
      question: "Is a byte always 8 bits?",
      answer: "In modern computing teaching and this tool, yes — 1 byte = 8 bits.",
    },
    "Byte to Bit Converter — B ↔ bit",
    "Convert bytes to bits with the 8× factor. Digital size teaching aid.",
    ["bytes to bits", "byte to bit converter", "bits to bytes"],
    STORAGE_HREF,
    STORAGE_LABEL,
    STORAGE_ROWS,
    "Storage pairs",
  ),
  "unit-mb-mib-converter": article(
    "unit-mb-mib-converter",
    "MB ↔ MiB",
    [
      "Compares decimal megabytes (10⁶ B) with mebibytes (2²⁰ B) so marketing and OS sizes match up.",
      "1 MB ≈ 0.9537 MiB — binary units are slightly larger steps for the same prefix letter.",
    ],
    {
      question: "What does MiB mean?",
      answer: "Mebibyte — IEC binary prefix for 2²⁰ bytes (1,048,576 B), not 1,000,000 B.",
    },
    "MB to MiB Converter — decimal vs binary",
    "Convert megabytes to mebibytes (10⁶ vs 2²⁰). Storage labeling teaching aid.",
    ["mb to mib", "megabyte to mebibyte", "mib to mb converter"],
    STORAGE_HREF,
    STORAGE_LABEL,
    STORAGE_ROWS,
    "Storage pairs",
  ),
  "unit-megabit-per-second-megabyte-per-second": article(
    "unit-megabit-per-second-megabyte-per-second",
    "Mbps ↔ MBps",
    [
      "Converts megabits per second to megabytes per second with ÷ 8 (1 MBps = 8 Mbps).",
      "Helps estimate download speed when the ISP quotes Mbps but file sizes are in MB.",
    ],
    {
      question: "Why is my download slower than my plan?",
      answer:
        "Plans are often Mbps; dividing by 8 gives ideal MBps before overhead, Wi-Fi, and server limits.",
    },
    "Mbps to MBps Converter — megabit vs megabyte",
    "Convert Mbps to MBps with the 8× bit/byte factor. Bandwidth teaching aid.",
    ["mbps to mbps bytes", "mbps to MBps", "megabit to megabyte per second"],
    RATE_HREF,
    RATE_LABEL,
    RATE_ROWS,
    "Data rate pairs",
  ),
  "unit-kbps-mbps-converter": article(
    "unit-kbps-mbps-converter",
    "Kbps ↔ Mbps",
    [
      "Converts kilobits per second to megabits per second with ÷ 1000 for older and modern link rates.",
      "Streaming and modem-era specs often mix Kbps and Mbps on the same chart.",
    ],
    {
      question: "Is 1000 or 1024 used?",
      answer: "This teaching tool uses decimal SI steps: 1000 Kbps = 1 Mbps.",
    },
    "Kbps to Mbps Converter — bitrate scale",
    "Convert Kbps to Mbps with the SI 1000 factor. Data rate teaching aid.",
    ["kbps to mbps", "kilobit to megabit", "mbps to kbps"],
    RATE_HREF,
    RATE_LABEL,
    RATE_ROWS,
    "Data rate pairs",
  ),
  "unit-gbps-mbps-converter": article(
    "unit-gbps-mbps-converter",
    "Gbps ↔ Mbps",
    [
      "Converts gigabits per second to megabits per second with × 1000 for LAN and backbone speeds.",
      "A 1 Gbps link is 1000 Mbps under the decimal teaching scale used here.",
    ],
    {
      question: "Is 1 Gbps the same as 125 MBps?",
      answer: "Ideally yes (1000 Mbps ÷ 8), before protocol overhead.",
    },
    "Gbps to Mbps Converter — gigabit rate",
    "Convert Gbps to Mbps with the SI 1000 factor. Network speed teaching aid.",
    ["gbps to mbps", "gigabit to megabit", "mbps to gbps"],
    RATE_HREF,
    RATE_LABEL,
    RATE_ROWS,
    "Data rate pairs",
  ),
};
