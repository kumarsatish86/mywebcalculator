import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["framer-motion", "recharts"],
  },
  /**
   * Windows dev: corrupted webpack pack / flight manifests often surface as
   * `JSON.parse` at a large character offset and 500s on unrelated routes.
   * Disabling the persistent webpack cache in dev avoids bad reads from `.next/cache/webpack`.
   */
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
  async redirects() {
    return [
      {
        source: "/education/mathematics-calculator",
        destination: "/education/mathematics",
        permanent: true,
      },
      {
        source: "/education/physics-calculator",
        destination: "/education/science",
        permanent: true,
      },
      {
        source: "/education/chemistry-calculator",
        destination: "/education/science",
        permanent: true,
      },
      {
        source: "/education/biology-calculator",
        destination: "/education/science",
        permanent: true,
      },
      {
        source: "/education/exam-score-calculator",
        destination: "/education/exam-score",
        permanent: true,
      },
      {
        source: "/health/body_metrics/:path*",
        destination: "/health/body-metrics/:path*",
        permanent: true,
      },
      {
        source: "/finance/loans_emi/:path*",
        destination: "/finance/loans-emi/:path*",
        permanent: true,
      },
      {
        source: "/engineering/electrical/electrical_basic",
        destination: "/engineering/electrical/electrical-basic",
        permanent: true,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");
export default withNextIntl(nextConfig);
