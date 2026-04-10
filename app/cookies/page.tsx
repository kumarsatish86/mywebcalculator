import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/LegalPageShell";

const url = "https://mywebcalculator.com/cookies";
const LAST_UPDATED = "2026-04-06";

export const metadata: Metadata = {
  title: "Cookie policy",
  description:
    "Cookie policy for mywebcalculator.com: what cookies and similar technologies may be used and how to manage them.",
  openGraph: {
    title: "Cookie policy | mywebcalculator",
    description: "Cookies and similar technologies on mywebcalculator.",
    url,
  },
};

export default function CookiesPage() {
  return (
    <LegalPageShell
      title="Cookie policy"
      lastUpdated={LAST_UPDATED}
      intro={
        <p>
          This policy explains how <Link href="/">mywebcalculator.com</Link> may use cookies and
          similar technologies. Calculator logic runs in your browser; cookies are mainly relevant
          if we or our vendors set them for preferences, security, or analytics.{" "}
          <strong>Update this page to match your actual deployment.</strong>
        </p>
      }
      related={[
        { href: "/privacy", label: "Privacy policy" },
        { href: "/terms", label: "Terms of service" },
      ]}
    >
      <h2>1. What are cookies?</h2>
      <p>
        Cookies are small text files stored on your device. Similar technologies include local
        storage, session storage, and pixels. They can be &quot;first-party&quot; (set by us) or
        &quot;third-party&quot; (set by tools we embed).
      </p>
      <h2>2. How we use cookies</h2>
      <p>We may use cookies and similar technologies for:</p>
      <ul>
        <li>
          <strong>Strictly necessary</strong> — e.g. security, load balancing, or basic Site
          functionality (often exempt from consent in some regions).
        </li>
        <li>
          <strong>Preferences</strong> — remember choices such as theme or language if we add those
          features.
        </li>
        <li>
          <strong>Analytics</strong> — understand aggregate traffic and performance if enabled.
        </li>
        <li>
          <strong>Marketing</strong> — only if we add advertising or remarketing in the future.
        </li>
      </ul>
      <h2>3. Current status</h2>
      <p>
        <strong>[Placeholder]</strong> List the specific cookies or scripts you deploy (name,
        provider, purpose, duration). If you use none beyond essential hosting cookies, say so
        clearly.
      </p>
      <h2>4. Managing cookies</h2>
      <p>
        You can block or delete cookies through your browser settings. If we add a consent banner,
        link it here and describe how to change preferences.
      </p>
      <h2>5. More detail</h2>
      <p>
        For how we process personal data more broadly, see the{" "}
        <Link href="/privacy">Privacy policy</Link>.
      </p>
    </LegalPageShell>
  );
}
