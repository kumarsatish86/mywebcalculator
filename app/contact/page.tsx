import type { Metadata } from "next";
import { LegalPageShell } from "@/components/LegalPageShell";
import { SITE_CONTACT_EMAIL, SITE_URL } from "@/lib/site-footer";

const url = "https://mywebcalculator.com/contact";

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Get in touch with mywebcalculator: email, site link, and what to expect when you reach out.",
  openGraph: {
    title: "Contact us | mywebcalculator",
    description: "Reach the mywebcalculator team by email.",
    url,
  },
};

export default function ContactPage() {
  const mailHref = `mailto:${SITE_CONTACT_EMAIL}?subject=${encodeURIComponent("mywebcalculator inquiry")}`;

  return (
    <LegalPageShell
      title="Contact us"
      intro={
        <p>
          We welcome feedback, bug reports, and ideas for new calculators. This site is operated as a
          small project — responses may be infrequent.
        </p>
      }
      related={[
        { href: "/about", label: "About us" },
        { href: "/privacy", label: "Privacy policy" },
        { href: "/accessibility", label: "Accessibility" },
      ]}
    >
      <h2>Email</h2>
      <p>
        <a href={mailHref}>{SITE_CONTACT_EMAIL}</a>
      </p>
      <p>
        Please avoid sending sensitive personal data. We do not provide individualized financial,
        legal, or academic counseling by email.
      </p>
      <h2>Website</h2>
      <p>
        <a href={SITE_URL}>{SITE_URL.replace(/^https:\/\//, "")}</a>
      </p>
      <h2>What to include</h2>
      <ul>
        <li>Which calculator and page URL you are using</li>
        <li>What you expected vs. what you saw (screenshots help)</li>
        <li>Your browser and device, if reporting a display bug</li>
      </ul>
    </LegalPageShell>
  );
}
