/** Curated NL intents → calculator slugs + journeys (no LLM). */

export type IntentId =
  | "buy_home"
  | "emi"
  | "gst"
  | "bmi"
  | "age"
  | "retirement"
  | "salary"
  | "investment"
  | "aws_cost"
  | "kubernetes"
  | "docker"
  | "ai_gpu"
  | "exam_strategy"
  | "lightning_protection"
  | "daily_interest";

export type IntentDefinition = {
  id: IntentId;
  label: string;
  /** Phrases / tokens that boost this intent */
  phrases: string[];
  /** Calculator slugs to suggest (must exist in registry when possible) */
  slugs: string[];
  /** Optional journey to promote */
  journeyId?: string;
  reason: string;
};

export const SEARCH_EXAMPLE_CHIPS: { label: string; query: string }[] = [
  { label: "EMI", query: "EMI loan payment" },
  { label: "GST", query: "GST calculator" },
  { label: "BMI", query: "BMI body mass" },
  { label: "Age", query: "age calculator" },
  { label: "Retirement", query: "retirement planning" },
  { label: "Salary", query: "salary after tax India" },
  { label: "Investment", query: "SIP investment" },
  { label: "AWS Cost", query: "AWS cloud cost" },
  { label: "Kubernetes", query: "Kubernetes resources" },
  { label: "Docker", query: "Docker memory" },
  { label: "AI GPU Cost", query: "GPU cloud cost" },
  { label: "Exam Strategy", query: "exam strategy negative marking" },
  { label: "Lightning LPS", query: "lightning protection earthing" },
  { label: "Daily interest", query: "daily interest loan delay prepay" },
];

export const INTENT_CATALOG: IntentDefinition[] = [
  {
    id: "buy_home",
    label: "Buying a home",
    phrases: [
      "buy house",
      "buy a house",
      "buy home",
      "home loan",
      "mortgage",
      "60 lakh",
      "70 lakh",
      "lakh house",
      "property",
      "flat",
      "apartment",
      "stamp duty",
      "down payment",
      "eligibility",
    ],
    slugs: [
      "home-loan-eligibility-calculator",
      "loan-emi-calculator",
      "loan-payment",
      "mortgage-calculator",
      "down-payment-calculator",
      "gst-plus-loan-calculator-india",
      "home-loan-emi-calculator-india",
      "salary-budget-planner",
    ],
    journeyId: "buying-home",
    reason: "Home purchase path: eligibility, EMI, down payment, tax/GST context, and budget.",
  },
  {
    id: "emi",
    label: "EMI & loan payment",
    phrases: ["emi", "loan payment", "monthly installment", "amortization", "reducing balance"],
    slugs: [
      "loan-payment",
      "loan-emi-calculator",
      "emi-calculator-universal",
      "loan-amortization-calculator",
      "home-loan-emi-calculator-india",
    ],
    reason: "Core EMI and amortizing loan payment tools.",
  },
  {
    id: "gst",
    label: "GST & tax",
    phrases: ["gst", "goods and services tax", "vat", "sales tax", "invoice tax"],
    slugs: ["shop-gst-calculator", "shop-vat-calculator", "shop-sales-tax-calculator", "bizfin-gst-calculator-india"],
    reason: "GST and related tax calculators.",
  },
  {
    id: "bmi",
    label: "BMI & body",
    phrases: ["bmi", "body mass", "ideal weight", "body fat", "weight"],
    slugs: [
      "body-bmi-calculator",
      "body-ideal-body-weight-calculator",
      "body-fat-percentage-calculator",
      "diet-tdee-calculator",
      "diet-daily-calorie-needs-calculator",
      "diet-daily-water-intake-calculator",
      "diet-protein-intake-calculator",
    ],
    reason: "BMI plus related body and nutrition tools.",
  },
  {
    id: "age",
    label: "Age & dates",
    phrases: ["age", "how old", "birthday", "days between", "date difference"],
    slugs: [
      "tdate-age-calculator",
      "tdate-exact-age-calculator",
      "tdate-date-difference-calculator",
      "tdate-next-birthday-calculator",
    ],
    reason: "Age and calendar date tools.",
  },
  {
    id: "retirement",
    label: "Retirement",
    phrases: ["retirement", "retire", "pension", "corpus", "nest egg"],
    slugs: [
      "retirement-calculator",
      "inflation-impact-on-retirement-calculator",
      "aigen-retirement-plan-generator",
      "sip-calculator",
    ],
    reason: "Retirement corpus and related planning tools.",
  },
  {
    id: "salary",
    label: "Salary & income",
    phrases: ["salary", "in-hand", "ctc", "paycheck", "take home", "income tax"],
    slugs: [
      "salary-calculator-monthly-annual",
      "salary-calculator-india-full-breakdown",
      "salary-after-tax-calculator",
      "salary-breakup-calculator-india",
      "hr-in-hand-salary-calculator",
    ],
    reason: "Salary, CTC, and take-home pay tools.",
  },
  {
    id: "investment",
    label: "Investment & SIP",
    phrases: ["sip", "investment", "mutual fund", "compound interest", "portfolio", "lumpsum"],
    slugs: [
      "sip-calculator",
      "compound-interest",
      "compound-interest-calculator",
      "sip-vs-lumpsum-calculator",
      "goal-sip-calculator",
    ],
    reason: "SIP, compound growth, and investment planners.",
  },
  {
    id: "aws_cost",
    label: "Cloud / AWS cost",
    phrases: ["aws", "azure", "gcp", "cloud cost", "ec2", "cloud bill"],
    slugs: ["it-cloud-cost-calculator-aws-azure-gcp-style"],
    reason: "Cloud cost estimation (AWS/Azure/GCP style).",
  },
  {
    id: "kubernetes",
    label: "Kubernetes resources",
    phrases: ["kubernetes", "k8s", "pods", "cluster resources"],
    slugs: ["it-kubernetes-resource-calculator"],
    reason: "Kubernetes resource sizing.",
  },
  {
    id: "docker",
    label: "Docker resources",
    phrases: ["docker", "container memory", "container cpu"],
    slugs: ["it-docker-resource-calculator"],
    reason: "Docker container resource estimates.",
  },
  {
    id: "ai_gpu",
    label: "AI / GPU cost",
    phrases: ["gpu", "ai cost", "ml training", "inference cost", "cuda"],
    slugs: ["it-cloud-cost-calculator-aws-azure-gcp-style", "it-kubernetes-resource-calculator"],
    reason: "GPU/cloud cost and resource helpers for AI workloads.",
  },
  {
    id: "exam_strategy",
    label: "Exam strategy",
    phrases: [
      "exam strategy",
      "attempt strategy",
      "negative marking",
      "time allocation",
      "jee",
      "neet",
      "mock test",
      "rank predictor",
      "finish only",
      "70% paper",
      "exam prep",
    ],
    slugs: [
      "exam-strategy-planner",
      "question-attempt-strategy-calculator",
      "time-allocation-calculator-per-section",
      "optimal-attempt-calculator",
      "negative-marking-calculator",
      "speed-vs-accuracy-calculator",
      "mock-test-performance-calculator",
      "rank-predictor-calculator",
    ],
    journeyId: "exam-prep",
    reason: "Exam Success Center: strategy planner, timing, accuracy, and rank tools.",
  },
  {
    id: "lightning_protection",
    label: "Lightning protection",
    phrases: [
      "lightning protection",
      "lightning rod",
      "lps",
      "air terminal",
      "earthing",
      "grounding resistance",
      "iec 62305",
      "nfpa 780",
      "is 2309",
      "protection radius",
    ],
    slugs: [
      "elec-lightning-protection-calculator",
      "elec-earthing-resistance-calculator",
      "elec-earthing-grounding-calculator",
      "elec-cable-size-calculator",
      "elec-voltage-drop-calculator",
      "elec-short-circuit-current-calculator",
    ],
    journeyId: "electrical-protection",
    reason: "Lightning LPS study workspace and electrical protection toolkit.",
  },
  {
    id: "daily_interest",
    label: "Daily loan interest",
    phrases: [
      "daily interest",
      "interest per day",
      "how much interest daily",
      "delay emi cost",
      "loan delay interest",
      "prepay interest save",
      "actual 365",
      "apr per day",
      "outstanding interest daily",
    ],
    slugs: [
      "daily-interest-calculator",
      "monthly-interest-calculator",
      "outstanding-balance-calculator",
      "loan-prepayment-savings-calculator",
      "loan-foreclosure-calculator",
      "loan-payment",
      "loan-emi-calculator",
    ],
    journeyId: "loan-daily-interest",
    reason: "Daily interest Decision Workspace, delay/prepay sketches, and loan interest toolkit.",
  },
];
