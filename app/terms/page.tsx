import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/LegalPageShell";

const url = "https://mywebcalculator.com/terms";
const LAST_UPDATED = "2026-04-06";

export const metadata: Metadata = {
  title: "Terms of service",
  description:
    "Terms of service for mywebcalculator.com: acceptable use, disclaimers, intellectual property, and limitations of liability.",
  openGraph: {
    title: "Terms of service | mywebcalculator",
    description: "Rules and conditions for using mywebcalculator.",
    url,
  },
};

export default function TermsPage() {
  return (
    <LegalPageShell
      title="Terms of service"
      lastUpdated={LAST_UPDATED}
      intro={
        <p>
          <strong>Summary:</strong> These terms govern your use of mywebcalculator.com. By using the
          site, you agree to them. The calculators are provided &quot;as is&quot; for general
          information — not professional advice. Replace this page with counsel-reviewed text before
          relying on it legally.
        </p>
      }
      related={[
        { href: "/privacy", label: "Privacy policy" },
        { href: "/disclaimer", label: "Disclaimer" },
        { href: "/cookies", label: "Cookie policy" },
      ]}
    >
      <h2>1. Agreement</h2>
      <p>
        By accessing or using <Link href="/">mywebcalculator.com</Link> (&quot;Site&quot;), you
        agree to these Terms of Service (&quot;Terms&quot;). If you do not agree, do not use the
        Site.
      </p>
      <h2>2. Changes</h2>
      <p>
        We may update these Terms or the Site at any time. The &quot;Last updated&quot; date above
        will change when we do. Continued use after changes means you accept the revised Terms.
      </p>
      <h2>3. Use of the Site</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Site in any unlawful way or in violation of applicable regulations</li>
        <li>Attempt to disrupt, overload, or compromise the Site or its infrastructure</li>
        <li>Scrape or harvest data in a way that harms performance or violates others&apos; rights</li>
        <li>Misrepresent affiliation with mywebcalculator or impersonate others</li>
      </ul>
      <h2>4. Calculators and content</h2>
      <p>
        All calculators, text, graphics, and software on the Site are provided for general
        information and convenience. Results depend on your inputs and simplifying assumptions. See
        our <Link href="/disclaimer">Disclaimer</Link>.
      </p>
      <h2>5. Intellectual property</h2>
      <p>
        Unless otherwise noted, content and branding on the Site are owned by or licensed to
        mywebcalculator and protected by applicable intellectual property laws. You may not copy,
        modify, or redistribute our materials for commercial use without prior written permission.
      </p>
      <h2>6. Third-party links</h2>
      <p>
        The Site may reference or link to third-party sites. We are not responsible for their
        content, policies, or practices.
      </p>
      <h2>7. Disclaimer of warranties</h2>
      <p>
        THE SITE AND ALL CONTENT ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot;
        WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR
        A PARTICULAR PURPOSE, AND NON-INFRINGEMENT, TO THE FULLEST EXTENT PERMITTED BY LAW.
      </p>
      <h2>8. Limitation of liability</h2>
      <p>
        TO THE FULLEST EXTENT PERMITTED BY LAW, MYWEBCALCULATOR AND ITS OPERATORS WILL NOT BE LIABLE
        FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF
        PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE SITE OR RELIANCE ON CALCULATOR
        OUTPUTS.
      </p>
      <h2>9. Privacy</h2>
      <p>
        Our collection and use of information is described in the{" "}
        <Link href="/privacy">Privacy policy</Link> and <Link href="/cookies">Cookie policy</Link>.
      </p>
      <h2>10. Governing law</h2>
      <p>
        <strong>[Placeholder]</strong> Specify the jurisdiction and venue that apply to disputes
        (e.g. courts in your country/state). Consult an attorney to align this with your entity and
        users.
      </p>
      <h2>11. Contact</h2>
      <p>
        For questions about these Terms, visit <Link href="/contact">Contact</Link>.
      </p>
    </LegalPageShell>
  );
}
