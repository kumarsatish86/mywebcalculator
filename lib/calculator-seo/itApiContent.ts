import type { RichArticle } from "./types";

const HUB_HREF = "/engineering/it-dev/it-api-encoding";
const HUB_LABEL = "Engineering · IT/Dev · API and encoding tools";
const SHELL =
  "IT and developer education tools that run in your browser. Not a substitute for production security review, certified capacity planning, or vendor documentation. Stack assumptions and defaults are simplified — validate with your team before deploying.";

function article(
  slug: string,
  heading: string,
  paragraphs: string[],
  faq: { question: string; answer: string },
  seoTitle: string,
  seoDescription: string,
  keywords: string[],
): RichArticle {
  return {
    slug,
    vertical: "engineering-electrical",
    category: "engineering",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "API and encoding tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["URL encoder/decoder", "Percent-encoding for query strings"],
          ["JSON formatter", "Pretty-print & syntax validation"],
          ["XML formatter", "Indent & well-formed check"],
          ["CSV to JSON", "Row objects from delimited text"],
          ["JSON to CSV", "Flatten objects to columns"],
          ["HTML encoder/decoder", "Entity escape for XSS safety"],
          ["Unicode converter", "Code points & escapes"],
          ["ASCII converter", "7-bit character codes"],
          ["MIME type finder", "Extension ↔ content-type map"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your encoding inputs where supported. Educational IT aid only — validate payloads against API schemas in CI.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const IT_API_ARTICLES: Record<string, RichArticle> = {
  "it-url-encoder-decoder": article(
    "it-url-encoder-decoder",
    "URL encoder/decoder",
    [
      "Applies percent-encoding (RFC 3986) so reserved characters survive query strings and path segments in HTTP URLs.",
      "Encode each component separately — encoding an entire URL can double-encode already safe delimiters.",
    ],
    {
      question: "Should I encode spaces as + or %20?",
      answer:
        "In query strings, + often means space in application/x-www-form-urlencoded. In paths, use %20. APIs vary — follow spec.",
    },
    "URL Encoder/Decoder — Percent-Encoding for HTTP",
    "Encode and decode URL components for API integration literacy. Educational tool — encode per RFC rules.",
    ["url encoder decoder", "percent encoding tool", "encodeURIComponent helper"],
  ),
  "it-json-formatter-validator": article(
    "it-json-formatter-validator",
    "JSON formatter & validator",
    [
      "Pretty-prints and validates JSON syntax for debugging API payloads and config files before deployment.",
      "Schema validation (JSON Schema) and semantic checks are separate — valid JSON can still be wrong for your API.",
    ],
    {
      question: "Why does my JSON fail to parse?",
      answer:
        "Common issues: trailing commas, single quotes, unquoted keys, and BOM characters. Line numbers in the error point to the fault.",
    },
    "JSON Formatter & Validator — Pretty-Print & Syntax Check",
    "Format and validate JSON in your browser. Developer debugging aid — add schema tests in CI.",
    ["json formatter validator", "pretty print json", "json syntax checker"],
  ),
  "it-xml-formatter": article(
    "it-xml-formatter",
    "XML formatter",
    [
      "Indents and checks well-formed XML for SOAP, RSS, SAML, and legacy integration troubleshooting.",
      "Namespaces, XSD validation, and digital signatures require dedicated tools beyond pretty-printing.",
    ],
    {
      question: "Is pretty XML safe to paste into prod?",
      answer:
        "Formatting changes whitespace in text nodes if careless. Validate against XSD and test signatures after any transform.",
    },
    "XML Formatter — Indent & Well-Formed Check",
    "Format and validate XML structure for integration literacy. Educational aid — use XSD validation in pipelines.",
    ["xml formatter", "pretty print xml", "xml validator online"],
  ),
  "it-csv-to-json-converter": article(
    "it-csv-to-json-converter",
    "CSV to JSON converter",
    [
      "Maps delimited rows to JSON arrays of objects using header row keys — common ETL and API bootstrap pattern.",
      "Delimiter, quote escape, and UTF-8 BOM handling differ by exporter — inspect edge rows with commas in fields.",
    ],
    {
      question: "How are CSV headers used?",
      answer:
        "First row becomes JSON keys for each subsequent row. Duplicate or empty headers need cleanup before conversion.",
    },
    "CSV to JSON Converter — Rows to Object Array",
    "Convert CSV files to JSON arrays for API and script literacy. Educational tool — handle quoting and encoding.",
    ["csv to json converter", "csv json transform", "delimited to json"],
  ),
  "it-json-to-csv-converter": article(
    "it-json-to-csv-converter",
    "JSON to CSV converter",
    [
      "Flattens JSON arrays of objects to CSV columns for spreadsheet import and quick data exports.",
      "Nested objects and arrays need flattening rules — inconsistent keys across rows produce sparse columns.",
    ],
    {
      question: "How are nested JSON fields handled?",
      answer:
        "Flat converters often dot-path keys (user.name) or stringify nested blobs. Define rules before production ETL.",
    },
    "JSON to CSV Converter — Flatten Objects to Columns",
    "Convert JSON arrays to CSV for spreadsheet workflows. Educational aid — define nested field flattening.",
    ["json to csv converter", "json csv export", "flatten json to csv"],
  ),
  "it-html-encoder-decoder": article(
    "it-html-encoder-decoder",
    "HTML encoder/decoder",
    [
      "Escapes `<`, `>`, `&`, and quotes to entities when inserting untrusted text into HTML templates.",
      "Context matters — encode for HTML body, attribute, or JavaScript separately to prevent XSS.",
    ],
    {
      question: "Is HTML encoding enough for security?",
      answer:
        "It helps when outputting user text in HTML context. Use framework auto-escaping and CSP; never build HTML with string concat alone.",
    },
    "HTML Encoder/Decoder — Entity Escape for XSS Safety",
    "Encode and decode HTML entities for safe templating literacy. Educational security aid — use framework escaping.",
    ["html encoder decoder", "html entity escape", "xss prevent encode"],
  ),
  "it-unicode-converter": article(
    "it-unicode-converter",
    "Unicode converter",
    [
      "Shows code points, UTF-8/UTF-16 bytes, and escape sequences for international text in APIs and databases.",
      "Normalization (NFC vs NFD) affects string comparison — store and compare in a consistent normalized form.",
    ],
    {
      question: "Why do identical-looking strings not match?",
      answer:
        "Different Unicode normalization or invisible characters (ZWJ, BOM) cause mismatch. Normalize before compare and index.",
    },
    "Unicode Converter — Code Points & UTF Encodings",
    "Explore Unicode code points and UTF encodings for i18n literacy. Educational tool — normalize in your datastore.",
    ["unicode converter", "code point calculator", "utf-8 encoder decoder"],
  ),
  "it-ascii-converter": article(
    "it-ascii-converter",
    "ASCII converter",
    [
      "Maps characters to decimal/hex ASCII codes for protocols, serial formats, and legacy system integration.",
      "ASCII is 7-bit — extended ISO-8859 and UTF-8 subsume ASCII for bytes 0–127 but differ above.",
    ],
    {
      question: "Is ASCII the same as UTF-8?",
      answer:
        "For code points U+0000–U+007F, UTF-8 bytes match ASCII. UTF-8 adds multi-byte sequences for all Unicode.",
    },
    "ASCII Converter — Character Codes Decimal & Hex",
    "Convert characters to ASCII codes for protocol literacy. Educational aid — prefer UTF-8 for new systems.",
    ["ascii converter", "char to ascii code", "ascii table calculator"],
  ),
  "it-mime-type-finder": article(
    "it-mime-type-finder",
    "MIME type finder",
    [
      "Look up common file extensions and their IANA media types for Content-Type headers and upload validation.",
      "Sniffing vs declared type affects security — validate uploads server-side, not only by extension.",
    ],
    {
      question: "What Content-Type for JSON APIs?",
      answer:
        "Use application/json with UTF-8 charset. For forms, application/x-www-form-urlencoded or multipart/form-data as appropriate.",
    },
    "MIME Type Finder — Extension to Content-Type Map",
    "Find MIME types for file extensions in API work. Educational tool — validate uploads on the server.",
    ["mime type finder", "content type lookup", "file extension mime type"],
  ),
};
