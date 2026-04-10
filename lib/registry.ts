import type { CalculatorCategory, CalculatorDefinition } from "./types";

export const CALCULATOR_REGISTRY: CalculatorDefinition[] = [
  {
    slug: "weighted-gpa",
    title: "Weighted GPA calculator",
    shortTitle: "Weighted GPA",
    category: "education",
    subCategorySlug: "exam-score",
    description:
      "Compute your semester or cumulative GPA from credit hours and letter grades on a 4.0 scale.",
    longDescription:
      "Use this weighted GPA calculator to combine course credits with letter grades or 4.0-scale points. It is ideal for semester planning and estimating cumulative GPA using a standard A–F scale with plus and minus.",
    keywords: [
      "weighted GPA calculator",
      "GPA calculator",
      "semester GPA",
      "credit hours GPA",
      "4.0 scale",
      "grade point average",
    ],
    faq: [
      {
        question: "What is weighted GPA?",
        answer:
          "Weighted GPA multiplies each course grade (on a scale such as 4.0) by that course’s credit hours, sums those products, and divides by total credits. Heavier courses influence your GPA more than lighter ones.",
      },
      {
        question: "Is this the same scale every school uses?",
        answer:
          "No. Colleges may differ on plus/minus values, A+ above 4.0, pass/fail, or repeated courses. Always confirm with your institution’s registrar or handbook.",
      },
      {
        question: "Can I enter numeric points instead of letters?",
        answer:
          "Yes. Enter a number from 0 to 4 per course if you already know the grade points your school assigns.",
      },
      {
        question: "Does this store my grades?",
        answer:
          "No. Calculations run in your browser; nothing is sent to our servers for this tool.",
      },
    ],
  },
  {
    slug: "grade-needed",
    title: "Grade needed for target GPA",
    shortTitle: "Target GPA",
    category: "education",
    subCategorySlug: "exam-score",
    description:
      "Find the GPA you must earn on upcoming credits to reach your target cumulative GPA.",
    longDescription:
      "Estimate the average GPA you need on future credit hours to hit a cumulative target. Helpful when planning how hard you must perform on remaining courses to reach a goal.",
    keywords: [
      "GPA needed",
      "target GPA calculator",
      "cumulative GPA goal",
      "future GPA required",
      "college GPA planning",
    ],
    faq: [
      {
        question: "How is the needed GPA calculated?",
        answer:
          "We use: (target × total future credits − current GPA × credits earned) ÷ upcoming credits. This is the simple average GPA required on the new credits only, assuming your past GPA stays fixed.",
      },
      {
        question: "What if the tool shows I need above a 4.0?",
        answer:
          "That usually means the target is not reachable on the remaining credits under a 4.0 cap. You may need more credits, a different target, or grade replacement policies your school allows.",
      },
      {
        question: "Are pass/fail or withdrawals included?",
        answer:
          "This model assumes you enter GPA-relevant credits only. Pass/fail and W grades vary by school and are not modeled here.",
      },
      {
        question: "Is this official advice?",
        answer:
          "No. It is a planning estimate. Always verify with your academic advisor or degree audit system.",
      },
    ],
  },
  {
    slug: "exam-grade",
    title: "Exam score needed",
    shortTitle: "Exam score",
    category: "education",
    subCategorySlug: "exam-score",
    description:
      "Given your current average and how much the final counts, see what score you need for your goal.",
    longDescription:
      "Find the exam or final percentage you need to reach a desired course average when you know your current average and the weight of the remaining assessment.",
    keywords: [
      "final exam calculator",
      "grade needed on final",
      "exam score calculator",
      "weighted average final",
      "what do I need on the final",
    ],
    faq: [
      {
        question: "What does “exam weight” mean?",
        answer:
          "It is the share of the final grade the exam represents, as a percent of 100. For example, 30 means the final is 30% of the course grade and the rest is everything else averaged in.",
      },
      {
        question: "Why might I see a score above 100%?",
        answer:
          "That implies reaching your goal on the remaining weight is not possible with a single exam under the numbers you entered—double-check weights and your current average.",
      },
      {
        question: "Does this handle curved courses?",
        answer:
          "No. It assumes a linear weighted average. Curves and drops are not modeled.",
      },
      {
        question: "Are results guaranteed?",
        answer:
          "No. Syllabus rules, rounding, and extra credit can change outcomes. Use this as a planning estimate only.",
      },
    ],
  },
  {
    slug: "loan-payment",
    title: "Loan payment calculator",
    shortTitle: "Loan payment",
    category: "finance",
    subCategorySlug: "loans-emi",
    description:
      "Estimate fixed monthly payments on an amortizing loan from principal, APR, and term.",
    longDescription:
      "Calculate a fixed monthly payment for a standard amortizing loan using principal, annual percentage rate, and term in years. See how much interest you may pay over the life of the loan.",
    keywords: [
      "loan payment calculator",
      "amortization calculator",
      "monthly payment",
      "APR calculator",
      "personal loan estimate",
    ],
    faq: [
      {
        question: "Is this the payment my lender will quote?",
        answer:
          "Maybe not. Lenders add fees, insurance, variable rates, and different day-count conventions. This tool shows a standard fixed-rate amortizing estimate only.",
      },
      {
        question: "What is APR?",
        answer:
          "Annual Percentage Rate is a yearly interest rate for borrowing. Here it is converted to a monthly rate for payment math. It may not include every fee your lender charges.",
      },
      {
        question: "Does this handle extra payments?",
        answer:
          "Not in the default formula. Extra principal payments shorten the loan and change total interest but are not modeled in the basic schedule shown.",
      },
      {
        question: "Is this financial advice?",
        answer:
          "No. It is educational. Consult a qualified professional for borrowing decisions.",
      },
    ],
  },
  {
    slug: "compound-interest",
    title: "Compound interest",
    shortTitle: "Compound interest",
    category: "finance",
    subCategorySlug: "investment-wealth",
    description:
      "Project future balance with compound growth using principal, rate, time, and compounding frequency.",
    longDescription:
      "Project how savings or investments may grow with compound interest over time. Choose how often interest compounds and see future balance and interest earned on a lump sum.",
    keywords: [
      "compound interest calculator",
      "investment growth",
      "future value calculator",
      "APY compounding",
      "savings projection",
    ],
    faq: [
      {
        question: "What does compounding frequency change?",
        answer:
          "More frequent compounding (e.g. monthly vs annually) credits interest more often, so growth can be slightly higher for the same nominal annual rate.",
      },
      {
        question: "Is this the same as APY?",
        answer:
          "APY reflects compounding in one number. This calculator uses a stated annual rate plus an explicit compounding frequency instead of a single APY input.",
      },
      {
        question: "Are taxes or inflation included?",
        answer:
          "No. The chart and numbers are nominal—not adjusted for tax, fees, or inflation.",
      },
      {
        question: "Can I rely on this for investing?",
        answer:
          "Only as a rough illustration. Real products have fees, variable returns, and risk. This is not investment advice.",
      },
    ],
  },
  {
    slug: "tip-splitter",
    title: "Tip & split calculator",
    shortTitle: "Tip & split",
    category: "finance",
    subCategorySlug: "salary-income",
    description:
      "Split a bill with tip fairly across any number of people.",
    longDescription:
      "Calculate tip amount, total with tip, and fair per-person share when splitting a check. Enter the bill, tip percentage, and number of diners for a quick restaurant math helper.",
    keywords: [
      "tip calculator",
      "split bill calculator",
      "restaurant tip",
      "gratuity calculator",
      "divide check",
    ],
    faq: [
      {
        question: "Is tip calculated on the pre-tax amount?",
        answer:
          "This tool uses the bill amount you enter—typically the subtotal before tax if that is what you type. If your group tips on post-tax totals, include tax in the bill field.",
      },
      {
        question: "What about rounding to cash?",
        answer:
          "Displayed amounts are exact splits; real-world cash rounding may differ by a few cents per person.",
      },
      {
        question: "Does it handle separate checks?",
        answer:
          "No. It assumes one shared bill split evenly. Uneven orders need manual adjustment.",
      },
      {
        question: "Is this legal or tax advice?",
        answer:
          "No. It is a simple arithmetic helper for splitting costs.",
      },
    ],
  },
  {
    slug: "days-between",
    title: "Days between dates",
    shortTitle: "Days between",
    category: "conversion",
    subCategorySlug: "time-date",
    description:
      "Count calendar days, weeks, and approximate months between two dates.",
    longDescription:
      "Count the number of calendar days between two dates, plus weeks and approximate months. Useful for countdowns, travel planning, and quick date math.",
    keywords: [
      "days between dates",
      "date difference calculator",
      "countdown days",
      "how many days",
      "calendar calculator",
    ],
    faq: [
      {
        question: "Are the start and end days inclusive?",
        answer:
          "The tool reports the absolute difference in calendar days between the two dates (midnight-based anchor), not inclusive counting unless both dates are the same.",
      },
      {
        question: "How do time zones work?",
        answer:
          "We use a noon UTC anchor on the calendar date you pick to reduce daylight-saving edge cases. For legal deadlines, use an official time-zone-aware tool.",
      },
      {
        question: "Why are months approximate?",
        answer:
          "Months vary in length; we use an average month length for a rough figure only.",
      },
      {
        question: "Can I use this for contracts?",
        answer:
          "Only as informal help. Legal date counting may follow different rules.",
      },
    ],
  },
  {
    slug: "cat-age",
    title: "Cat years calculator",
    shortTitle: "Cat years",
    category: "daily",
    subCategorySlug: "home-utility",
    description:
      "Convert human years to a playful cat-age estimate (not veterinary advice).",
    longDescription:
      "Convert human years to a popular rule-of-thumb “cat years” estimate. Fun for curiosity—cats age differently in real life by breed, health, and care.",
    keywords: [
      "cat years calculator",
      "cat age in human years",
      "how old is my cat",
      "pet age joke",
    ],
    faq: [
      {
        question: "Is this scientifically accurate?",
        answer:
          "No. It applies a simplified piecewise rule often seen online. Real aging is not linear and varies by individual animal.",
      },
      {
        question: "Can I use this for medical decisions?",
        answer:
          "No. Always consult a licensed veterinarian for health and care decisions.",
      },
      {
        question: "Why does the first year count more?",
        answer:
          "The model front-loads maturity to mimic the idea that cats mature quickly in early life compared to humans.",
      },
      {
        question: "What about dogs?",
        answer:
          "Different species need different models. This page is only for the cat-years toy estimate.",
      },
    ],
  },
];

export function getCalculator(slug: string): CalculatorDefinition | undefined {
  return CALCULATOR_REGISTRY.find((c) => c.slug === slug);
}

export function getByCategory(category: CalculatorCategory): CalculatorDefinition[] {
  return CALCULATOR_REGISTRY.filter((c) => c.category === category);
}

export function getBySubcategory(
  category: CalculatorCategory,
  subCategorySlug: string,
): CalculatorDefinition[] {
  return CALCULATOR_REGISTRY.filter(
    (c) => c.category === category && c.subCategorySlug === subCategorySlug,
  );
}

export function getFeaturedSlugs(): string[] {
  return [
    "weighted-gpa",
    "loan-payment",
    "compound-interest",
    "days-between",
  ];
}
