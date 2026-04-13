import createMiddleware from "next-intl/middleware";
import { defineRouting } from "next-intl/routing";

/** English-only, no public locale prefix (`/calculators/...` stays as-is). */
const routing = defineRouting({
  locales: ["en"],
  defaultLocale: "en",
  localePrefix: "never",
});

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
