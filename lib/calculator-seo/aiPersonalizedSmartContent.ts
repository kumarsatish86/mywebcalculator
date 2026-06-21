import type { RichArticle } from "./types";

const HUB_HREF = "/ai/smart-tools/aist-personalized-decisions";
const HUB_LABEL = "AI · Personalized Decision Tools";
const SHELL =
  "Rule-based logic in your browser—not a live LLM. Career and income brainstorming only; not professional coaching or financial advice.";

function article(slug: string, heading: string, paragraph: string, seoTitle: string, seoDescription: string, keywords: string[]): RichArticle {
  return {
    slug,
    vertical: "finance-loan",
    category: "ai",
    shellNote: SHELL,
    sections: [{ heading, paragraphs: [paragraph] }],
    tables: [{ title: "Quick tip", columnHeaders: ["Topic", "Note"], rows: [["Privacy", "Inputs stay on your device"], ["Decisions", "Consult professionals for high-stakes choices"]] }],
    chart: { kind: "sparkTrendDemo", title: "Explore → plan → act", caption: "Re-run as your goals evolve.", sparkValues: [0.25, 0.5, 0.75, 1] },
    faq: [{ question: "Is this career coaching?", answer: "No—educational planning aids and brainstorming only." }],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const AI_PERSONALIZED_SMART_ARTICLES: Record<string, RichArticle> = {
  "aist-ai-career-path-advisor": article("aist-ai-career-path-advisor", "Career Path Advisor", "Career fit scoring with phased transition roadmap.", "AI Career Path Advisor", "Plan your career path with fit scoring and milestones.", ["career path planner", "career advisor"]),
  "aist-ai-skill-gap-analyzer": article("aist-ai-skill-gap-analyzer", "Skill Gap Analyzer", "Role readiness and ranked skill gaps with learning phases.", "AI Skill Gap Analyzer", "Identify skill gaps for your target role.", ["skill gap analysis", "upskilling planner"]),
  "aist-ai-side-hustle-finder": article("aist-ai-side-hustle-finder", "Side Hustle Finder", "Ranked side income options by time, capital, and risk.", "AI Side Hustle Finder", "Find side hustles matched to your skills and budget.", ["side hustle ideas", "extra income"]),
  "aist-ai-business-idea-generator": article("aist-ai-business-idea-generator", "Business Idea Generator", "Scored startup ideas with validation checklist.", "AI Business Idea Generator", "Generate and score business ideas for your budget.", ["business idea generator", "startup ideas"]),
  "aist-ai-income-growth-planner": article("aist-ai-income-growth-planner", "Income Growth Planner", "Income goal projection with growth levers and milestones.", "AI Income Growth Planner", "Plan income growth with scenarios and action steps.", ["income growth planner", "salary goal calculator"]),
};
