import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/LegalPageShell";

const url = "https://mywebcalculator.com/privacy";
const LAST_UPDATED = "2026-04-06";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "Privacy policy for mywebcalculator.com: what data may be collected, cookies, analytics, retention, and your choices.",
  openGraph: {
    title: "Privacy policy | mywebcalculator",
    description: "How mywebcalculator handles information and privacy.",
    url,
  },
};

export default function PrivacyPage() {
  return (
    <LegalPageShell
      title="Privacy policy"
      lastUpdated={LAST_UPDATED}
      intro={
        <p>
          <strong>Summary:</strong> mywebcalculator is built to run calculators in your browser. We
          aim to collect minimal data. This policy describes what might be collected (for example if
          you enable analytics or contact us), how we use it, and your rights.{" "}
          <strong>Replace this draft with advice tailored to your jurisdiction and hosting stack.</strong>
        </p>
      }
      related={[
        { href: "/cookies", label: "Cookie policy" },
        { href: "/terms", label: "Terms of service" },
        { href: "/contact", label: "Contact us" },
      ]}
    >
      <h2>1. Who we are</h2>
      <p>
        The Site <Link href="/">mywebcalculator.com</Link> (&quot;we&quot;, &quot;us&quot;) provides
        online calculators and related content. See <Link href="/about">About us</Link> for
        context.
      </p>
      <h2>2. Information you provide</h2>
      <p>We may receive information when you:</p>
      <ul>
        <li>
          <strong>Email us</strong> — your address, message contents, and technical metadata (e.g.
          mail headers).
        </li>
        <li>
          <strong>Use forms</strong> — if we add third-party or embedded forms in the future, their
          providers may process data under their own policies.
        </li>
      </ul>
      <p>
        Calculator inputs and results are processed locally in your browser unless we explicitly
        state otherwise for a specific feature.
      </p>
      <h2>3. Automatically collected information</h2>
      <p>Depending on how the Site is hosted and configured, the following may apply:</p>
      <ul>
        <li>
          <strong>Server and security logs</strong> — e.g. IP address, user agent, timestamps, and
          requested URLs (typical for hosting providers).
        </li>
        <li>
          <strong>Analytics</strong> — if enabled, aggregated usage statistics (pages viewed, device
          type). Disclose the vendor you use (e.g. Plausible, Google Analytics) and how to opt out.
        </li>
        <li>
          <strong>Cookies and similar technologies</strong> — described in our{" "}
          <Link href="/cookies">Cookie policy</Link>.
        </li>
      </ul>
      <h2>4. How we use information</h2>
      <p>We use information to:</p>
      <ul>
        <li>Operate, secure, and improve the Site</li>
        <li>Respond to inquiries when you contact us</li>
        <li>Comply with legal obligations</li>
      </ul>
      <h2>5. Legal bases (if GDPR/UK GDPR applies)</h2>
      <p>
        <strong>[Placeholder]</strong> If you have users in the EEA/UK, specify legal bases
        (contract, legitimate interests, consent) per processing activity with help from counsel.
      </p>
      <h2>6. Sharing</h2>
      <p>
        We do not sell your personal information. We may share data with service providers who
        assist us (e.g. hosting, email, analytics) subject to appropriate safeguards, or when
        required by law.
      </p>
      <h2>7. Retention</h2>
      <p>
        We retain information only as long as needed for the purposes above or as required by law.
        Server logs and analytics retention depend on your providers — document actual periods here.
      </p>
      <h2>8. Security</h2>
      <p>
        We use reasonable measures to protect the Site, but no method of transmission or storage is
        100% secure.
      </p>
      <h2>9. Your rights</h2>
      <p>
        Depending on where you live, you may have rights to access, correct, delete, or restrict
        processing of personal data, or to object or port data. Contact us at{" "}
        <Link href="/contact">Contact</Link>. <strong>[Placeholder]</strong> Add region-specific
        notices (EEA, UK, California CPRA, etc.) as applicable.
      </p>
      <h2>10. Children</h2>
      <p>
        The Site is not directed to children under 13 (or the minimum age in your jurisdiction). We
        do not knowingly collect personal information from children.
      </p>
      <h2>11. International transfers</h2>
      <p>
        <strong>[Placeholder]</strong> If data is processed across borders, describe safeguards
        (e.g. Standard Contractual Clauses).
      </p>
      <h2>12. Changes</h2>
      <p>We may update this policy and will revise the &quot;Last updated&quot; date when we do.</p>
    </LegalPageShell>
  );
}
