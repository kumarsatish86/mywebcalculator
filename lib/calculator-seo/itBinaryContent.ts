import type { RichArticle } from "./types";

const HUB_HREF = "/engineering/it-dev/it-number-systems-binary";
const HUB_LABEL = "Engineering · IT/Dev · Number systems and binary calculators";
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
        title: "Number systems and binary tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Binary calculator", "Radix-2 arithmetic and bit patterns"],
          ["Decimal ↔ binary", "Base 10 ↔ base 2 conversion"],
          ["Hex ↔ decimal", "Base 16 ↔ base 10 conversion"],
          ["Octal (all formats)", "Base 8 across binary, hex, decimal"],
          ["Binary ↔ hex", "Nibble-aligned hex from bits"],
          ["Bitwise ops", "AND, OR, XOR, NOT on integers"],
          ["Two's complement", "Signed representation in fixed width"],
          ["Signed/unsigned", "Interpret bits as signed or unsigned"],
          ["Binary add/subtract", "Bit-level addition and subtraction"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your number-system inputs. Educational IT aid only — verify with language/runtime integer rules.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const IT_BINARY_ARTICLES: Record<string, RichArticle> = {
  "it-binary-calculator": article(
    "it-binary-calculator",
    "Binary calculator",
    [
      "Performs arithmetic and bit-pattern operations in base 2 for teaching how computers represent integers.",
      "Word size, overflow, and floating-point rules differ by language and CPU — this is a literacy tool, not a compiler.",
    ],
    {
      question: "Does this match my programming language?",
      answer:
        "Languages pick fixed widths (8, 32, 64 bits) and signed rules. Use this to learn patterns, then check your runtime's integer semantics.",
    },
    "Binary Calculator — Base-2 Arithmetic & Bits",
    "Work with binary numbers and bit patterns in your browser. Educational IT tool — not a language runtime.",
    ["binary calculator", "binary arithmetic", "base 2 calculator"],
  ),
  "it-decimal-to-binary-converter": article(
    "it-decimal-to-binary-converter",
    "Decimal to binary converter",
    [
      "Converts base-10 integers to binary strings, showing how repeated division by two yields remainders as bits.",
      "Leading zeros and sign extension depend on the bit width you care about — specify context when applying to code.",
    ],
    {
      question: "Why does my binary string length vary?",
      answer:
        "Minimal encoding drops leading zeros. Fixed-width formats (8, 16, 32 bits) pad to the chosen size for hardware or protocol fields.",
    },
    "Decimal to Binary Converter — Base 10 to Base 2",
    "Convert decimal integers to binary notation. Educational radix tool — verify bit width in your application.",
    ["decimal to binary", "base 10 to binary converter", "integer to binary"],
  ),
  "it-binary-to-decimal-converter": article(
    "it-binary-to-decimal-converter",
    "Binary to decimal converter",
    [
      "Interprets a binary string as a base-2 integer and returns the equivalent decimal value.",
      "Invalid characters, implicit sign bits, and two's complement width are common pitfalls — validate input format first.",
    ],
    {
      question: "Is the leftmost bit the sign?",
      answer:
        "Only in signed two's complement with a declared width. Unsigned binary treats all bits as magnitude.",
    },
    "Binary to Decimal Converter — Base 2 to Base 10",
    "Convert binary strings to decimal integers. Educational IT aid — confirm signed vs unsigned in your stack.",
    ["binary to decimal", "base 2 to decimal", "binary string to int"],
  ),
  "it-hexadecimal-to-decimal-converter": article(
    "it-hexadecimal-to-decimal-converter",
    "Hexadecimal to decimal converter",
    [
      "Maps base-16 digits (0–9, A–F) to decimal for reading memory addresses, color codes, and protocol fields.",
      "Case and prefix conventions (0x, #) are display choices — strip or normalize before conversion.",
    ],
    {
      question: "Do I need the 0x prefix?",
      answer:
        "No for math — the prefix is a C-style marker. Remove it if your input parser does not expect it.",
    },
    "Hexadecimal to Decimal Converter — Base 16 to Base 10",
    "Convert hex values to decimal integers. Developer literacy tool — not a debugger or memory dump parser.",
    ["hex to decimal", "hexadecimal converter", "0x to decimal"],
  ),
  "it-decimal-to-hex-converter": article(
    "it-decimal-to-hex-converter",
    "Decimal to hex converter",
    [
      "Expresses decimal integers as hexadecimal — the compact form used in dumps, CSS colors, and MAC-style literals.",
      "Uppercase vs lowercase and zero-padding are formatting options for readability, not value changes.",
    ],
    {
      question: "Why pad hex to two digits?",
      answer:
        "Bytes are two hex digits (00–FF). Color channels and opcodes often require fixed-width hex for consistent display.",
    },
    "Decimal to Hex Converter — Base 10 to Base 16",
    "Convert decimal integers to hexadecimal strings. Educational IT tool — verify padding rules in your format.",
    ["decimal to hex", "base 10 to hexadecimal", "int to hex"],
  ),
  "it-octal-converter-all-formats": article(
    "it-octal-converter-all-formats",
    "Octal converter (all formats)",
    [
      "Translates values among octal, binary, decimal, and hex — useful for Unix file permissions and legacy systems.",
      "Leading zero in some languages denotes octal literals — do not confuse display conversion with source syntax.",
    ],
    {
      question: "Where is octal still used?",
      answer:
        "Unix chmod modes (e.g. 755), some embedded configs, and historical documentation. Most modern APIs prefer decimal or hex.",
    },
    "Octal Converter — Binary, Decimal, Hex & Octal",
    "Convert numbers across octal and other radices. Educational IT aid — check language literal rules separately.",
    ["octal converter", "octal to binary", "chmod octal calculator"],
  ),
  "it-binary-to-hex-converter": article(
    "it-binary-to-hex-converter",
    "Binary to hex converter",
    [
      "Groups binary bits into nibbles (4 bits) and maps each nibble to one hex digit for compact display.",
      "Bit count must align to 4-bit boundaries for clean hex — pad on the left when needed.",
    ],
    {
      question: "How many bits per hex digit?",
      answer:
        "One hex digit represents exactly 4 bits. Two hex digits make one byte (8 bits).",
    },
    "Binary to Hex Converter — Compact Bit Representation",
    "Convert binary strings to hexadecimal notation. Developer education tool — pad to nibble boundaries when required.",
    ["binary to hex", "bits to hexadecimal", "nibble converter"],
  ),
  "it-bitwise-calculator-and-or-xor-not": article(
    "it-bitwise-calculator-and-or-xor-not",
    "Bitwise calculator (AND, OR, XOR, NOT)",
    [
      "Applies AND, OR, XOR, and NOT across integer operands to show flag masking, toggling, and parity patterns.",
      "Shift amounts and operand width follow language rules — oversized shifts may wrap or be undefined in C.",
    ],
    {
      question: "When should I use XOR?",
      answer:
        "Common teaching uses: toggle bits, simple checksums, and swap-without-temp tricks. Production crypto needs proper algorithms, not XOR alone.",
    },
    "Bitwise Calculator — AND, OR, XOR, NOT Operations",
    "Run bitwise logic on integers in your browser. Educational IT tool — confirm width and shift semantics in your language.",
    ["bitwise calculator", "AND OR XOR NOT", "bit mask calculator"],
  ),
  "it-twos-complement-calculator": article(
    "it-twos-complement-calculator",
    "Two's complement calculator",
    [
      "Shows how signed integers are encoded: invert bits and add one for negative values in a fixed bit width.",
      "Overflow at the chosen width wraps — real hardware and languages may trap or promote to wider types.",
    ],
    {
      question: "Why is two's complement standard?",
      answer:
        "It gives a single zero, symmetric ranges, and simple add/subtract hardware using the same adder as unsigned math.",
    },
    "Two's Complement Calculator — Signed Integer Encoding",
    "Encode and decode signed integers with two's complement. Educational IT aid — declare bit width for your use case.",
    ["two's complement calculator", "signed integer encoding", "2s complement"],
  ),
  "it-signed-unsigned-number-converter": article(
    "it-signed-unsigned-number-converter",
    "Signed/unsigned number converter",
    [
      "Reinterprets the same bit pattern as signed or unsigned under a chosen width — a common source of bugs in C and embedded code.",
      "Promotion to wider types changes sign extension behavior — always trace casts in security-sensitive code.",
    ],
    {
      question: "Can the same bits be two different numbers?",
      answer:
        "Yes. Interpretation (signed vs unsigned) changes the numeric value without changing the underlying bits.",
    },
    "Signed/Unsigned Converter — Bit Pattern Interpretation",
    "Switch between signed and unsigned views of the same bit pattern. Educational tool — audit casts in production code.",
    ["signed unsigned converter", "bit pattern interpretation", "integer cast calculator"],
  ),
  "it-binary-addition-subtraction-calculator": article(
    "it-binary-addition-subtraction-calculator",
    "Binary addition/subtraction calculator",
    [
      "Adds or subtracts binary numbers showing carries and borrows — the same rules CPUs use at the bit level.",
      "Subtraction often implemented as addition with two's complement — teaching view may show both methods.",
    ],
    {
      question: "What happens when carry exceeds bit width?",
      answer:
        "The carry out is discarded in fixed-width arithmetic — that is overflow. Wider types or error handling are needed for correct results.",
    },
    "Binary Addition & Subtraction Calculator — Carry & Borrow",
    "Add and subtract binary numbers with carry/borrow steps. Educational IT tool — not a hardware simulator.",
    ["binary addition calculator", "binary subtraction", "carry borrow binary"],
  ),
};
