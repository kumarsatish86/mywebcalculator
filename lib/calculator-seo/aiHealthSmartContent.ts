import type { RichArticle } from "./types";

const HUB_HREF = "/ai/smart-tools/aist-health-fitness";
const HUB_LABEL = "AI · Health & Fitness Smart Tools";
const SHELL =
  "Rule-based logic in your browser—not a live LLM. General wellness education only; not medical advice. Consult a professional before changing diet, exercise, or sleep.";

function article(
  slug: string,
  heading: string,
  paragraph: string,
  seoTitle: string,
  seoDescription: string,
  keywords: string[],
): RichArticle {
  return {
    slug,
    vertical: "health-body",
    category: "ai",
    shellNote: SHELL,
    sections: [{ heading, paragraphs: [paragraph] }],
    tables: [{ title: "Quick tip", columnHeaders: ["Topic", "Note"], rows: [["Privacy", "Inputs stay on your device"], ["Safety", "See a doctor for personalised medical guidance"]] }],
    chart: { kind: "sparkTrendDemo", title: "Plan → track → adjust", caption: "Iterate inputs as your routine evolves.", sparkValues: [0.3, 0.5, 0.75, 1] },
    faq: [{ question: "Is this medical advice?", answer: "No—educational estimates and planning aids only." }],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const AI_HEALTH_SMART_ARTICLES: Record<string, RichArticle> = {
  "aist-ai-fitness-planner": article("aist-ai-fitness-planner", "AI Fitness Planner", "TDEE, macros, weekly minutes, and day-by-day training split from your stats.", "AI Fitness Planner — TDEE & Training Plan", "Plan fitness goals with calorie targets and weekly structure.", ["ai fitness planner", "tdee calculator"]),
  "aist-ai-weight-loss-strategy-tool": article("aist-ai-weight-loss-strategy-tool", "Weight Loss Strategy", "Sustainable deficit, weekly pace, milestones, and projection path.", "AI Weight Loss Strategy Tool", "Build a sustainable weight loss timeline with deficit insights.", ["weight loss plan", "calorie deficit"]),
  "aist-ai-diet-planner": article("aist-ai-diet-planner", "Diet Planner", "Veg, non-veg, or custom meal templates scaled to your calories.", "AI Diet Planner — Meal Templates", "Generate meal plans for vegetarian, non-veg, or flexible diets.", ["diet planner", "meal plan generator"]),
  "aist-ai-calorie-optimization-tool": article("aist-ai-calorie-optimization-tool", "Calorie Optimization", "BMR, TDEE, and macro split for lose, maintain, or gain.", "AI Calorie Optimization Tool", "Optimize daily calories and macros for your goal.", ["calorie optimizer", "macro calculator"]),
  "aist-ai-workout-generator": article("aist-ai-workout-generator", "Workout Generator", "Focus-area sessions with sets, reps, and progression tips.", "AI Workout Generator — Session Builder", "Generate workouts by focus area, duration, and level.", ["workout generator", "exercise plan"]),
  "aist-ai-muscle-gain-planner": article("aist-ai-muscle-gain-planner", "Muscle Gain Planner", "Lean bulk calories, protein, volume, and periodization phases.", "AI Muscle Gain Planner — Bulk Strategy", "Plan muscle gain with surplus calories and training volume.", ["muscle gain plan", "lean bulk"]),
  "aist-ai-home-workout-planner": article("aist-ai-home-workout-planner", "Home Workout Planner", "Space-aware circuits for bodyweight or home equipment.", "AI Home Workout Planner", "Build home workouts by space and equipment level.", ["home workout plan", "bodyweight workout"]),
  "aist-ai-gym-routine-builder": article("aist-ai-gym-routine-builder", "Gym Routine Builder", "Push-pull-legs, upper-lower, and bro splits with exercise lists.", "AI Gym Routine Builder", "Build a gym program by split type and training days.", ["gym routine builder", "workout split"]),
  "aist-ai-sleep-optimizer": article("aist-ai-sleep-optimizer", "Sleep Optimizer", "Sleep score, duration analysis, and hygiene step path.", "AI Sleep Optimizer — Sleep Score", "Improve sleep with duration and screen-time insights.", ["sleep optimizer", "sleep hygiene"]),
  "aist-ai-stress-analyzer": article("aist-ai-stress-analyzer", "Stress Analyzer", "Multi-factor stress index with ranked stressors and coping tips.", "AI Stress Analyzer — Wellness Score", "Analyze stress across work, health, social, and finance.", ["stress analyzer", "stress score"]),
  "aist-ai-daily-habit-planner": article("aist-ai-daily-habit-planner", "Daily Habit Planner", "Time-blocked habit stack from wake with smart suggestions.", "AI Daily Habit Planner", "Plan daily habits with time blocks and stacking tips.", ["habit planner", "daily routine builder"]),
};
