/** Developer & tech template generators — deterministic snippets, not live LLMs. */
import { draftOk, numOr, seededRand, str, type AigenInput, type AigenResult } from "./aigenHelpers";

export type AigenDeveloperSlug =
  | "aigen-json-generator"
  | "aigen-api-request-generator"
  | "aigen-regex-generator"
  | "aigen-sql-query-generator"
  | "aigen-test-data-generator"
  | "aigen-password-generator"
  | "aigen-encryption-key-generator"
  | "aigen-code-snippet-generator";

export const AIGEN_DEVELOPER_SLUGS: AigenDeveloperSlug[] = [
  "aigen-json-generator",
  "aigen-api-request-generator",
  "aigen-regex-generator",
  "aigen-sql-query-generator",
  "aigen-test-data-generator",
  "aigen-password-generator",
  "aigen-encryption-key-generator",
  "aigen-code-snippet-generator",
];

function passwordFromSeed(seed: string, length: number): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  const rand = seededRand(seed || "default");
  let out = "";
  for (let i = 0; i < length; i++) out += alphabet[Math.floor(rand() * alphabet.length)];
  return out;
}

function hexKeyFromSeed(seed: string, bytes: number): string {
  const rand = seededRand(seed || "key");
  let out = "";
  for (let i = 0; i < bytes; i++) {
    out += Math.floor(rand() * 256)
      .toString(16)
      .padStart(2, "0");
  }
  return out;
}

export function computeAigenDeveloper(slug: AigenDeveloperSlug, input: AigenInput): AigenResult {
  const topic = str(input.topic, "users");
  const seed = str(input.seed, str(input.topic, "seed"));
  const count = Math.max(1, Math.round(numOr(input.count, 3)));
  const length = Math.min(64, Math.max(8, Math.round(numOr(input.length, 16))));

  switch (slug) {
    case "aigen-json-generator":
      return draftOk([
        `JSON template — ${topic}`,
        "{",
        `  "id": "demo-1",`,
        `  "name": "${topic}",`,
        `  "status": "active",`,
        `  "tags": ["sample", "template"],`,
        `  "meta": { "source": "aigen-json-generator" }`,
        "}",
        "Replace fields to match your schema.",
      ]);
    case "aigen-api-request-generator":
      return draftOk([
        `API request example — ${topic}`,
        "POST /api/v1/" + topic.replace(/\s+/g, "-").toLowerCase(),
        "Content-Type: application/json",
        "Authorization: Bearer <token>",
        "",
        `{"name":"${topic}","limit":${count}}`,
        "",
        "curl -X POST \"$BASE/api/v1/...\" -H \"Authorization: Bearer $TOKEN\" -d '{...}'",
      ]);
    case "aigen-regex-generator":
      return draftOk([
        `Regex examples related to — ${topic}`,
        "Email-ish: ^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
        "Digits only: ^\\d+$",
        "Slug: ^[a-z0-9]+(?:-[a-z0-9]+)*$",
        "Whitespace trim edges: ^\\s+|\\s+$",
        `Note: validate ${topic} rules in tests; regex alone is rarely enough.`,
      ]);
    case "aigen-sql-query-generator":
      return draftOk([
        `SQL templates — ${topic}`,
        `SELECT id, name, created_at FROM ${topic.replace(/\s+/g, "_")} WHERE status = 'active' LIMIT ${count};`,
        `INSERT INTO ${topic.replace(/\s+/g, "_")} (name, status) VALUES ('example', 'active');`,
        `UPDATE ${topic.replace(/\s+/g, "_")} SET status = 'archived' WHERE id = 1;`,
        "-- Teaching templates only; never run unchecked SQL in production.",
      ]);
    case "aigen-test-data-generator": {
      const rand = seededRand(seed);
      const lines = [`Test data — ${topic} (seed: ${seed})`];
      for (let i = 1; i <= count; i++) {
        const n = Math.floor(rand() * 9000) + 1000;
        lines.push(`${i}. ${topic}_${n}@example.test · score=${(rand() * 100).toFixed(1)}`);
      }
      lines.push("Deterministic from seed — safe for fixtures, not real PII.");
      return draftOk(lines);
    }
    case "aigen-password-generator": {
      const pwd = passwordFromSeed(seed, length);
      return draftOk(
        [
          `Password (deterministic from seed) — length ${length}`,
          pwd,
          `Seed used: ${seed}`,
          "Same seed + length → same password. Change seed for a new value.",
          "Store secrets in a password manager; this is a teaching generator.",
        ],
        { primary: length },
      );
    }
    case "aigen-encryption-key-generator": {
      const key = hexKeyFromSeed(seed, Math.min(32, Math.max(16, Math.round(length / 2))));
      return draftOk([
        `Hex key material (deterministic) — ${topic}`,
        key,
        `Seed: ${seed}`,
        "Not a certified CSPRNG — demo / teaching only.",
        "Use OS or library CSPRNG for real keys.",
      ]);
    }
    case "aigen-code-snippet-generator":
      return draftOk([
        `Code snippet scaffold — ${topic}`,
        `function handle${topic.replace(/\s+/g, "")}(input) {`,
        "  if (!input) throw new Error('missing input');",
        "  // TODO: implement core logic",
        "  return { ok: true, data: input };",
        "}",
        "",
        "// Add tests for happy path + edge cases",
      ]);
    default:
      return { ok: false, error: "Unknown developer generator." };
  }
}
