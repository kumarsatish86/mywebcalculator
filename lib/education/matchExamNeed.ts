/** Score exam-need NL queries against Center problems + tools (no LLM). */

import {
  CENTER_PROBLEMS,
  CENTER_TOOLS,
  getToolMeta,
  type CenterProblem,
} from "./examSuccessCenter";

export type ExamNeedSuggestion = {
  slug: string;
  title: string;
  reason: string;
  problemId?: string;
  score: number;
};

function normalize(q: string): string {
  return q
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(q: string): string[] {
  return normalize(q)
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1);
}

function problemScore(q: string, tokens: string[], problem: CenterProblem): number {
  let score = 0;
  for (const phrase of problem.phrases) {
    if (q.includes(phrase)) score += phrase.split(/\s+/).length >= 2 ? 16 : 10;
  }
  for (const t of tokens) {
    for (const phrase of problem.phrases) {
      if (phrase.includes(t)) score += 2;
    }
    if (problem.label.toLowerCase().includes(t)) score += 3;
  }
  return score;
}

/**
 * Match a natural-language exam problem to recommended calculator slugs.
 */
export function matchExamNeed(query: string, limit = 8): ExamNeedSuggestion[] {
  const q = normalize(query);
  if (!q) return [];

  const tokens = tokenize(q);
  const bySlug = new Map<string, ExamNeedSuggestion>();

  const bump = (s: ExamNeedSuggestion) => {
    const prev = bySlug.get(s.slug);
    if (!prev || s.score > prev.score) bySlug.set(s.slug, s);
  };

  for (const problem of CENTER_PROBLEMS) {
    const hit = problemScore(q, tokens, problem);
    if (hit <= 0) continue;
    problem.slugs.forEach((slug, i) => {
      const meta = getToolMeta(slug);
      const title = meta?.title ?? slug;
      bump({
        slug,
        title,
        reason: problem.reason,
        problemId: problem.id,
        score: hit + (problem.slugs.length - i) * 0.5,
      });
    });
  }

  for (const tool of CENTER_TOOLS) {
    const hay = `${tool.title} ${tool.slug.replace(/-/g, " ")}`.toLowerCase();
    let score = 0;
    for (const t of tokens) {
      if (hay.includes(t)) score += t.length >= 4 ? 3 : 2;
    }
    if (score <= 0) continue;
    bump({
      slug: tool.slug,
      title: tool.title,
      reason: "Matched tool name or topic",
      score,
    });
  }

  return [...bySlug.values()].sort((a, b) => b.score - a.score).slice(0, limit);
}

export function suggestionsForProblem(problemId: string): ExamNeedSuggestion[] {
  const problem = CENTER_PROBLEMS.find((p) => p.id === problemId);
  if (!problem) return [];
  return problem.slugs.map((slug, i) => {
    const meta = getToolMeta(slug);
    return {
      slug,
      title: meta?.title ?? slug,
      reason: problem.reason,
      problemId: problem.id,
      score: 100 - i,
    };
  });
}
