import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["framer-motion", "recharts"],
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
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");
export default withNextIntl(nextConfig);
