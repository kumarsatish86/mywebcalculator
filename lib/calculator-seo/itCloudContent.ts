import type { RichArticle } from "./types";

const HUB_HREF = "/engineering/it-dev/it-cloud-devops";
const HUB_LABEL = "Engineering · IT/Dev · Cloud and DevOps calculators";
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
        title: "Cloud and DevOps tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Cloud cost (multi-vendor)", "Compute + storage + egress rollup"],
          ["EC2 instance cost", "Hours × instance rate"],
          ["Kubernetes resources", "CPU/memory requests & limits"],
          ["Pod resource estimator", "Workload → pod sizing"],
          ["Docker resources", "Container CPU/RAM planning"],
          ["Container size", "Image layers & disk footprint"],
          ["CI/CD pipeline time", "Stages × duration estimate"],
          ["Server cost", "CapEx vs cloud monthly compare"],
          ["Uptime SLA %", "Allowed downtime per period"],
          ["Auto-scaling cost", "Scale-out events × unit cost"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your cloud planning inputs. Educational IT aid only — confirm pricing with vendor calculators and FinOps.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const IT_CLOUD_ARTICLES: Record<string, RichArticle> = {
  "it-cloud-cost-calculator-aws-azure-gcp-style": article(
    "it-cloud-cost-calculator-aws-azure-gcp-style",
    "Cloud cost calculator (AWS/Azure/GCP style)",
    [
      "Rolls up compute, storage, and egress line items using teaching rates styled after major cloud pricing models.",
      "Reserved instances, savings plans, spot, and enterprise discounts change totals — use official pricing APIs for bids.",
    ],
    {
      question: "Why is my bill higher than this estimate?",
      answer:
        "Data transfer, NAT gateways, support tiers, and idle resources add cost. Tagging and Cost Explorer reveal surprises.",
    },
    "Cloud Cost Calculator — AWS, Azure & GCP Style Estimate",
    "Rough monthly cloud spend from compute, storage, and egress assumptions. Budgeting aid — use vendor pricing tools.",
    ["cloud cost calculator", "aws azure gcp estimate", "cloud monthly cost"],
  ),
  "it-ec2-instance-cost-calculator": article(
    "it-ec2-instance-cost-calculator",
    "EC2 instance cost calculator",
    [
      "Multiplies instance hourly rate by running hours for on-demand teaching estimates of a single VM footprint.",
      "EBS volumes, elastic IPs, load balancers, and data transfer are separate line items on real AWS bills.",
    ],
    {
      question: "On-demand vs reserved — which to model?",
      answer:
        "Steady workloads benefit from 1–3 year commitments (RI/Savings Plans). Model on-demand for bursty or unknown lifetimes.",
    },
    "EC2 Instance Cost Calculator — Hours × On-Demand Rate",
    "Estimate EC2 spend from instance type and uptime. Educational FinOps aid — add storage and network costs.",
    ["ec2 cost calculator", "aws instance pricing", "ec2 monthly estimate"],
  ),
  "it-kubernetes-resource-calculator": article(
    "it-kubernetes-resource-calculator",
    "Kubernetes resource calculator",
    [
      "Aggregates pod CPU and memory requests/limits across a namespace or cluster for capacity literacy.",
      "Overcommit ratios, daemonsets, and system reservations reduce schedulable capacity below node totals.",
    ],
    {
      question: "Requests vs limits — which drives scheduling?",
      answer:
        "Scheduler uses requests. Limits cap burst usage; setting limits without requests causes unpredictable placement.",
    },
    "Kubernetes Resource Calculator — CPU & Memory Totals",
    "Sum Kubernetes CPU/memory requests for cluster planning. Educational aid — validate with metrics-server data.",
    ["kubernetes resource calculator", "k8s cpu memory requests", "pod resource sum"],
  ),
  "it-pod-resource-estimator": article(
    "it-pod-resource-estimator",
    "Pod resource estimator",
    [
      "Maps workload profile (web, batch, JVM) to suggested pod CPU and memory requests for initial sizing discussions.",
      "Always right-size from production metrics — JVM heap, buffers, and sidecars need headroom beyond app guesses.",
    ],
    {
      question: "How much memory headroom for JVM pods?",
      answer:
        "Heap + metaspace + native + container overhead — often 1.25–1.5× heap target. Profile GC and OOM events to tune.",
    },
    "Pod Resource Estimator — CPU & Memory Sizing",
    "Suggest initial pod CPU/memory from workload type assumptions. Planning aid — tune with VPA or observability.",
    ["pod resource estimator", "kubernetes pod sizing", "k8s memory requests"],
  ),
  "it-docker-resource-calculator": article(
    "it-docker-resource-calculator",
    "Docker resource calculator",
    [
      "Plans CPU shares and memory caps for containers on a single host before orchestrator scheduling.",
      "cgroups v2, swap behavior, and kernel memory are platform-specific — test limits under load on target OS.",
    ],
    {
      question: "Do Docker limits guarantee isolation?",
      answer:
        "They cap resource use but noisy neighbors still contend on disk and network. Orchestrators add placement rules for isolation.",
    },
    "Docker Resource Calculator — CPU & Memory Limits",
    "Plan container CPU and memory constraints for single-host runs. Educational tool — load-test before production.",
    ["docker resource calculator", "container cpu memory limits", "docker sizing"],
  ),
  "it-container-size-calculator": article(
    "it-container-size-calculator",
    "Container size calculator",
    [
      "Estimates image disk footprint from base layer, dependencies, and app artifact sizes for registry and pull-time planning.",
      "Multi-stage builds and distroless bases shrink images — layer caching affects CI time more than single-node disk.",
    ],
    {
      question: "Why do large images matter?",
      answer:
        "Slow pulls delay scale-out and deployments. Smaller images reduce attack surface and registry storage cost.",
    },
    "Container Size Calculator — Image Layer Footprint",
    "Estimate container image size from layer assumptions. DevOps literacy aid — measure with docker images.",
    ["container size calculator", "docker image size estimate", "image layer footprint"],
  ),
  "it-cicd-pipeline-time-estimator": article(
    "it-cicd-pipeline-time-estimator",
    "CI/CD pipeline time estimator",
    [
      "Sums stage durations (lint, test, build, deploy) for rough pipeline wall-clock and developer wait time modeling.",
      "Parallel jobs, cache hits, and flaky retries swing totals — track p50/p95 from CI analytics.",
    ],
    {
      question: "How can I shorten pipeline time?",
      answer:
        "Cache dependencies, parallelize independent jobs, shrink test suites with smart selection, and use faster runners.",
    },
    "CI/CD Pipeline Time Estimator — Stage Duration Sum",
    "Estimate total CI/CD pipeline duration from stage assumptions. Planning aid — optimize slowest stages first.",
    ["cicd pipeline time estimator", "ci pipeline duration", "build time calculator"],
  ),
  "it-server-cost-calculator": article(
    "it-server-cost-calculator",
    "Server cost calculator",
    [
      "Compares monthly cloud VM cost to amortized on-prem hardware for teaching build-vs-buy conversations.",
      "Staffing, power, cooling, rack space, and spare parts belong in TCO — not just hardware purchase price.",
    ],
    {
      question: "Is cloud always cheaper?",
      answer:
        "Not at steady scale with efficient ops. Cloud wins on elasticity and opex; owned gear can win at predictable high utilization.",
    },
    "Server Cost Calculator — Cloud vs On-Prem TCO Lite",
    "Compare cloud VM monthly cost to amortized server hardware. Educational TCO aid — include ops and power.",
    ["server cost calculator", "cloud vs on prem cost", "server tco estimate"],
  ),
  "it-uptime-calculator-sla-percent": article(
    "it-uptime-calculator-sla-percent",
    "Uptime calculator (SLA %)",
    [
      "Converts SLA percentage (e.g. 99.9%) to allowed downtime minutes per month/year for error budget discussions.",
      "Composite SLAs multiply availability — three nines on each tier in series reduces end-to-end uptime.",
    ],
    {
      question: "How much downtime is 99.9%?",
      answer:
        "About 43 minutes per month or 8.76 hours per year of allowed unavailability, excluding planned maintenance if carved out.",
    },
    "Uptime Calculator — SLA % to Allowed Downtime",
    "Convert SLA uptime percentage to downtime minutes per period. SRE literacy tool — define maintenance windows separately.",
    ["uptime calculator sla", "99.9 uptime downtime", "sla error budget minutes"],
  ),
  "it-autoscaling-cost-estimator": article(
    "it-autoscaling-cost-estimator",
    "Auto-scaling cost estimator",
    [
      "Models extra instance-hours from scale-out events during traffic spikes for FinOps what-if scenarios.",
      "Scale-to-zero, warm pools, and spot instances change unit economics — align model with your ASG policy.",
    ],
    {
      question: "Does autoscaling always save money?",
      answer:
        "It matches capacity to demand but rapid oscillation (flapping) wastes money. Cooldowns and predictive scaling help stability.",
    },
    "Auto-scaling Cost Estimator — Spike Instance-Hours",
    "Estimate cost of scale-out events during traffic peaks. Planning aid — combine with load testing metrics.",
    ["autoscaling cost estimator", "aws autoscale cost", "scale out pricing estimate"],
  ),
};
