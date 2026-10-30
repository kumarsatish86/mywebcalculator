/** Education & study template generators — in-browser drafts, not live LLMs. */
import { draftOk, numOr, str, type AigenInput, type AigenResult } from "./aigenHelpers";

export type AigenEducationSlug =
  | "aigen-study-plan-generator"
  | "aigen-timetable-generator"
  | "aigen-revision-plan-generator"
  | "aigen-exam-strategy-generator"
  | "aigen-notes-generator"
  | "aigen-flashcards-generator"
  | "aigen-quiz-generator"
  | "aigen-mcq-generator"
  | "aigen-practice-question-generator"
  | "aigen-concept-explanation-generator";

export const AIGEN_EDUCATION_SLUGS: AigenEducationSlug[] = [
  "aigen-study-plan-generator",
  "aigen-timetable-generator",
  "aigen-revision-plan-generator",
  "aigen-exam-strategy-generator",
  "aigen-notes-generator",
  "aigen-flashcards-generator",
  "aigen-quiz-generator",
  "aigen-mcq-generator",
  "aigen-practice-question-generator",
  "aigen-concept-explanation-generator",
];

export function computeAigenEducation(slug: AigenEducationSlug, input: AigenInput): AigenResult {
  const topic = str(input.topic, "your subject");
  const level = str(input.level, "intermediate");
  const days = Math.max(1, Math.round(numOr(input.days, 14)));
  const hours = Math.max(0.5, numOr(input.hours, 2));
  const audience = str(input.audience, "students");

  switch (slug) {
    case "aigen-study-plan-generator":
      return draftOk([
        `Study plan — ${topic}`,
        `Level: ${level} · Horizon: ${days} days · ~${hours} h/day`,
        `Day 1–${Math.max(1, Math.floor(days / 4))}: Map syllabus + gather materials`,
        `Next block: Core concepts for ${topic} (active recall)`,
        "Mid block: Mixed practice + weak-area drills",
        "Final days: Full mocks + error log review",
        `Daily: ${hours}h focus + 10-min summary notes`,
        `For ${audience}: protect one rest half-day weekly`,
      ]);
    case "aigen-timetable-generator":
      return draftOk([
        `Weekly timetable — ${topic}`,
        `Daily study window: ~${hours} hours`,
        "Mon: Theory block + examples",
        "Tue: Practice set A",
        "Wed: Weak-topic repair",
        "Thu: Practice set B / past papers",
        "Fri: Teach-back (explain aloud)",
        "Sat: Mixed revision",
        "Sun: Light review + plan next week",
      ]);
    case "aigen-revision-plan-generator":
      return draftOk([
        `Revision plan — ${topic} (${days} days)`,
        "Pass 1: Skim all chapters; mark red/amber/green",
        "Pass 2: Re-learn red topics with short notes",
        "Pass 3: Spaced recall (day 1, 3, 7)",
        "Pass 4: Timed questions only",
        `Last 48h: Formula sheet + sleep priority for ${audience}`,
        "Do not open new chapters in the final 24h",
      ]);
    case "aigen-exam-strategy-generator":
      return draftOk([
        `Exam strategy — ${topic}`,
        `Level: ${level}`,
        "Before: Sleep, materials checklist, arrive early",
        "First 5 min: Scan paper; mark easy wins",
        "Timebox: allocate minutes per section; leave buffer",
        "Order: Easy → medium → hard",
        "If stuck 2 min: flag and move on",
        "Last 10 min: Recheck calculations / MCQ bubbles",
      ]);
    case "aigen-notes-generator":
      return draftOk([
        `Notes outline — ${topic}`,
        `Audience: ${audience} · Level: ${level}`,
        "1. Definition / big idea (1–2 lines)",
        "2. Why it matters / where used",
        "3. Key terms glossary (5 words)",
        "4. Worked example",
        "5. Common mistakes",
        "6. Mini summary in your own words",
      ]);
    case "aigen-flashcards-generator":
      return draftOk([
        `Flashcards — ${topic}`,
        "Card 1 Q: What is the core definition?",
        `Card 1 A: One-sentence definition of ${topic}.`,
        "Card 2 Q: Name two applications.",
        "Card 2 A: List two real uses.",
        "Card 3 Q: What is a common misconception?",
        "Card 3 A: State myth + correction.",
        "Card 4 Q: Formula / rule of thumb?",
        "Study tip: shuffle; say answers aloud.",
      ]);
    case "aigen-quiz-generator":
      return draftOk([
        `Quiz draft — ${topic}`,
        `Level: ${level}`,
        `Q1: Explain ${topic} in your own words.`,
        "Q2: Give one real-world example.",
        "Q3: What happens if a key assumption fails?",
        "Q4: Compare ${topic} to a related idea.",
        "Q5: Solve a short applied problem.",
        "Self-score: 1 point each; review misses same day.",
      ]);
    case "aigen-mcq-generator":
      return draftOk([
        `MCQ set — ${topic}`,
        `Q1. Which best describes ${topic}?`,
        "   A) Distractor  B) Correct idea  C) Partial  D) Unrelated",
        "Q2. A common pitfall is…",
        "   A) …  B) …  C) …  D) …",
        "Q3. Best next step when stuck is…",
        "Answer key placeholder: Q1-B · verify your own key",
        "Tip: write why wrong options fail.",
      ]);
    case "aigen-practice-question-generator":
      return draftOk([
        `Practice questions — ${topic}`,
        `For ${audience} at ${level} level`,
        `1. Warm-up: Define ${topic} and list 3 keywords.`,
        "2. Apply: Work a standard textbook-style problem.",
        "3. Stretch: Combine two ideas in one multi-step question.",
        "4. Reflect: What took longest? Why?",
        `Aim: ${hours}h focused practice with a timer.`,
      ]);
    case "aigen-concept-explanation-generator":
      return draftOk([
        `Concept explainer — ${topic}`,
        `Level: ${level} · Audience: ${audience}`,
        `Plain English: ${topic} is about [core idea in one line].`,
        "Analogy: Compare it to something everyday.",
        "Steps: Break the idea into 3 numbered moves.",
        "Example: Walk through a tiny case.",
        "Check: Ask a yes/no comprehension question.",
        "Next: One practice task to lock it in.",
      ]);
    default:
      return { ok: false, error: "Unknown education generator." };
  }
}
