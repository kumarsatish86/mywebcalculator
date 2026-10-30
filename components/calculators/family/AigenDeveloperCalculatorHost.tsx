"use client";

import { computeAigenDeveloper, type AigenDeveloperSlug } from "@/lib/calculators/aigenDeveloper";
import { createAigenSectionHost, type AigenHostConfig } from "./createAigenSectionHost";
import { AIGEN_UI_DISCLAIMER } from "./aigenHostShared";

const CONFIG: Record<AigenDeveloperSlug, AigenHostConfig<AigenDeveloperSlug>> = {
  "aigen-json-generator": {
    title: "JSON Generator",
    description: `Sample JSON object template. ${AIGEN_UI_DISCLAIMER}`,
    fields: [{ key: "A", label: "Entity / topic", def: "users" }],
    build: (v) => ({ topic: v.a }),
  },
  "aigen-api-request-generator": {
    title: "API Request Generator",
    description: `Example HTTP request + curl sketch. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Resource name", def: "orders" },
      { key: "N", label: "Limit / count", def: "10" },
    ],
    build: (v) => ({ topic: v.a, count: Number(v.n) || 10 }),
  },
  "aigen-regex-generator": {
    title: "Regex Generator",
    description: `Common regex pattern examples. ${AIGEN_UI_DISCLAIMER}`,
    fields: [{ key: "A", label: "Context", def: "form validation" }],
    build: (v) => ({ topic: v.a }),
  },
  "aigen-sql-query-generator": {
    title: "SQL Query Generator",
    description: `SELECT/INSERT/UPDATE teaching templates. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Table / topic", def: "customers" },
      { key: "N", label: "Limit", def: "20" },
    ],
    build: (v) => ({ topic: v.a, count: Number(v.n) || 20 }),
  },
  "aigen-test-data-generator": {
    title: "Test Data Generator",
    description: `Deterministic fake rows from a seed. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Entity", def: "users" },
      { key: "S", label: "Seed", def: "demo-seed" },
      { key: "N", label: "Rows", def: "5" },
    ],
    build: (v) => ({ topic: v.a, seed: v.s, count: Number(v.n) || 5 }),
  },
  "aigen-password-generator": {
    title: "Password Generator",
    description: `Deterministic password from seed + length. ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "S", label: "Seed", def: "change-me" },
      { key: "L", label: "Length", def: "16" },
    ],
    build: (v) => ({ seed: v.s, length: Number(v.l) || 16 }),
  },
  "aigen-encryption-key-generator": {
    title: "Encryption Key Generator",
    description: `Deterministic hex key material (teaching only). ${AIGEN_UI_DISCLAIMER}`,
    fields: [
      { key: "A", label: "Label", def: "demo-key" },
      { key: "S", label: "Seed", def: "key-seed" },
      { key: "L", label: "Length hint", def: "32" },
    ],
    build: (v) => ({ topic: v.a, seed: v.s, length: Number(v.l) || 32 }),
  },
  "aigen-code-snippet-generator": {
    title: "Code Snippet Generator",
    description: `Function scaffold with TODO core logic. ${AIGEN_UI_DISCLAIMER}`,
    fields: [{ key: "A", label: "Function / topic", def: "Checkout" }],
    build: (v) => ({ topic: v.a }),
  },
};

export const AigenDeveloperCalculatorHost = createAigenSectionHost({
  name: "AigenDeveloperCalculatorHost",
  configs: CONFIG,
  fallback: "aigen-json-generator",
  compute: computeAigenDeveloper,
  idPrefix: "aigen-dev",
});
