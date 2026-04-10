import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/LegalPageShell";

const url = "https://mywebcalculator.com/disclaimer";
const LAST_UPDATED = "2026-04-06";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Disclaimer for mywebcalculator.com: calculators are for general information only; not professional advice.",
  openGraph: {
    title: "Disclaimer | mywebcalculator",
    description: "Important limitations on using mywebcalculator tools and content.",
    url,
  },
};

export default function DisclaimerPage() {
  return (
    <LegalPageShell
      title="Disclaimer"
      lastUpdated={LAST_UPDATED}
      intro={
        <p>
          mywebcalculator provides tools and content for <strong>general informational purposes
          only</strong>. Nothing on this Site is professional financial, legal, tax, medical, or
          academic advice.
        </p>
      }
      related={[
        { href: "/terms", label: "Terms of service" },
        { href: "/privacy", label: "Privacy policy" },
        { href: "/about", label: "About us" },
      ]}
    >
      <h2>No professional relationship</h2>
      <p>
        Use of the Site does not create any professional or fiduciary relationship between you and
        mywebcalculator or its operators.
      </p>
      <h2>Calculator results</h2>
      <p>
        Results depend on the accuracy of your inputs and on simplifying assumptions built into each
        tool. Rates, grading scales, institutional rules, and real-world fees may differ. Always
        verify critical numbers with official sources, lenders, schools, or advisors.
      </p>
      <h2>Financial tools</h2>
      <p>
        Loan, interest, and tipping calculators produce estimates. Actual loan terms, APR, fees,
        taxes, and rounding may change outcomes. Do not rely on these tools alone for borrowing,
        investing, or tax decisions.
      </p>
      <h2>Study and GPA tools</h2>
      <p>
        GPA and grade planning tools use common scales and formulas; your school may use different
        weighting, rounding, or policies. Official transcripts and registrars are authoritative.
      </p>
      <h2>Fun and novelty tools</h2>
      <p>
        Tools labeled for curiosity or entertainment (for example &quot;cat years&quot;) are not
        scientific or veterinary advice.
      </p>
      <h2>External links</h2>
      <p>
        Links to third-party sites are for convenience. We do not control and are not responsible
        for their content.
      </p>
      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, mywebcalculator and its operators disclaim
        liability for any loss or damage arising from use of the Site or reliance on any
        calculator output. See also our <Link href="/terms">Terms of service</Link>.
      </p>
    </LegalPageShell>
  );
}
