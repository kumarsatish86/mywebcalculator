import { SITE_CONTACT_EMAIL, SITE_URL } from "@/lib/site-footer";

export function JsonLdOrganization() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "mywebcalculator",
    url: SITE_URL,
    description:
      "Free online calculators for study, finance, and everyday curiosity at mywebcalculator.com.",
    contactPoint: {
      "@type": "ContactPoint",
      email: SITE_CONTACT_EMAIL,
      contactType: "customer support",
      areaServed: "Worldwide",
      availableLanguage: ["English"],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
