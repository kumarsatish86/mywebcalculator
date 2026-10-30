import type { RichArticle } from "./types";

const HUB_HREF = "/engineering/it-dev/it-cryptography-security";
const HUB_LABEL = "Engineering · IT/Dev · Cryptography and security calculators";
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
        title: "Cryptography and security tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Hash generator", "MD5, SHA-256, SHA-512 digests"],
          ["Hash compare", "Constant-time digest comparison literacy"],
          ["Base64 encode/decode", "Binary-safe text transport"],
          ["JWT decoder", "Header/payload inspection (no verify)"],
          ["Encrypt/decrypt", "Symmetric teaching demos"],
          ["Password strength", "Entropy and policy checks"],
          ["Random password", "Cryptographically styled generators"],
          ["Salt generator", "Random salt bytes for KDFs"],
          ["HMAC generator", "Keyed hash for integrity"],
          ["SSL cert decoder", "Parse PEM certificate fields"],
          ["Key pair generator", "Asymmetric key literacy"],
          ["Checksum", "CRC and simple integrity sums"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your crypto inputs where supported. Educational IT aid only — never paste production secrets into untrusted pages.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const IT_CRYPTO_ARTICLES: Record<string, RichArticle> = {
  "it-hash-generator-md5-sha256-sha512": article(
    "it-hash-generator-md5-sha256-sha512",
    "Hash generator (MD5, SHA256, SHA512)",
    [
      "Computes message digests for teaching how one-way hash functions fingerprint data at fixed output sizes.",
      "MD5 and SHA-1 are deprecated for security — use SHA-256 or stronger for integrity; never use plain hashes for password storage.",
    ],
    {
      question: "Can I reverse a hash to get the password?",
      answer:
        "No — hashes are one-way. Attackers use rainbow tables and guessing for weak passwords; use slow password KDFs (bcrypt, Argon2) instead.",
    },
    "Hash Generator — MD5, SHA-256, SHA-512 Digests",
    "Generate message digests for integrity literacy. Educational tool — not for password storage or production signing.",
    ["hash generator", "sha256 calculator", "md5 sha512 hash"],
  ),
  "it-hash-compare-tool": article(
    "it-hash-compare-tool",
    "Hash compare tool",
    [
      "Compares two digests for equality — a teaching moment for timing-safe comparison in authentication code.",
      "Production code should use constant-time compare functions provided by your crypto library, not naive string equality.",
    ],
    {
      question: "Why does timing-safe comparison matter?",
      answer:
        "Early-exit string compare can leak how many prefix bytes match, aiding byte-by-byte guessing attacks on MACs or tokens.",
    },
    "Hash Compare Tool — Digest Equality Check",
    "Compare hash digests for integrity verification literacy. Educational aid — use library constant-time APIs in prod.",
    ["hash compare tool", "compare sha256 hashes", "digest verification"],
  ),
  "it-base64-encode-decode": article(
    "it-base64-encode-decode",
    "Base64 encode/decode",
    [
      "Encodes binary data as ASCII-safe text for JSON, email, and data URLs — not encryption, only encoding.",
      "Padding, URL-safe alphabet, and line wrapping variants exist — match the variant your API expects.",
    ],
    {
      question: "Is Base64 secure?",
      answer:
        "No. Anyone can decode Base64. Use encryption and authentication when confidentiality or integrity is required.",
    },
    "Base64 Encode/Decode — Binary-Safe Text Transport",
    "Encode and decode Base64 strings in your browser. Educational IT tool — not encryption.",
    ["base64 encode decode", "base64 converter", "binary to base64"],
  ),
  "it-jwt-decoder": article(
    "it-jwt-decoder",
    "JWT decoder",
    [
      "Parses JSON Web Token header and payload for debugging claims, expiry, and issuer fields without verifying signatures.",
      "Never trust decoded JWT content without cryptographic verification using the correct key and allowed algorithms.",
    ],
    {
      question: "Can I accept a JWT after decoding?",
      answer:
        "No. Decoding is Base64URL, not validation. Verify signature, exp, aud, and iss with your auth library before trusting claims.",
    },
    "JWT Decoder — Inspect Header & Payload Claims",
    "Decode JWT structure for integration debugging. Educational aid — always verify signatures in production.",
    ["jwt decoder", "decode json web token", "jwt payload viewer"],
  ),
  "it-encryption-decryption-tool": article(
    "it-encryption-decryption-tool",
    "Encryption/decryption tool",
    [
      "Demonstrates symmetric encrypt/decrypt flows for learning how keys and IVs protect confidentiality in teaching scenarios.",
      "Production systems need vetted algorithms (AES-GCM), key management, and authenticated encryption — not ad-hoc ciphers.",
    ],
    {
      question: "Which algorithm should I use in production?",
      answer:
        "Use standard AEAD modes (e.g. AES-GCM, ChaCha20-Poly1305) via your platform crypto library with random IVs and managed keys.",
    },
    "Encryption/Decryption Tool — Symmetric Literacy Demo",
    "Explore symmetric encryption concepts in the browser. Educational only — use vetted libraries for real data.",
    ["encryption decryption tool", "symmetric cipher demo", "aes teaching tool"],
  ),
  "it-password-strength-checker": article(
    "it-password-strength-checker",
    "Password strength checker",
    [
      "Scores passwords using length, character classes, and common-pattern heuristics to teach entropy basics.",
      "Strength meters are guides — passphrases and breach-aware checks (HIBP) beat naive complexity rules alone.",
    ],
    {
      question: "What makes a strong password?",
      answer:
        "Length and unpredictability matter most. Unique passwords per site and a password manager beat memorable complex strings.",
    },
    "Password Strength Checker — Entropy & Policy Hints",
    "Evaluate password strength with educational heuristics. Not a substitute for MFA and breach monitoring.",
    ["password strength checker", "password entropy", "strong password test"],
  ),
  "it-random-password-generator": article(
    "it-random-password-generator",
    "Random password generator",
    [
      "Creates random passwords with configurable length and character sets for learning secure credential hygiene.",
      "Use platform CSPRNG sources in production apps — browser generators are for personal passwords and demos.",
    ],
    {
      question: "How long should generated passwords be?",
      answer:
        "16+ characters with mixed types is a common baseline. For master passwords, prefer long passphrases (20+ chars).",
    },
    "Random Password Generator — Configurable Secure Strings",
    "Generate random passwords with length and charset options. Educational aid — store secrets in a password manager.",
    ["random password generator", "secure password generator", "generate strong password"],
  ),
  "it-salt-generator": article(
    "it-salt-generator",
    "Salt generator",
    [
      "Produces random salt bytes to show why unique salts per password defeat rainbow tables in KDF workflows.",
      "Salts are public but must be random and stored alongside the hash — never reuse salts across users.",
    ],
    {
      question: "Should I hide the salt?",
      answer:
        "Salts need not be secret but must be unique per credential. Security comes from the slow KDF and strong password, not salt secrecy.",
    },
    "Salt Generator — Random Bytes for Password KDFs",
    "Generate random salts for password hashing literacy. Educational tool — use library KDFs in application code.",
    ["salt generator", "password salt random", "cryptographic salt bytes"],
  ),
  "it-hmac-generator": article(
    "it-hmac-generator",
    "HMAC generator",
    [
      "Computes keyed-hash message authentication codes for teaching integrity and authenticity with a shared secret.",
      "Verify HMACs with constant-time compare and protect keys — prefer modern MACs in TLS and API signing standards.",
    ],
    {
      question: "HMAC vs plain hash — what is the difference?",
      answer:
        "HMAC mixes a secret key with the message so attackers cannot forge tags without the key. Plain hashes lack keyed authentication.",
    },
    "HMAC Generator — Keyed Integrity Tags",
    "Generate HMAC digests for API and message integrity literacy. Educational aid — use vetted signing in production.",
    ["hmac generator", "hmac sha256", "keyed hash calculator"],
  ),
  "it-ssl-certificate-decoder": article(
    "it-ssl-certificate-decoder",
    "SSL certificate decoder",
    [
      "Parses X.509 PEM certificates to display subject, issuer, validity, SANs, and fingerprint fields for ops literacy.",
      "Trust decisions require chain validation against your root store — decoding alone does not prove trustworthiness.",
    ],
    {
      question: "How do I know if a cert is expired?",
      answer:
        "Check notBefore and notAfter in the cert. Automated monitoring and ACME renewal prevent expiry outages.",
    },
    "SSL Certificate Decoder — Parse X.509 PEM Fields",
    "Decode SSL/TLS certificate fields for troubleshooting literacy. Not a substitute for full chain validation.",
    ["ssl certificate decoder", "x509 pem parser", "certificate expiry viewer"],
  ),
  "it-public-private-key-generator": article(
    "it-public-private-key-generator",
    "Public/private key generator",
    [
      "Generates asymmetric key pairs for teaching how public keys encrypt or verify while private keys decrypt or sign.",
      "Production keys belong in HSMs or KMS with rotation policy — browser-generated keys are for learning only.",
    ],
    {
      question: "Can I share the private key?",
      answer:
        "Never. Private keys must stay confidential. Only public keys belong in certificates, SSH authorized_keys, or JWKS.",
    },
    "Public/Private Key Generator — Asymmetric Pair Literacy",
    "Generate key pairs to learn asymmetric cryptography basics. Educational only — use KMS/HSM for production keys.",
    ["public private key generator", "rsa key pair generator", "asymmetric keys demo"],
  ),
  "it-checksum-calculator": article(
    "it-checksum-calculator",
    "Checksum calculator",
    [
      "Computes simple checksums and CRC-style values for detecting accidental bit flips in files and packets.",
      "CRC and additive checksums are not cryptographic — use hashes or MACs when attackers might tamper with data.",
    ],
    {
      question: "Is a checksum enough for security?",
      answer:
        "No. Checksums detect random errors, not malicious modification. Use SHA-256 or HMAC when integrity against attackers matters.",
    },
    "Checksum Calculator — CRC & Integrity Sums",
    "Calculate checksums for error-detection literacy. Educational tool — not for security-critical integrity.",
    ["checksum calculator", "crc calculator", "file checksum tool"],
  ),
};
