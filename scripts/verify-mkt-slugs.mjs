import fs from "node:fs";

const src = fs.readFileSync("lib/business/marketing-sections.ts", "utf8");
const live = [...src.matchAll(/live\("([^"]+)"/g)].map((m) => m[1]);
const engines = fs
  .readdirSync("lib/calculators")
  .filter((f) => f.startsWith("mkt") && f.endsWith(".ts") && !f.includes("test") && f !== "mktHelpers.ts");
const engineSlugs = new Set();
for (const f of engines) {
  const t = fs.readFileSync(`lib/calculators/${f}`, "utf8");
  for (const m of t.matchAll(/"(mkt-[a-z0-9-]+)"/g)) engineSlugs.add(m[1]);
}
const missing = live.filter((s) => !engineSlugs.has(s));
const extra = [...engineSlugs].filter((s) => !live.includes(s));
console.log({ live: live.length, engine: engineSlugs.size, missing, extra });

const hosts = fs.readdirSync("components/calculators/family").filter((f) => f.startsWith("Mkt"));
const seo = fs.readdirSync("lib/calculator-seo").filter((f) => f.startsWith("mkt"));
console.log("hosts", hosts.length, hosts);
console.log("seo", seo.length, seo);

// SEO slug coverage
const seoSlugs = new Set();
for (const f of seo) {
  const t = fs.readFileSync(`lib/calculator-seo/${f}`, "utf8");
  for (const m of t.matchAll(/"(mkt-[a-z0-9-]+)": article/g)) seoSlugs.add(m[1]);
}
console.log({
  seoSlugs: seoSlugs.size,
  seoMissing: live.filter((s) => !seoSlugs.has(s)),
});
