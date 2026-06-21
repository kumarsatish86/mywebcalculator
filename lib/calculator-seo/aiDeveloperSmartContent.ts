import type { RichArticle } from "./types";

const HUB_HREF = "/ai/smart-tools/aist-developer-tech";
const HUB_LABEL = "AI · Developer & Tech Smart Tools";
const SHELL =
  "Rule-based logic in your browser—not a live LLM. Engineering and security planning aids only; not a substitute for professional audits or architecture review.";

function article(slug: string, heading: string, paragraph: string, seoTitle: string, seoDescription: string, keywords: string[]): RichArticle {
  return {
    slug,
    vertical: "engineering-electrical",
    category: "ai",
    shellNote: SHELL,
    sections: [{ heading, paragraphs: [paragraph] }],
    tables: [{ title: "Quick tip", columnHeaders: ["Topic", "Note"], rows: [["Privacy", "Inputs stay on your device"], ["Decisions", "Validate with your security or platform team"]] }],
    chart: { kind: "sparkTrendDemo", title: "Measure → optimize → track", caption: "Re-run as your stack evolves.", sparkValues: [0.25, 0.5, 0.75, 1] },
    faq: [{ question: "Is this a security audit?", answer: "No—educational estimates and planning aids only." }],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const AI_DEVELOPER_SMART_ARTICLES: Record<string, RichArticle> = {
  "aist-ai-code-complexity-analyzer": article("aist-ai-code-complexity-analyzer", "Code Complexity", "Cyclomatic complexity, nesting, coverage, and refactor debt scoring.", "AI Code Complexity Analyzer", "Analyze code maintainability and complexity hotspots.", ["code complexity", "cyclomatic complexity", "tech debt"]),
  "aist-ai-api-cost-estimator": article("aist-ai-api-cost-estimator", "API Cost Estimator", "Token-based API spend with optimization levers.", "AI API Cost Estimator", "Estimate monthly API and LLM token costs.", ["api cost calculator", "llm token cost"]),
  "aist-ai-cloud-cost-calculator": article("aist-ai-cloud-cost-calculator", "Cloud Cost Calculator", "Compute, storage, and egress breakdown with savings scenarios.", "AI Cloud Cost Calculator", "Calculate and optimize cloud infrastructure costs.", ["cloud cost calculator", "aws cost estimate"]),
  "aist-ai-server-capacity-planner": article("aist-ai-server-capacity-planner", "Server Capacity Planner", "RPS, latency, and headroom-based capacity planning.", "AI Server Capacity Planner", "Plan server capacity for traffic and latency targets.", ["server capacity planning", "rps calculator"]),
  "aist-ai-risk-score-calculator-security": article("aist-ai-risk-score-calculator-security", "Security Risk Score", "Multi-factor posture score from vulns, MFA, and patch cadence.", "AI Security Risk Score Calculator", "Calculate organizational security risk score.", ["security risk score", "cyber risk calculator"]),
  "aist-ai-vulnerability-impact-analyzer": article("aist-ai-vulnerability-impact-analyzer", "Vulnerability Impact", "CVSS, exploitability, and blast radius priority scoring.", "AI Vulnerability Impact Analyzer", "Analyze vulnerability impact and remediation priority.", ["vulnerability impact", "cvss calculator"]),
  "aist-ai-compliance-gap-analyzer": article("aist-ai-compliance-gap-analyzer", "Compliance Gap Analyzer", "SOC 2, GDPR, or ISO 27001 readiness and domain gaps.", "AI Compliance Gap Analyzer", "Identify compliance gaps before your audit.", ["compliance gap analysis", "soc2 readiness"]),
  "aist-ai-security-budget-planner": article("aist-ai-security-budget-planner", "Security Budget Planner", "Revenue-based security spend with category allocation.", "AI Security Budget Planner", "Plan security budget by company size and risk.", ["security budget", "cybersecurity spend"]),
};
