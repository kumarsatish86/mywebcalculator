import {
  CALCULATOR_CATEGORIES,
  getCategoryHub,
  getSection,
  getSubcategories,
  getSubcategory,
  getSubcategorySections,
} from "@/lib/category-tree";
import type { CalculatorCategory } from "@/lib/types";
import type { CalculatorFaqItem } from "@/lib/types";
import { getByCategory, getBySubcategory } from "@/lib/registry";
import type { HubPageRichContent, HubRelatedLink } from "./types";

/** One extra sentence per pillar so category intros feel less interchangeable. */
const CATEGORY_INTRO_ACCENT: Partial<Record<CalculatorCategory, string>> = {
  finance:
    "Whether you are comparing loans, investments, or salary scenarios, we keep the math transparent and label what is still on the roadmap.",
  education:
    "Students and educators can browse exam, mathematics, and science-related tools in one structured hub.",
  health:
    "Wellness topics here are for general learning—never a substitute for individualized care from a licensed clinician.",
  engineering:
    "Electrical, civil, and developer-oriented calculators support study and rough estimates, not stamped construction or wiring designs.",
  daily:
    "Home, shopping, and travel helpers focus on practical estimates and clear regional caveats where costs vary.",
  conversion:
    "Units, currencies, and calendar math are presented with honest rounding limits and separate pages for date logic versus duration units.",
  business:
    "Finance ratios, marketing metrics, and HR-style planners sit together for small teams that want quick, labeled arithmetic.",
  ai:
    "Smart and generator-style tools are assistive first—always verify outputs, especially before financial or compliance decisions.",
};

function defaultFaqs(category: CalculatorCategory): CalculatorFaqItem[] {
  const adviceFaq: CalculatorFaqItem =
    category === "health"
      ? {
          question: "Are health calculators a substitute for seeing a clinician?",
          answer:
            "No. They are for general education only—not diagnosis or treatment. Medical hub pages include additional disclaimers where appropriate.",
        }
      : {
          question: "Is this professional advice?",
          answer:
            "No. Outputs are educational. For legal, tax, HR, investment, or medical decisions, rely on a qualified professional and official sources.",
        };

  return [
    {
      question: 'What does "planned" mean next to a calculator?',
      answer:
        "It is on our public roadmap. We show the name so you can explore the catalog; the interactive page may not exist until we ship that tool.",
    },
    adviceFaq,
    {
      question: "Where are Terms, Privacy, and Disclaimer?",
      answer:
        "See mywebcalculator.com/terms, mywebcalculator.com/privacy, and mywebcalculator.com/disclaimer for how we provide the service and handle information.",
    },
  ];
}

export function buildCategoryDefaults(category: CalculatorCategory): HubPageRichContent {
  const hub = getCategoryHub(category);
  const live = getByCategory(category);
  const subs = getSubcategories(category);

  const accent = CATEGORY_INTRO_ACCENT[category];
  const p1 = `${hub.title} is a main calculator hub on mywebcalculator. ${hub.hubSubtitle} We combine tools you can use today with a clear roadmap of planned calculators.${accent ? ` ${accent}` : ""}`;
  const p2 = `This page organizes ${subs.length} sub-topics—including ${subs
    .slice(0, 3)
    .map((s) => s.title)
    .join(", ")}${subs.length > 3 ? ", and more" : ""}. ${
    live.length > 0
      ? `${live.length} live ${live.length === 1 ? "calculator" : "calculators"} in this category already link to full pages with inputs and explanations.`
      : "Live calculators in this category will appear in the lists below as we publish them."
  }`;
  const p3 =
    "Jump into a sub-topic for deeper sections, or use the site navigation to explore other categories. Treat any result as a learning aid—especially when money, health, or compliance is involved.";

  const bulletCap = 8;
  const bulletPoints =
    subs.length > 0
      ? subs.slice(0, bulletCap).map((s) => `${s.title} — ${s.description}`)
      : undefined;

  const relatedLinks: HubRelatedLink[] = CALCULATOR_CATEGORIES.filter((c) => c !== category).map(
    (c) => ({
      href: getCategoryHub(c).path,
      label: getCategoryHub(c).title,
    }),
  );

  const metaDescriptionOverride = `${hub.metaDescription} Browse ${subs.length} sub-topics and ${live.length} live ${live.length === 1 ? "tool" : "tools"}.`;

  return {
    introParagraphs: [p1, p2, p3],
    secondaryHeading: subs.length > 0 ? "What you will find in this hub" : undefined,
    bulletPoints,
    faqs: defaultFaqs(category),
    relatedLinks,
    metaDescriptionOverride,
  };
}

export function buildSubcategoryDefaults(
  category: CalculatorCategory,
  subSlug: string,
): HubPageRichContent {
  const hub = getCategoryHub(category);
  const sub = getSubcategory(category, subSlug);
  if (!sub) {
    throw new Error(`Unknown subcategory: ${category}/${subSlug}`);
  }
  const sections = getSubcategorySections(category, subSlug);
  const liveItems = getBySubcategory(category, subSlug);

  const p1 = `${sub.title} is part of our ${hub.title} hub. ${sub.description}`;
  const p2 =
    sections.length > 0
      ? `We split this topic into ${sections.length} section ${sections.length === 1 ? "page" : "pages"}—each lists focused calculators (many are planned on the roadmap). ${
          liveItems.length > 0
            ? `${liveItems.length} live ${liveItems.length === 1 ? "tool is" : "tools are"} listed on this page when available.`
            : "Open a section to browse what we are building next."
        }`
      : liveItems.length > 0
        ? `${liveItems.length} live ${liveItems.length === 1 ? "calculator" : "calculators"} ${liveItems.length === 1 ? "is" : "are"} available below with full pages.`
        : "Interactive tools for this topic are on the way—check back as we add more.";

  const p3 = `Return to the ${hub.title} overview anytime to find related calculators outside ${sub.title}.`;

  const siblings = getSubcategories(category).filter((s) => s.slug !== subSlug);
  const relatedLinks: HubRelatedLink[] = [
    { href: hub.path, label: `All ${hub.title}` },
    ...siblings.map((s) => ({ href: `${hub.path}/${s.slug}`, label: s.title })),
  ];

  const metaDescriptionOverride = `${sub.description} Part of ${hub.title} on mywebcalculator (${sections.length} sections, ${liveItems.length} live).`;

  return {
    introParagraphs: [p1, p2, p3],
    secondaryHeading: sections.length > 0 ? "Sections in this topic" : undefined,
    bulletPoints:
      sections.length > 0
        ? sections.map((sec) => `${sec.title} (${sec.calculators.length} planned)`)
        : undefined,
    faqs: defaultFaqs(category),
    relatedLinks,
    metaDescriptionOverride,
  };
}

export function buildSectionDefaults(
  category: CalculatorCategory,
  subSlug: string,
  sectionSlug: string,
): HubPageRichContent {
  const hub = getCategoryHub(category);
  const sub = getSubcategory(category, subSlug);
  const section = getSection(category, subSlug, sectionSlug);
  if (!sub || !section) {
    throw new Error(`Unknown section: ${category}/${subSlug}/${sectionSlug}`);
  }

  const siblings = getSubcategorySections(category, subSlug);
  const idx = siblings.findIndex((s) => s.slug === sectionSlug);
  const liveItems = getBySubcategory(category, subSlug);
  const previewTitles = section.calculators.slice(0, 6).map((c) => c.title);

  const p1 = `${section.title} lists ${section.calculators.length} calculators we plan under ${sub.title}. ${section.description}`;
  const p2 =
    previewTitles.length > 0
      ? `Examples of planned tools: ${previewTitles.join("; ")}${
          section.calculators.length > previewTitles.length ? "; and more." : "."
        }`
      : "";
  const p3 =
    "These cards are a roadmap preview. When a tool goes live, it will link from this sub-topic hub. Verify important decisions with professionals and primary sources.";

  const introParagraphs = [p1, p2, p3].filter((x) => x.length > 0);

  const relatedLinks: HubRelatedLink[] = [
    { href: `${hub.path}/${sub.slug}`, label: `All ${sub.title}` },
  ];
  if (idx > 0) {
    const prev = siblings[idx - 1];
    relatedLinks.push({
      href: `${hub.path}/${sub.slug}/${prev.slug}`,
      label: `Previous: ${prev.title}`,
    });
  }
  if (idx >= 0 && idx < siblings.length - 1) {
    const next = siblings[idx + 1];
    relatedLinks.push({
      href: `${hub.path}/${sub.slug}/${next.slug}`,
      label: `Next: ${next.title}`,
    });
  }
  if (liveItems.length > 0) {
    relatedLinks.push({
      href: `${hub.path}/${sub.slug}`,
      label: `Live tools on ${sub.title} (${liveItems.length})`,
    });
  }

  const metaDescriptionOverride = `${section.description} ${section.calculators.length} planned calculators in ${sub.title} (${hub.title}).`;

  const bulletCap = 15;
  const bulletPoints: string[] = section.calculators.slice(0, bulletCap).map((c) => c.title);
  const moreCount = section.calculators.length - bulletCap;
  if (moreCount > 0) {
    bulletPoints.push(
      `Plus ${moreCount} more planned tool${moreCount === 1 ? "" : "s"} in this section.`,
    );
  }

  return {
    introParagraphs,
    secondaryHeading: bulletPoints.length > 0 ? "Planned calculators in this section" : undefined,
    bulletPoints: bulletPoints.length > 0 ? bulletPoints : undefined,
    faqs: defaultFaqs(category),
    relatedLinks,
    metaDescriptionOverride,
  };
}
