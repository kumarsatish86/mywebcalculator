import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/LegalPageShell";

const url = "https://mywebcalculator.com/about";

export const metadata: Metadata = {
  title: "About us",
  description:
    "Learn about mywebcalculator: our mission to offer clear, fast calculators for study, finance, and fun — with privacy-friendly, client-side tools.",
  openGraph: {
    title: "About us | mywebcalculator",
    description: "Who we are and how we build calculator tools for the web.",
    url,
  },
};

export default function AboutPage() {
  return (
    <LegalPageShell
      title="About mywebcalculator"
      intro={
        <p>
          mywebcalculator is an independent project focused on one thing:{" "}
          <strong>helpful calculators that load fast, look great, and respect your time</strong>. We
          cover study, finance, and lighthearted tools — with more on the roadmap.
        </p>
      }
      related={[
        { href: "/disclaimer", label: "Disclaimer (informational use)" },
        { href: "/contact", label: "Contact us" },
        { href: "/privacy", label: "Privacy policy" },
      ]}
    >
      <h2>What we build</h2>
      <p>
        Every calculator runs in your browser. We do not require accounts for the core experience,
        and we design pages so results are easy to read and share.
      </p>
      <h2>Accuracy and limitations</h2>
      <p>
        Outputs are based on standard formulas and the inputs you provide. They are{" "}
        <strong>not</strong> professional financial, legal, academic, or medical advice. Always
        verify important decisions with a qualified professional or your institution&apos;s
        official policies.
      </p>
      <p>
        Read our full <Link href="/disclaimer">disclaimer</Link> for details.
      </p>
      <h2>Contact</h2>
      <p>
        Questions or feedback? Visit <Link href="/contact">Contact</Link> — we read messages when we
        can, but cannot guarantee individual responses.
      </p>
    </LegalPageShell>
  );
}
