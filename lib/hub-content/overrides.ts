import type { HubContentOverride } from "./types";

/**
 * Optional per-route content overrides. Keys: `category`, `category/sub`, or `category/sub/section`.
 * Entries replace the merged field entirely (see resolve.ts). Add more keys as you prioritize SEO.
 */
export const HUB_CONTENT_OVERRIDES: Record<string, HubContentOverride> = {
  finance: {
    introParagraphs: [
      "The Finance hub gathers loans and EMI math, investment and wealth snapshots, salary and tax-style estimates, and banking calculators in one place—each labeled so you know what is live versus on the roadmap.",
      "We publish interactive pages when a tool is ready; planned listings show names and slugs early so you can explore the catalog and request direction. Rates, fees, and tax rules change by country and product—always verify numbers against your lender or advisor.",
      "Whether you are stress-testing a payment, comparing growth scenarios, or splitting a bill, treat outputs as educational. For binding decisions, use official disclosures and licensed professionals.",
    ],
    faqs: [
      {
        question: "Do you store my loan or salary inputs?",
        answer:
          "Live calculators run in the browser for typical tools; we do not describe server-side storage per tool here. Read mywebcalculator.com/privacy for general data practices.",
      },
      {
        question: "Why do some finance calculators say planned?",
        answer:
          "We list roadmap items openly. Planned means the dedicated calculator page is not live yet; the hub still helps you see coverage we intend to ship.",
      },
      {
        question: "Are interest and EMI results binding on my bank?",
        answer:
          "No. Banks apply their own rounding, fees, and schedules. Use our figures for orientation only, then confirm with your institution.",
      },
      {
        question: "Is this investment or tax advice?",
        answer:
          "No. Projections omit your full situation, risk tolerance, and jurisdiction. Consult a qualified advisor or tax professional for personal planning.",
      },
    ],
    metaDescriptionOverride:
      "Finance calculators for loans, EMI, investing, salary, and banking—live tools plus a clear roadmap of planned calculators. Educational use only; not personalized financial advice.",
  },

  health: {
    introParagraphs: [
      "The Health hub covers body metrics, diet and nutrition, and a separate medical-themed catalog. Every page is built for general education, not to replace a clinician, dietitian, or therapist.",
      "Live tools show transparent inputs and limits in copy; planned items preview what we aim to ship. Results vary by person, genetics, medications, and conditions—never use a web calculator to diagnose or change treatment.",
      "Medical sub-pages carry stronger disclaimers. When in doubt, talk to a licensed professional who knows your history.",
    ],
    faqs: [
      {
        question: "Can I use these calculators instead of seeing a doctor?",
        answer:
          "No. They are not medical devices and cannot account for your individual risks. Use them for learning only.",
      },
      {
        question: "What is the difference between medical and other health pages?",
        answer:
          "Medical-themed sections list educational tools only and include explicit disclaimers. Non-medical wellness pages still require professional judgment for personal decisions.",
      },
      {
        question: 'What does "planned" mean here?',
        answer:
          "It is a roadmap label. The interactive calculator may not exist until we publish that tool.",
      },
      {
        question: "Where is your privacy policy?",
        answer: "See mywebcalculator.com/privacy for how we handle information across the site.",
      },
    ],
    metaDescriptionOverride:
      "Health and wellness calculators for education—body metrics, nutrition, and medical-themed roadmaps. Not a substitute for professional care; read disclaimers on each hub.",
  },

  "finance/loans-emi/core-loan-calculators": {
    introParagraphs: [
      "Core loan calculators are the backbone of borrowing math: monthly payment, EMI, interest, tenure, amortization, and comparing flat versus reducing balance schedules.",
      "Open any card below for a full calculator page with FAQs. Specialized loan-type hubs in this category add more focused tools over time.",
      "Lenders apply fees, insurance, and rounding differently—always reconcile with your actual agreement.",
    ],
    faqs: [
      {
        question: "What is reducing balance interest?",
        answer:
          "Interest is charged on the outstanding principal as it shrinks with each payment—common for many retail loans. Flat-rate quotes behave differently; compare carefully.",
      },
      {
        question: "Will EMI match my bank exactly?",
        answer:
          "Small differences come from day-count conventions, rounding, and fees. Treat our numbers as approximations.",
      },
      {
        question: "Are these numbers binding on my lender?",
        answer:
          "No. They are educational estimates. Your loan agreement, statements, and disclosures are authoritative.",
      },
    ],
    metaDescriptionOverride:
      "Live core loan calculators: payment, EMI, implied rate, amount, tenure, total interest, amortization with CSV export, and flat vs reducing comparison. Educational estimates; confirm with your lender.",
  },

  "education/mathematics/basic-math-calculators": {
    introParagraphs: [
      "This section bundles high-traffic student tools: two-number arithmetic, three percentage modes, ratios and proportions, list statistics (average, mean, median, mode, sum), difference, rounding with several tie rules, and expression evaluators (scientific + PEMDAS with steps).",
      "Results run in your browser. They are study aids—not a computer algebra system, not a substitute for showing work on an exam unless your instructor allows calculators, and not guaranteed to match every textbook’s rounding convention.",
      "Share links encode your inputs in the URL when length allows; very large pasted lists may not fit—use copy summary or re-paste locally. For graded work, double-check angle mode (degrees vs radians) on trig and the rounding mode on the rounding tool.",
    ],
    faqs: [
      {
        question: "Are these answers always exact?",
        answer:
          "We use standard floating-point math like most calculators. Very large or tiny numbers can show rounding noise; expression tools format results for readability, not infinite precision.",
      },
      {
        question: "Why might my share link not restore everything?",
        answer:
          "Share state is packed into a single query parameter with a length limit. Short inputs round-trip; oversized payloads are skipped so the page still loads with defaults.",
      },
      {
        question: "Is this the same as Wolfram or a CAS?",
        answer:
          "No. We evaluate the grammar documented on each page (numbers, operators, parentheses, listed functions). We do not simplify symbolic algebra, solve equations generally, or integrate symbolically.",
      },
      {
        question: "Average vs mean on this site?",
        answer:
          "Both calculators compute the arithmetic mean (sum ÷ count). One page is titled for searchers who say “average,” the other for “mean”; use median or mode when you need robust center or frequency instead.",
      },
      {
        question: "What does “banker” rounding mean?",
        answer:
          "Half-to-even (IEEE-style): when a value is exactly halfway between two representable decimals at your precision, it rounds to the neighbor with an even last digit—useful to reduce bias in repeated rounding.",
      },
    ],
    metaDescriptionOverride:
      "Live basic math calculators: arithmetic, percentage (of / is what % / change), ratio, proportion, average & mean, median, mode, sum, difference, rounding (including half-to-even), scientific expressions, and PEMDAS with step-by-step trace. Educational use; verify critical work.",
  },

  "education/exam-score/exam-strategy": {
    introParagraphs: [
      "The Exam Success Center organizes attempt strategy, timing, mocks, and rank tools into guided goals and journeys—not a flat directory of calculators.",
      "Start with the AI Exam Strategy Planner for a rules-based digital twin (score bands, strategies, timeline, study plan), or pick a workflow such as Crack JEE in 90 Days or Fix Negative Marking.",
      "All math is transparent and educational. Confirm official marking schemes and timing with your exam authority before you rely on any plan.",
    ],
    secondaryHeading: "How to use this center",
    bulletPoints: [
      "Choose a goal or describe a problem (“I finish only 70% of the paper”).",
      "Follow Before → During → After → AI Insights stage rails.",
      "Open a workflow journey so the next tool is always clear.",
      "Use exam tabs (JEE, NEET, CAT, …) to filter the toolkit.",
    ],
    faqs: [
      {
        question: "Is the Exam Strategy Planner a live AI model?",
        answer:
          "No. It uses deterministic rules and the same marking math as our other exam tools. Copy may say “AI” for product positioning; numbers come from engines, not an LLM.",
      },
      {
        question: "What is a workflow journey?",
        answer:
          "An ordered checklist of calculators (for example hours → revision → mocks → timing → rank). Open /journeys/… or the Workflow cards on this page.",
      },
      {
        question: "Do you save my exam readiness progress?",
        answer:
          "Readiness bars on this page use anonymous localStorage on your device only. There is no account sync in this version.",
      },
      {
        question: "Are JEE/NEET presets official?",
        answer:
          "Presets are teaching defaults for duration, question count, and marking. Always verify against the current information bulletin for your attempt year.",
      },
    ],
    metaDescriptionOverride:
      "AI Exam Success Center: guided exam strategy workflows, time allocation, negative marking, mock analysis, rank tools, and a rules-based strategy planner. Educational use only.",
  },
};
