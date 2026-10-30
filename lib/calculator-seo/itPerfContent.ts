import type { RichArticle } from "./types";

const HUB_HREF = "/engineering/it-dev/it-performance-load";
const HUB_LABEL = "Engineering · IT/Dev · Performance and load calculators";
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
        title: "Performance and load tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Load time", "Assets + latency → page ready"],
          ["Requests per second", "Throughput from concurrency & latency"],
          ["Concurrent users", "Little's law style estimates"],
          ["Throughput", "Work completed per time unit"],
          ["Response time", "Latency percentiles literacy"],
          ["CPU usage", "Utilization from load model"],
          ["Memory usage", "Working set + overhead"],
          ["Disk I/O", "IOPS × block size throughput"],
          ["Cache hit ratio", "Miss rate impact on backend"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your performance inputs. Educational IT aid only — load-test and profile before capacity sign-off.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const IT_PERF_ARTICLES: Record<string, RichArticle> = {
  "it-load-time-calculator": article(
    "it-load-time-calculator",
    "Load time calculator",
    [
      "Estimates page or asset load duration from file sizes, request count, and network latency assumptions.",
      "HTTP/2 multiplexing, CDN edge cache, and critical rendering path optimizations beat naive sum-of-files math.",
    ],
    {
      question: "Why is real load time slower than file size ÷ bandwidth?",
      answer:
        "DNS, TLS, TTFB, sequential JS execution, and main-thread work add delay. Use RUM and Lighthouse on production URLs.",
    },
    "Load Time Calculator — Page & Asset Download Estimate",
    "Estimate web load time from size, requests, and latency. Educational perf aid — measure with RUM tools.",
    ["load time calculator", "page load estimate", "web performance latency"],
  ),
  "it-requests-per-second-calculator": article(
    "it-requests-per-second-calculator",
    "Requests per second calculator",
    [
      "Derives sustainable RPS from concurrent workers and average response time using queueing literacy (Little's law).",
      "Saturation, GC pauses, and DB connection limits cap RPS below theoretical worker ÷ latency.",
    ],
    {
      question: "How do I increase RPS safely?",
      answer:
        "Reduce latency, scale out stateless tiers, optimize hot queries, and cache reads — then load-test to find the new knee.",
    },
    "Requests Per Second Calculator — RPS from Concurrency",
    "Estimate server RPS from concurrency and response time. Capacity planning aid — validate with load tests.",
    ["requests per second calculator", "rps calculator", "throughput concurrency latency"],
  ),
  "it-concurrent-users-calculator": article(
    "it-concurrent-users-calculator",
    "Concurrent users calculator",
    [
      "Translates total active users and think time into approximate concurrent sessions for sizing web tiers.",
      "Peak hours, marketing spikes, and geographic overlap multiply concurrency beyond daily averages.",
    ],
    {
      question: "Concurrent users vs total users?",
      answer:
        "Total users may be millions; concurrent is how many are active at once. Sizing uses peak concurrent with headroom.",
    },
    "Concurrent Users Calculator — Active Session Estimate",
    "Estimate concurrent users from totals and session patterns. Educational load aid — plan for peak traffic.",
    ["concurrent users calculator", "active users estimate", "web concurrency planning"],
  ),
  "it-throughput-calculator": article(
    "it-throughput-calculator",
    "Throughput calculator",
    [
      "Computes work completed per second (transactions, jobs, MB/s) from pipeline stage rates for bottleneck teaching.",
      "Slowest stage limits end-to-end throughput — optimize the critical path, not average stage speed.",
    ],
    {
      question: "What is the system bottleneck?",
      answer:
        "The stage with the lowest sustained rate caps overall throughput. Profile each tier under representative load.",
    },
    "Throughput Calculator — Work Rate & Bottlenecks",
    "Calculate system throughput from stage rates and concurrency. Educational perf tool — find slowest stage in prod.",
    ["throughput calculator", "system throughput estimate", "pipeline bottleneck calculator"],
  ),
  "it-response-time-calculator": article(
    "it-response-time-calculator",
    "Response time calculator",
    [
      "Breaks response time into network, queue, service, and backend components for latency budget discussions.",
      "Tail latency (p99) drives user experience and SLOs — averages hide slow outliers.",
    ],
    {
      question: "Should I optimize average or p99 latency?",
      answer:
        "SLOs usually target percentiles (p95/p99). Optimizing averages alone leaves slow requests that hurt power users.",
    },
    "Response Time Calculator — Latency Budget Breakdown",
    "Decompose response time into network and service components. Educational aid — monitor percentile SLIs.",
    ["response time calculator", "latency budget calculator", "p99 response time"],
  ),
  "it-cpu-usage-calculator": article(
    "it-cpu-usage-calculator",
    "CPU usage calculator",
    [
      "Estimates CPU utilization from offered load and per-request CPU cost for initial autoscaling threshold discussions.",
      "Steal time on VMs, throttling, and multi-thread efficiency change observed utilization versus model.",
    ],
    {
      question: "What CPU target for autoscaling?",
      answer:
        "Common starting points are 60–70% average with headroom for spikes — tune from historical metrics and SLO breaches.",
    },
    "CPU Usage Calculator — Utilization from Load Model",
    "Estimate CPU utilization from request rate and per-op cost. Planning aid — use host metrics in production.",
    ["cpu usage calculator", "cpu utilization estimate", "autoscale cpu threshold"],
  ),
  "it-memory-usage-calculator": article(
    "it-memory-usage-calculator",
    "Memory usage calculator",
    [
      "Projects process memory from object counts, buffer sizes, and framework overhead for leak and sizing literacy.",
      "RSS vs heap, mmap, and container cgroup limits measure different things — align metric with your platform.",
    ],
    {
      question: "Why did OOM kill happen below container limit?",
      answer:
        "Kernel, page cache, and off-heap native memory count toward cgroup limits. JVM and databases need explicit caps.",
    },
    "Memory Usage Calculator — Working Set Estimate",
    "Estimate application memory from object and buffer assumptions. Educational aid — profile heap in production.",
    ["memory usage calculator", "ram usage estimate", "application memory planning"],
  ),
  "it-disk-io-calculator": article(
    "it-disk-io-calculator",
    "Disk I/O calculator",
    [
      "Relates IOPS, block size, and queue depth to achievable MB/s for storage performance literacy.",
      "Random vs sequential IO profiles change effective throughput on HDD vs NVMe — model your access pattern.",
    ],
    {
      question: "IOPS or MB/s — which limits my app?",
      answer:
        "Small random reads stress IOPS; large sequential scans stress bandwidth. Database indexes often hit IOPS first.",
    },
    "Disk I/O Calculator — IOPS × Block Size Throughput",
    "Calculate disk throughput from IOPS and block size assumptions. Capacity aid — benchmark on your volume type.",
    ["disk io calculator", "iops to mbps", "storage throughput estimate"],
  ),
  "it-cache-hit-ratio-calculator": article(
    "it-cache-hit-ratio-calculator",
    "Cache hit ratio calculator",
    [
      "Shows how hit ratio reduces backend load: effective queries = misses = (1 − hit ratio) × total requests.",
      "Stale data, eviction policy, and hot-key skew distort simple ratio models — monitor per-tier cache metrics.",
    ],
    {
      question: "What hit ratio is good enough?",
      answer:
        "Depends on backend cost and freshness needs. 90%+ helps read-heavy APIs; low hit ratio may mean wrong TTL or key design.",
    },
    "Cache Hit Ratio Calculator — Backend Load Reduction",
    "Estimate backend load from cache hit ratio assumptions. Educational perf aid — tune TTL and key strategy.",
    ["cache hit ratio calculator", "cache miss rate impact", "cdn hit ratio planning"],
  ),
};
