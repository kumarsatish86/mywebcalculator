import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "./globals.css";
import { JsonLdOrganization } from "@/components/JsonLdOrganization";
import { MainLayout } from "@/components/MainLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://mywebcalculator.com";

const themeInitScript = `
(() => {
  try {
    const stored = localStorage.getItem("mwc-theme");
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.dataset.theme = stored === "light" || stored === "dark" ? stored : preferred;
  } catch {
    document.documentElement.dataset.theme = "light";
  }
})();
`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "mywebcalculator — study, finance & fun calculators",
    template: "%s | mywebcalculator",
  },
  description:
    "Highly polished, animated calculator hub for study, finance, and fun — GPA, loans, compound interest, tips, dates, and more at mywebcalculator.com.",
  keywords: [
    "calculator",
    "GPA calculator",
    "loan calculator",
    "compound interest",
    "tip calculator",
    "study tools",
  ],
  authors: [{ name: "mywebcalculator" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "mywebcalculator",
    title: "mywebcalculator — calculators for study, finance & fun",
    description:
      "An animated, glassmorphic calculator hub: GPA, finance, dates, and more. Built for mywebcalculator.com.",
  },
  twitter: {
    card: "summary_large_image",
    title: "mywebcalculator",
    description: "Study, finance, and fun calculators with premium motion and clarity.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-sans antialiased">
        <Script
          id="mwc-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <NextIntlClientProvider locale="en" messages={messages}>
          <JsonLdOrganization />
          <MainLayout>{children}</MainLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
