import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/physics-kinematics";
const HUB_LABEL = "Education · Physics · Kinematics";
const SHELL =
  "SI units, educational textbook models only. Runs in your browser — not a lab instrument substitute.";

function article(
  slug: string,
  heading: string,
  paragraphs: string[],
  faq: { question: string; answer: string },
  seoTitle: string,
  seoDescription: string,
  keywords: string[],
  chartKind: "sparkTrendDemo" | "none" = "sparkTrendDemo",
): RichArticle {
  return {
    slug,
    vertical: "education-math",
    category: "education",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "Kinematics tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Speed / velocity", "d/t or Δx/t"],
          ["Equations of motion", "Constant a"],
          ["Graphs", "Slope & area"],
          ["Relative / river", "1D vectors"],
          ["Projectiles", "Level ground g"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your SI inputs." }
        : {
            kind: "sparkTrendDemo",
            title: "Motion trend demo",
            caption: "Share URL preserves your SI inputs.",
            sparkValues: [0.15, 0.3, 0.45, 0.6, 0.8, 1],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const PHYSICS_KINEMATICS_ARTICLES: Record<string, RichArticle> = {
  "speed-calculator": article(
    "speed-calculator",
    "Speed calculator",
    [
      "Computes average speed as distance divided by time in metres per second.",
      "Use non-negative distance and positive time for textbook SI problems.",
    ],
    {
      question: "Is speed the same as velocity?",
      answer: "No — speed is a scalar path rate; velocity includes signed displacement direction.",
    },
    "Speed Calculator — Physics (d/t)",
    "Calculate speed from distance and time in SI units for kinematics homework.",
    ["speed calculator physics", "distance over time", "m/s calculator"],
    "sparkTrendDemo",
  ),
  "velocity-calculator": article(
    "velocity-calculator",
    "Velocity calculator",
    [
      "Finds average velocity as displacement over time (signed in 1D).",
      "Negative displacement yields negative velocity for opposite direction.",
    ],
    {
      question: "Can displacement be negative?",
      answer: "Yes — choose a positive axis; opposite travel enters as a negative displacement.",
    },
    "Velocity Calculator — Displacement / Time",
    "Compute average velocity from displacement and time in SI units.",
    ["velocity calculator", "displacement over time", "average velocity"],
    "none",
  ),
  "average-speed-calculator": article(
    "average-speed-calculator",
    "Average speed",
    [
      "Average speed = total path distance ÷ total time for a trip.",
      "Unlike average velocity, it ignores net displacement and direction changes.",
    ],
    {
      question: "What if the trip has multiple legs?",
      answer: "Sum all path lengths for distance and all durations for time, then divide.",
    },
    "Average Speed Calculator — Total Distance / Time",
    "Find average speed from total distance and total time (SI).",
    ["average speed calculator", "total distance time", "trip speed"],
    "sparkTrendDemo",
  ),
  "distance-calculator-physics": article(
    "distance-calculator-physics",
    "Distance from speed",
    [
      "Uses d = v t for constant-speed motion in a straight line.",
      "Enter speed and elapsed time in consistent SI units.",
    ],
    {
      question: "Does this work with acceleration?",
      answer: "Only for constant speed. Use equations of motion when acceleration is nonzero.",
    },
    "Distance Calculator — Physics (v × t)",
    "Calculate distance from constant speed and time in metres.",
    ["distance calculator physics", "speed times time", "d = vt"],
    "none",
  ),
  "time-calculator-physics": article(
    "time-calculator-physics",
    "Time from distance",
    [
      "Solves t = d / v when speed is constant and positive.",
      "Useful for travel-time estimates in introductory kinematics.",
    ],
    {
      question: "Why must speed be positive?",
      answer: "Zero or negative speed cannot define a forward travel time in this model.",
    },
    "Time Calculator — Physics (d / v)",
    "Calculate travel time from distance and constant speed (SI).",
    ["time calculator physics", "distance over speed", "travel time"],
    "sparkTrendDemo",
  ),
  "acceleration-calculator": article(
    "acceleration-calculator",
    "Acceleration calculator",
    [
      "Computes constant acceleration a = (v − u) / t from initial and final velocity.",
      "Positive a means speeding up in the chosen positive direction.",
    ],
    {
      question: "What if time is zero?",
      answer: "Time must be positive — instantaneous jumps are not defined here.",
    },
    "Acceleration Calculator — (v − u) / t",
    "Find constant acceleration from initial velocity, final velocity, and time.",
    ["acceleration calculator", "change in velocity", "a = (v-u)/t"],
    "none",
  ),
  "final-velocity-calculator": article(
    "final-velocity-calculator",
    "Final velocity",
    [
      "Applies v = u + a t for constant acceleration.",
      "Enter initial velocity, acceleration, and elapsed time in SI.",
    ],
    {
      question: "Can acceleration be negative?",
      answer: "Yes — negative a means the velocity decreases along the positive axis.",
    },
    "Final Velocity Calculator — u + at",
    "Calculate final velocity under constant acceleration (SI).",
    ["final velocity calculator", "u + at", "kinematics velocity"],
    "sparkTrendDemo",
  ),
  "initial-velocity-calculator": article(
    "initial-velocity-calculator",
    "Initial velocity",
    [
      "Rearranges to u = v − a t for constant acceleration.",
      "Use when you know the later speed and how long acceleration acted.",
    ],
    {
      question: "Is this the same as launch speed?",
      answer: "In 1D problems, u is the velocity at t = 0 for that segment.",
    },
    "Initial Velocity Calculator — v − at",
    "Solve for initial velocity from final velocity, acceleration, and time.",
    ["initial velocity calculator", "u = v - at", "kinematics"],
    "none",
  ),
  "displacement-equations-of-motion-calculator": article(
    "displacement-equations-of-motion-calculator",
    "Displacement (equations of motion)",
    [
      "Uses s = u t + ½ a t² for constant acceleration from rest or with initial u.",
      "Displacement is signed along your chosen 1D axis.",
    ],
    {
      question: "Is this distance travelled?",
      answer: "It is net displacement. Path length may differ if direction reverses.",
    },
    "Displacement Calculator — Equations of Motion",
    "Compute displacement with s = ut + ½at² in SI units.",
    ["equations of motion calculator", "s = ut + 1/2 at^2", "displacement"],
    "sparkTrendDemo",
  ),
  "free-fall-calculator": article(
    "free-fall-calculator",
    "Free fall",
    [
      "Models fall from rest: distance ½ g t² and speed g t with g ≈ 9.80665 m/s².",
      "Ignores air resistance — ideal textbook free fall.",
    ],
    {
      question: "Does this include air drag?",
      answer: "No — results assume vacuum-like free fall under constant g.",
    },
    "Free Fall Calculator — ½gt²",
    "Estimate free-fall distance and impact speed from time of fall.",
    ["free fall calculator", "falling object", "g = 9.8"],
    "none",
  ),
  "distance-time-graph-calculator": article(
    "distance-time-graph-calculator",
    "Distance–time graph",
    [
      "Estimates average speed between two s–t points as Δs / Δt.",
      "Enter positions and times for the two graph points.",
    ],
    {
      question: "What if times are equal?",
      answer: "Times must differ — a vertical jump on an s–t graph is not allowed here.",
    },
    "Distance-Time Graph Calculator — Slope",
    "Find average speed from two points on a distance–time graph.",
    ["distance time graph", "slope of s-t", "average speed graph"],
    "sparkTrendDemo",
  ),
  "velocity-time-graph-calculator": article(
    "velocity-time-graph-calculator",
    "Velocity–time graph",
    [
      "Displacement equals the trapezoid area under a straight v–t segment.",
      "Acceleration is the slope (v₂ − v₁) / t over that duration.",
    ],
    {
      question: "Does area under the curve include sign?",
      answer: "Yes — velocities below zero contribute negative displacement in 1D.",
    },
    "Velocity-Time Graph Calculator — Area & Slope",
    "Compute displacement and acceleration from a v–t segment.",
    ["velocity time graph", "area under vt", "acceleration slope"],
    "none",
  ),
  "acceleration-time-graph-calculator": article(
    "acceleration-time-graph-calculator",
    "Acceleration–time graph",
    [
      "For constant a, Δv = a t and final v = u + Δv.",
      "Initial u defaults to 0 when left blank.",
    ],
    {
      question: "Is a assumed constant?",
      answer: "Yes — this tool models a single constant-acceleration interval.",
    },
    "Acceleration-Time Graph Calculator — Δv = at",
    "Find velocity change from acceleration and time on an a–t graph.",
    ["acceleration time graph", "delta v = at", "kinematics graph"],
    "sparkTrendDemo",
  ),
  "relative-velocity-calculator": article(
    "relative-velocity-calculator",
    "Relative velocity",
    [
      "Computes 1D relative velocity v_A − v_B along a shared axis.",
      "Choose a positive direction and enter signed speeds.",
    ],
    {
      question: "How do I handle opposite directions?",
      answer: "Assign opposite signs (for example +30 and −10) before subtracting.",
    },
    "Relative Velocity Calculator — 1D",
    "Calculate relative velocity between two objects in one dimension.",
    ["relative velocity calculator", "vA - vB", "1D relative motion"],
    "none",
  ),
  "boat-river-calculator": article(
    "boat-river-calculator",
    "Boat–river",
    [
      "Combines boat speed across the current with river speed for resultant and drift angle.",
      "Assumes perpendicular heading relative to the banks (classic textbook setup).",
    ],
    {
      question: "Is the resultant ground speed?",
      answer: "Yes — hypot(boat, river) is the speed relative to ground in this model.",
    },
    "Boat River Calculator — Resultant & Drift",
    "Find resultant speed and drift angle for a boat crossing a river.",
    ["boat river calculator", "drift angle", "resultant velocity"],
    "sparkTrendDemo",
  ),
  "train-speed-calculator": article(
    "train-speed-calculator",
    "Train speed",
    [
      "Speed to clear a platform ≈ (train length + platform length) / time.",
      "Uses the usual school-problem definition of ‘passing a platform’.",
    ],
    {
      question: "When do I add both lengths?",
      answer: "When the train must fully enter and exit the platform length before it has cleared.",
    },
    "Train Speed Calculator — Platform Clearance",
    "Calculate train speed from lengths and time to clear a platform.",
    ["train speed calculator", "platform length", "train length time"],
    "none",
  ),
  "projectile-range-calculator": article(
    "projectile-range-calculator",
    "Projectile range",
    [
      "Level-ground range R = u² sin(2θ) / g with g ≈ 9.80665 m/s².",
      "Assumes no air resistance and launch/landing at the same height.",
    ],
    {
      question: "Why is 45° often optimal?",
      answer: "On level ground without drag, sin(2θ) peaks at θ = 45°.",
    },
    "Projectile Range Calculator — Level Ground",
    "Compute projectile range from launch speed and angle (SI).",
    ["projectile range calculator", "range formula", "launch angle"],
    "sparkTrendDemo",
  ),
  "time-of-flight-calculator": article(
    "time-of-flight-calculator",
    "Time of flight",
    [
      "Flight time T = 2 u sin θ / g for a level landing site.",
      "Ideal projectile: constant g, no drag.",
    ],
    {
      question: "Does landing height matter?",
      answer: "This formula assumes launch and landing heights are equal.",
    },
    "Time of Flight Calculator — Projectile",
    "Calculate projectile time of flight from speed and launch angle.",
    ["time of flight calculator", "projectile flight time", "2usinθ/g"],
    "none",
  ),
  "maximum-height-projectile-calculator": article(
    "maximum-height-projectile-calculator",
    "Maximum height",
    [
      "Peak height H = u² sin²θ / (2 g) for a level-ground projectile.",
      "Only the vertical component of launch velocity matters for H.",
    ],
    {
      question: "Is maximum height at half the flight time?",
      answer: "Yes for symmetric level-ground trajectories without air resistance.",
    },
    "Maximum Height Projectile Calculator",
    "Find maximum projectile height from launch speed and angle.",
    ["maximum height projectile", "projectile peak height", "usinθ"],
    "sparkTrendDemo",
  ),
  "projectile-angle-calculator": article(
    "projectile-angle-calculator",
    "Projectile angle",
    [
      "Solves the acute launch angle for a desired range: θ = ½ arcsin(R g / u²).",
      "Also reports the complementary angle that yields the same range on level ground.",
    ],
    {
      question: "What if range is too large?",
      answer: "If R g / u² > 1, that range is impossible for the given launch speed.",
    },
    "Projectile Angle Calculator — For Given Range",
    "Find launch angles that achieve a target projectile range.",
    ["projectile angle calculator", "launch angle for range", "complementary angle"],
    "none",
  ),
};
