import type { RichArticle } from "./types";

const HUB_HREF = "/engineering/it-dev/it-data-storage-size";
const HUB_LABEL = "Engineering · IT/Dev · Data storage and size calculators";
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
        title: "Data storage and size tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Storage converter", "KB, MB, GB, TB, PB with SI vs binary"],
          ["File size", "Bytes from dimensions or item counts"],
          ["Data transfer", "Volume ÷ effective throughput"],
          ["Bandwidth", "Bits per second capacity planning"],
          ["Download / upload time", "Size ÷ rate with overhead"],
          ["Storage cost", "GB × rate × retention"],
          ["Backup size", "Source data × change rate"],
          ["Compression ratio", "Uncompressed ÷ compressed size"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your storage inputs. Educational IT aid only — verify units and vendor billing with real metrics.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const IT_STORAGE_ARTICLES: Record<string, RichArticle> = {
  "it-data-storage-converter-kb-mb-gb-tb-pb": article(
    "it-data-storage-converter-kb-mb-gb-tb-pb",
    "Data storage converter (KB, MB, GB, TB, PB)",
    [
      "Converts among byte multiples — watch for decimal (1000-based) vs binary (1024-based) definitions used by OS and cloud vendors.",
      "Marketing labels (GB on drives) often differ from gibibytes in tools — align units before comparing quotes.",
    ],
    {
      question: "Is 1 GB 1000 or 1024 MB?",
      answer:
        "SI gigabytes use 1000³ bytes; gibibytes (GiB) use 1024³. Storage vendors and operating systems mix both — always check which definition applies.",
    },
    "Data Storage Converter — KB, MB, GB, TB, PB Units",
    "Convert between storage size units with clear SI vs binary context. Educational IT tool — confirm vendor unit definitions.",
    ["data storage converter", "KB MB GB TB converter", "bytes to gigabytes"],
  ),
  "it-file-size-calculator": article(
    "it-file-size-calculator",
    "File size calculator",
    [
      "Estimates total bytes from file count, average size, or dimensional inputs for planning uploads and quotas.",
      "Metadata, block alignment, and filesystem overhead are not always included — add margin for real deployments.",
    ],
    {
      question: "Why is on-disk size larger than file bytes?",
      answer:
        "Filesystems allocate in blocks; small files waste slack space. Compression and sparse files also change apparent size.",
    },
    "File Size Calculator — Total Bytes & Storage Estimate",
    "Estimate aggregate file size from counts and averages. Developer planning aid — not a disk usage analyzer.",
    ["file size calculator", "total bytes estimate", "storage quota planning"],
  ),
  "it-data-transfer-calculator": article(
    "it-data-transfer-calculator",
    "Data transfer calculator",
    [
      "Relates data volume, link speed, and elapsed time for migration and sync planning.",
      "Effective throughput is below line rate due to protocol overhead, latency, and concurrent traffic.",
    ],
    {
      question: "Should I use line rate or measured throughput?",
      answer:
        "Use measured or conservative effective Mbps for schedules. Line rate alone overstates how fast bulk transfers finish.",
    },
    "Data Transfer Calculator — Volume, Speed & Time",
    "Plan data moves from size and throughput assumptions. Educational IT aid — benchmark your actual path.",
    ["data transfer calculator", "migration time estimate", "throughput planning"],
  ),
  "it-bandwidth-calculator": article(
    "it-bandwidth-calculator",
    "Bandwidth calculator",
    [
      "Translates between bits per second, bytes per second, and expected transfer capacity for link sizing.",
      "Shared links, QoS, and burst limits mean headline bandwidth is not always available to one flow.",
    ],
    {
      question: "Mbps vs MB/s — what is the difference?",
      answer:
        "Mbps is megabits per second; MB/s is megabytes per second. Divide Mbps by 8 to approximate MB/s before overhead.",
    },
    "Bandwidth Calculator — Link Capacity & Throughput",
    "Convert and reason about network bandwidth for planning. Educational tool — validate with monitoring in production.",
    ["bandwidth calculator", "Mbps to MB/s", "network capacity planning"],
  ),
  "it-download-time-calculator": article(
    "it-download-time-calculator",
    "Download time calculator",
    [
      "Divides file size by download speed to estimate completion time, optionally applying efficiency factors.",
      "TCP slow start, server limits, and Wi‑Fi contention stretch real downloads beyond simple arithmetic.",
    ],
    {
      question: "Why are downloads slower than speed tests?",
      answer:
        "Speed tests use ideal conditions. Remote server rate limits, distance, and concurrent users reduce sustained download Mbps.",
    },
    "Download Time Calculator — File Size ÷ Speed",
    "Estimate how long a download takes from size and link speed. Planning aid — measure end-to-end for SLAs.",
    ["download time calculator", "how long to download", "file download estimate"],
  ),
  "it-upload-time-calculator": article(
    "it-upload-time-calculator",
    "Upload time calculator",
    [
      "Estimates upload duration from payload size and upstream bandwidth — often the bottleneck on consumer links.",
      "Asymmetric connections and bufferbloat make uploads less predictable than headline download speeds.",
    ],
    {
      question: "Is upload speed the same as download?",
      answer:
        "Usually not on broadband. Use your measured upload Mbps, which is often a fraction of download capacity.",
    },
    "Upload Time Calculator — Payload Size ÷ Upload Speed",
    "Estimate upload duration for backups and media pushes. Educational IT tool — test upstream on your network.",
    ["upload time calculator", "upload speed estimate", "backup upload duration"],
  ),
  "it-storage-cost-calculator": article(
    "it-storage-cost-calculator",
    "Storage cost calculator",
    [
      "Multiplies stored gigabytes by unit rate and retention period for rough cloud or on-prem cost views.",
      "Tiering, requests, egress, and minimum duration charges dominate real bills — extend beyond GB × price.",
    ],
    {
      question: "Does cloud storage cost only per GB?",
      answer:
        "No. API requests, retrieval fees, replication, and egress often exceed raw storage GB charges.",
    },
    "Storage Cost Calculator — GB × Rate × Retention",
    "Rough monthly storage cost from capacity and rate assumptions. Budgeting aid — use vendor calculators for quotes.",
    ["storage cost calculator", "cloud storage pricing estimate", "GB month cost"],
  ),
  "it-backup-size-estimator": article(
    "it-backup-size-estimator",
    "Backup size estimator",
    [
      "Projects backup footprint from source data volume, change rates, and retention generations.",
      "Deduplication, incremental chains, and compression change stored bytes versus source size significantly.",
    ],
    {
      question: "Is backup size equal to source data?",
      answer:
        "First full backup may match source. Incrementals, versions, and off-site copies multiply stored bytes over time.",
    },
    "Backup Size Estimator — Retention & Change Rate",
    "Estimate backup storage from data volume and retention policy. Planning aid — pilot with your backup product.",
    ["backup size estimator", "backup storage planning", "retention size calculator"],
  ),
  "it-compression-ratio-calculator": article(
    "it-compression-ratio-calculator",
    "Compression ratio calculator",
    [
      "Compares uncompressed size to compressed output to express ratio or space savings percentage.",
      "Content type (text, video, already-compressed files) drives ratios — generic defaults are teaching values only.",
    ],
    {
      question: "What is a good compression ratio?",
      answer:
        "Text and logs often compress 3–10×. JPEG, MP4, and gzip payloads may barely shrink — measure on representative samples.",
    },
    "Compression Ratio Calculator — Space Savings Estimate",
    "Calculate compression ratio from before/after sizes. Educational IT tool — benchmark on your actual datasets.",
    ["compression ratio calculator", "space savings percentage", "compress size estimate"],
  ),
};
