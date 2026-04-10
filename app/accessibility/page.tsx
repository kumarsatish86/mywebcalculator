import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/LegalPageShell";

const url = "https://mywebcalculator.com/accessibility";
const LAST_UPDATED = "2026-04-06";

export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "Accessibility statement for mywebcalculator.com: our commitment to inclusive design and how to report issues.",
  openGraph: {
    title: "Accessibility | mywebcalculator",
    description: "Accessibility information and contact for mywebcalculator.",
    url,
  },
};

export default function AccessibilityPage() {
  return (
    <LegalPageShell
      title="Accessibility statement"
      lastUpdated={LAST_UPDATED}
      intro={
        <p>
          We want mywebcalculator to be usable by as many people as possible, including those who
          rely on assistive technology or keyboard navigation. We are continually improving.
        </p>
      }
      related={[
        { href: "/contact", label: "Contact us (report barriers)" },
        { href: "/about", label: "About us" },
      ]}
    >
      <h2>Our commitment</h2>
      <p>
        We aim to follow the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA where
        feasible for our interface: sufficient contrast for body text, visible focus indicators,
        semantic headings, and meaningful link text. We also respect{" "}
        <code className="rounded bg-[var(--input-bg)] px-1.5 py-0.5 text-sm text-[var(--text)]">
          prefers-reduced-motion
        </code>{" "}
        for decorative animation.
      </p>
      <h2>Known limitations</h2>
      <p>
        Some third-party assets or future features may not meet every criterion. Complex custom
        controls can be challenging across all browser and assistive technology combinations. If
        something blocks you from completing a task, tell us using{" "}
        <Link href="/contact">Contact</Link>.
      </p>
      <h2>Feedback</h2>
      <p>
        Please include the page URL, a short description of the issue, and your browser / assistive
        technology if you can. We cannot guarantee fixes on a set timeline but we take reports
        seriously.
      </p>
      <h2>Formal compliance</h2>
      <p>
        <strong>[Placeholder]</strong> If you must reference a specific legal framework (e.g. ADA,
        Section 508, EAA), add accurate statements here with legal review.
      </p>
    </LegalPageShell>
  );
}
