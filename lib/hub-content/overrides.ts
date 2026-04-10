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
      "Core loan calculators are the backbone of borrowing math: EMI, interest, tenure, amortization, and comparing flat versus reducing balance schedules.",
      "Each planned tool below will eventually link to a full page with step-by-step context. Until then, use this list to see coverage and browse sibling sections for specialized loan types.",
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
        question: 'Why are these entries marked "planned"?',
        answer:
          "We publish the catalog early. When a calculator ships, you will open it from this sub-topic hub or search.",
      },
    ],
    metaDescriptionOverride:
      "Core loan and EMI calculator roadmap—amortization, tenure, interest, and flat vs reducing comparisons. Educational estimates; confirm with your lender.",
  },
};
