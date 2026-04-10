import type { MetadataRoute } from "next";
import {
  allCategorySectionStaticParams,
  allCategoryStaticParams,
  allSubcategoryStaticParams,
} from "@/lib/category-tree";
import { CALCULATOR_REGISTRY } from "@/lib/registry";
import { MARKETING_AND_LEGAL_PATHS } from "@/lib/site-footer";

const base = "https://mywebcalculator.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  for (const { category } of allCategoryStaticParams()) {
    entries.push({
      url: `${base}/${category}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    });
  }

  for (const { category, subCategory } of allSubcategoryStaticParams()) {
    entries.push({
      url: `${base}/${category}/${subCategory}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.68,
    });
  }

  for (const { category, subCategory, section } of allCategorySectionStaticParams()) {
    entries.push({
      url: `${base}/${category}/${subCategory}/${section}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.62,
    });
  }

  for (const path of MARKETING_AND_LEGAL_PATHS) {
    entries.push({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.55,
    });
  }

  for (const c of CALCULATOR_REGISTRY) {
    entries.push({
      url: `${base}/calculators/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.72,
    });
  }

  return entries;
}
