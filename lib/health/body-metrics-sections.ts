import type { SectionNode } from "../hub-section-types";

const p = (slug: string, title: string) => ({ slug, title });

export const HEALTH_BODY_METRICS_SECTIONS: SectionNode[] = [
  {
    slug: "core-body-measurements",
    title: "Core body measurement calculators",
    description:
      "Foundational BMI, metabolic rate, composition, and surface-area style estimates for planning—not diagnosis.",
    calculators: [
      p("body-bmi-calculator", "BMI (Body Mass Index) Calculator"),
      p("body-bmr-calculator", "BMR (Basal Metabolic Rate) Calculator"),
      p("body-fat-percentage-calculator", "Body Fat Percentage Calculator"),
      p("body-lean-body-mass-calculator", "Lean Body Mass Calculator"),
      p("body-ideal-body-weight-calculator", "Ideal Body Weight Calculator"),
      p("body-adjusted-body-weight-calculator", "Adjusted Body Weight Calculator"),
      p("body-bsa-calculator", "Body Surface Area (BSA) Calculator"),
    ],
  },
  {
    slug: "advanced-body-composition",
    title: "Advanced body composition calculators",
    description:
      "Fat, muscle, bone, and water partitioning helpers for tracking trends with professional context.",
    calculators: [
      p("body-fat-mass-calculator", "Fat Mass Calculator"),
      p("body-fat-free-mass-calculator", "Fat-Free Mass Calculator"),
      p("body-muscle-mass-calculator", "Muscle Mass Calculator"),
      p("body-skeletal-muscle-mass-calculator", "Skeletal Muscle Mass Calculator"),
      p("body-visceral-fat-calculator", "Visceral Fat Calculator"),
      p("body-subcutaneous-fat-calculator", "Subcutaneous Fat Calculator"),
      p("body-bone-mass-calculator", "Bone Mass Calculator"),
      p("body-total-body-water-calculator", "Water Weight Calculator (Total Body Water)"),
    ],
  },
  {
    slug: "body-proportion-ratios",
    title: "Body proportion and ratio calculators",
    description: "Waist, hip, and shape ratios often used alongside body-composition goals.",
    calculators: [
      p("body-waist-to-hip-ratio-calculator", "Waist-to-Hip Ratio Calculator"),
      p("body-waist-to-height-ratio-calculator", "Waist-to-Height Ratio Calculator"),
      p("body-chest-to-waist-ratio-calculator", "Chest-to-Waist Ratio Calculator"),
      p("body-shoulder-to-waist-ratio-calculator", "Shoulder-to-Waist Ratio Calculator"),
      p("body-shape-calculator-ectomorph-mesomorph-endomorph", "Body Shape Calculator (Ectomorph / Mesomorph / Endomorph)"),
      p("body-golden-ratio-calculator", "Golden Ratio Body Calculator"),
    ],
  },
  {
    slug: "fitness-performance-metrics",
    title: "Fitness and performance metrics",
    description: "Strength, cardio zones, and conditioning proxies for structured training.",
    calculators: [
      p("body-vo2-max-calculator", "VO2 Max Calculator"),
      p("body-one-rep-max-calculator", "One Rep Max (1RM) Calculator"),
      p("body-strength-level-calculator", "Strength Level Calculator"),
      p("body-fitness-age-calculator", "Fitness Age Calculator"),
      p("body-target-heart-rate-calculator", "Target Heart Rate Calculator"),
      p("body-resting-heart-rate-calculator", "Resting Heart Rate Calculator"),
      p("body-cardio-zones-calculator", "Cardio Zones Calculator"),
    ],
  },
  {
    slug: "calorie-metabolism-body-context",
    title: "Calorie and metabolism (body context)",
    description: "Energy needs and macro splits framed around body metrics and activity patterns.",
    calculators: [
      p("body-daily-calorie-needs-tdee-calculator", "Daily Calorie Needs Calculator (TDEE)"),
      p("body-maintenance-calories-calculator", "Maintenance Calories Calculator"),
      p("body-calorie-deficit-calculator", "Calorie Deficit Calculator"),
      p("body-calorie-surplus-calculator", "Calorie Surplus Calculator"),
      p("body-macronutrient-split-calculator", "Macronutrient Calculator (Protein, Carbs, Fat split)"),
      p("body-protein-intake-calculator", "Protein Intake Calculator"),
      p("body-carb-intake-calculator", "Carb Intake Calculator"),
      p("body-fat-intake-calculator", "Fat Intake Calculator"),
    ],
  },
  {
    slug: "gender-age-specific-body-metrics",
    title: "Gender and age specific body metrics",
    description: "Population-specific estimates for women, men, children, and teens.",
    calculators: [
      p("body-body-fat-calculator-women", "Body Fat Calculator for Women"),
      p("body-ideal-weight-women-calculator", "Ideal Weight for Women"),
      p("body-pregnancy-weight-gain-calculator", "Pregnancy Weight Gain Calculator"),
      p("body-body-fat-calculator-men", "Body Fat Calculator for Men"),
      p("body-ideal-weight-men-calculator", "Ideal Weight for Men"),
      p("body-child-bmi-calculator", "Child BMI Calculator"),
      p("body-growth-percentile-calculator", "Growth Percentile Calculator"),
      p("body-teen-ideal-weight-calculator", "Teen Ideal Weight Calculator"),
    ],
  },
  {
    slug: "health-risk-indicators",
    title: "Health risk indicators",
    description: "Screening-style scores for awareness only—always follow up with qualified care.",
    calculators: [
      p("body-obesity-risk-calculator", "Obesity Risk Calculator"),
      p("body-metabolic-age-calculator", "Metabolic Age Calculator"),
      p("body-heart-risk-bmi-fat-calculator", "Heart Risk Calculator (based on BMI + fat)"),
      p("body-diabetes-risk-calculator", "Diabetes Risk Calculator"),
      p("body-health-score-calculator", "Health Score Calculator"),
    ],
  },
  {
    slug: "transformation-goals",
    title: "Transformation and goal-based calculators",
    description: "Timeline and target planning for weight, fat, and muscle change journeys.",
    calculators: [
      p("body-weight-loss-timeline-calculator", "Weight Loss Timeline Calculator"),
      p("body-weight-gain-calculator", "Weight Gain Calculator"),
      p("body-target-body-fat-calculator", "Target Body Fat Calculator"),
      p("body-muscle-gain-calculator", "Muscle Gain Calculator"),
      p("body-transformation-progress-calculator", "Transformation Progress Calculator"),
    ],
  },
  {
    slug: "measurement-converters",
    title: "Measurement converters and trackers",
    description: "Unit conversion and simple tracking helpers that support the metrics above.",
    calculators: [
      p("body-height-converter-cm-ft-in", "Height Converter (cm ↔ ft/inch)"),
      p("body-weight-converter-kg-lbs", "Weight Converter (kg ↔ lbs)"),
      p("body-measurement-tracker", "Body Measurement Tracker"),
    ],
  },
];
