import type { RichArticle } from "./types";

const HUB_HREF = "/engineering/it-dev/it-database-data";
const HUB_LABEL = "Engineering · IT/Dev · Database and data calculators";
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
        title: "Database and data tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Query cost", "Scan vs index cost literacy"],
          ["Database size", "Tables + indexes rollup"],
          ["Table size", "Rows × avg row bytes"],
          ["Index size", "Key width × entries overhead"],
          ["Row size", "Column types + null bitmap"],
          ["Data growth", "Compound monthly growth"],
          ["Backup time (DB)", "Size ÷ backup throughput"],
          ["Replication lag", "Apply rate vs write rate"],
          ["Storage IOPS", "Read/write ops capacity plan"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your database planning inputs. Educational IT aid only — validate with EXPLAIN and vendor sizing guides.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const IT_DATABASE_ARTICLES: Record<string, RichArticle> = {
  "it-query-cost-estimator": article(
    "it-query-cost-estimator",
    "Query cost estimator",
    [
      "Rough teaching model of full table scan vs index seek cost from row counts and selectivity assumptions.",
      "Real optimizers use statistics, histograms, and hardware — always run EXPLAIN (ANALYZE) on production-shaped data.",
    ],
    {
      question: "Why did the optimizer ignore my index?",
      answer:
        "Low selectivity, stale stats, functions on indexed columns, or a smaller table scan can make sequential read cheaper.",
    },
    "Query Cost Estimator — Scan vs Index Literacy",
    "Estimate relative query cost from row counts and indexes. Educational DBA aid — trust EXPLAIN in your engine.",
    ["query cost estimator", "index vs scan cost", "sql performance estimate"],
  ),
  "it-database-size-calculator": article(
    "it-database-size-calculator",
    "Database size calculator",
    [
      "Rolls up table and index byte estimates for capacity planning and license tier discussions.",
      "Logs, temp files, bloat, and replication copies add overhead beyond raw data+index sizes.",
    ],
    {
      question: "How often should I recalculate DB size?",
      answer:
        "Track growth monthly or after major releases. Autoscaling storage alerts beat one-time spreadsheet estimates.",
    },
    "Database Size Calculator — Tables & Indexes Rollup",
    "Estimate total database footprint from table and index assumptions. Planning aid — measure with monitoring.",
    ["database size calculator", "db storage estimate", "sql database capacity"],
  ),
  "it-table-size-estimator": article(
    "it-table-size-estimator",
    "Table size estimator",
    [
      "Multiplies row count by average row width plus page overhead for heap storage teaching estimates.",
      "TOAST, compression, and variable-length columns skew averages — sample rows from production exports.",
    ],
    {
      question: "Does VARCHAR always use max length on disk?",
      answer:
        "No. Most engines store actual length plus overhead. Estimates should use measured average lengths, not schema max.",
    },
    "Table Size Estimator — Rows × Average Row Bytes",
    "Estimate table storage from row counts and width assumptions. Educational tool — sample real row sizes.",
    ["table size estimator", "sql table storage", "rows times row size"],
  ),
  "it-index-size-calculator": article(
    "it-index-size-calculator",
    "Index size calculator",
    [
      "Projects B-tree (or similar) index bytes from key width, row count, and fill factor assumptions.",
      "Covering indexes, included columns, and partial indexes change footprint — model each index explicitly.",
    ],
    {
      question: "Do indexes slow writes?",
      answer:
        "Yes — each index must be maintained on insert/update/delete. Size and count of indexes affect write amplification.",
    },
    "Index Size Calculator — Key Width × Entry Overhead",
    "Estimate index storage from key columns and cardinality. Planning aid — review index usage in production.",
    ["index size calculator", "btree index storage", "sql index footprint"],
  ),
  "it-row-size-calculator": article(
    "it-row-size-calculator",
    "Row size calculator",
    [
      "Sums fixed and variable column storage with null bitmap and alignment padding for schema literacy.",
      "Engine-specific types (UUID, JSONB, spatial) carry extra headers — consult your vendor's storage docs.",
    ],
    {
      question: "Why is row size larger than sum of columns?",
      answer:
        "Alignment padding, null bitmaps, row headers, and HOT/overflow pointers add bytes beyond raw column payloads.",
    },
    "Row Size Calculator — Column Types & Padding",
    "Estimate per-row storage from column type assumptions. Educational DBA tool — validate with pg_column_size or equivalents.",
    ["row size calculator", "sql row bytes", "table row width estimate"],
  ),
  "it-data-growth-calculator": article(
    "it-data-growth-calculator",
    "Data growth calculator",
    [
      "Projects future database size from starting volume and monthly growth rate compounded over time.",
      "Seasonality, retention policies, and archival tiers change curves — extend models beyond flat percentage growth.",
    ],
    {
      question: "What growth rate should I assume?",
      answer:
        "Use 3–6 months of measured growth from monitoring. New features can step-change inserts — revisit after launches.",
    },
    "Data Growth Calculator — Compound Storage Projection",
    "Forecast database growth from rate and horizon assumptions. Capacity planning aid — track actual metrics.",
    ["data growth calculator", "database growth forecast", "storage projection sql"],
  ),
  "it-backup-time-calculator-db": article(
    "it-backup-time-calculator-db",
    "Backup time calculator (DB)",
    [
      "Divides database size by backup throughput to estimate full backup duration for maintenance windows.",
      "Incremental chains, compression, deduplication, and cloud egress limits change wall-clock time substantially.",
    ],
    {
      question: "Full vs incremental backup time?",
      answer:
        "Incrementals copy less data but depend on chain integrity. Full backups baseline time; incrementals scale with change rate.",
    },
    "Database Backup Time Calculator — Size ÷ Throughput",
    "Estimate DB backup duration from size and link speed. Planning aid — test with your backup vendor.",
    ["database backup time calculator", "sql backup duration", "backup window estimate"],
  ),
  "it-replication-lag-estimator": article(
    "it-replication-lag-estimator",
    "Replication lag estimator",
    [
      "Compares apply throughput to write rate for teaching when replicas fall behind primary workloads.",
      "Parallel apply, network jitter, large transactions, and DDL events cause nonlinear lag spikes.",
    ],
    {
      question: "How much lag is acceptable?",
      answer:
        "Read-your-writes apps need seconds or less. Analytics replicas may tolerate minutes — define SLOs per use case.",
    },
    "Replication Lag Estimator — Apply Rate vs Write Rate",
    "Reason about replica lag from throughput assumptions. Educational aid — monitor lag metrics in production.",
    ["replication lag estimator", "database replica lag", "mysql postgres lag"],
  ),
  "it-storage-iops-calculator": article(
    "it-storage-iops-calculator",
    "Storage IOPS calculator",
    [
      "Relates required read/write operations per second to disk or cloud volume limits for OLTP planning.",
      "Burst credits, RAID layout, and shared arrays cap sustained IOPS below datasheet peaks.",
    ],
    {
      question: "IOPS vs throughput — which matters?",
      answer:
        "Random small IO workloads need IOPS; sequential large IO needs MB/s. OLTP indexes stress IOPS; analytics stress throughput.",
    },
    "Storage IOPS Calculator — Read/Write Ops Planning",
    "Estimate storage IOPS needs from workload assumptions. Capacity aid — benchmark with your storage tier.",
    ["storage iops calculator", "database iops planning", "disk iops estimate"],
  ),
};
