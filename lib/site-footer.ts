import { CALCULATOR_CATEGORIES, getCategoryHub } from "@/lib/category-tree";

/** Public contact email shown on Contact and in structured data — update to your real inbox. */
export const SITE_CONTACT_EMAIL = "hello@mywebcalculator.com";

export const SITE_URL = "https://mywebcalculator.com";

export type FooterLink = {
  href: string;
  label: string;
};

export type FooterColumn = {
  title: string;
  links: FooterLink[];
};

const productLinks: FooterLink[] = [
  { href: "/", label: "Home" },
  ...CALCULATOR_CATEGORIES.map((id) => {
    const hub = getCategoryHub(id);
    return { href: hub.path, label: `${hub.title} calculators` } satisfies FooterLink;
  }),
];

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Product",
    links: productLinks,
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/contact", label: "Contact" },
      { href: "/accessibility", label: "Accessibility" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms of service" },
      { href: "/privacy", label: "Privacy policy" },
      { href: "/cookies", label: "Cookie policy" },
      { href: "/disclaimer", label: "Disclaimer" },
    ],
  },
];

/** Paths for sitemap (no leading slash duplication when joining). */
export const MARKETING_AND_LEGAL_PATHS = [
  "/about",
  "/contact",
  "/terms",
  "/privacy",
  "/cookies",
  "/disclaimer",
  "/accessibility",
] as const;
