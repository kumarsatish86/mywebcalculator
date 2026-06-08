import {
  factorsUpTo,
  gcdInt,
  isPrimeSmall,
  lcmInt,
  multiplesOf,
  n,
  parseIntList,
  primeFactors,
} from "./numberTheory";

export type MathLine = { label: string; value: string };
export type MathResult = { lines: MathLine[]; error?: string };

function fmt(x: number, d = 6): string {
  if (!Number.isFinite(x)) return "—";
  const ax = Math.abs(x);
  if (ax >= 1e8 || (ax < 1e-4 && ax > 0)) return x.toExponential(4);
  return x.toFixed(Math.min(6, ax >= 1000 ? 2 : d));
}

const ROMAN = [
  ["M", 1000],
  ["CM", 900],
  ["D", 500],
  ["CD", 400],
  ["C", 100],
  ["XC", 90],
  ["L", 50],
  ["XL", 40],
  ["X", 10],
  ["IX", 9],
  ["V", 5],
  ["IV", 4],
  ["I", 1],
] as const;

function toRoman(num: number): string {
  let n0 = Math.trunc(num);
  if (n0 <= 0 || n0 > 3999) return "";
  let s = "";
  let v = n0;
  for (const [sym, val] of ROMAN) {
    while (v >= val) {
      s += sym;
      v -= val;
    }
  }
  return s;
}

function fromRoman(s: string): number | null {
  const u = s.trim().toUpperCase();
  if (!u || !/^[MDCLXVI]+$/.test(u)) return null;
  const val = (c: string) =>
    ({ M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1 } as Record<string, number>)[c] ?? 0;
  let total = 0;
  let i = 0;
  while (i < u.length) {
    const v = val(u[i]);
    const nv = i + 1 < u.length ? val(u[i + 1]) : 0;
    if (nv > v) {
      total += nv - v;
      i += 2;
    } else {
      total += v;
      i += 1;
    }
  }
  return total;
}

function quadRoots(a: number, b: number, c: number): MathResult {
  if (a === 0) {
    if (b === 0) return { error: "Not a linear/quadratic equation in a.", lines: [] };
    return { lines: [{ label: "Root (linear)", value: `${fmt(-c / b, 6)}` }] };
  }
  const disc = b * b - 4 * a * c;
  if (disc < 0) {
    const re = -b / (2 * a);
    const im = Math.sqrt(-disc) / (2 * a);
    return {
      lines: [
        { label: "Root 1", value: `${fmt(re, 6)} + ${fmt(im, 6)} i` },
        { label: "Root 2", value: `${fmt(re, 6)} − ${fmt(im, 6)} i` },
      ],
    };
  }
  const r1 = (-b + Math.sqrt(disc)) / (2 * a);
  const r2 = (-b - Math.sqrt(disc)) / (2 * a);
  return { lines: [{ label: "Root 1", value: `${fmt(r1, 6)}` }, { label: "Root 2", value: `${fmt(r2, 6)}` }] };
}

export function computeEduMath(slug: string, f: Record<string, unknown>): MathResult {
  const a = n(f.a);
  const b = n(f.b);
  const c = n(f.c);
  const x = n(f.x);
  const y = n(f.y);
  const z = n(f.z);
  const list = parseIntList(f, "list");

  if (slug === "even-odd-number-checker") {
    const v = n(f.n);
    if (v == null || !Number.isInteger(v)) return { error: "Enter an integer n.", lines: [] };
    return { lines: [{ label: v % 2 === 0 ? "Even" : "Odd", value: `n = ${v}` }] };
  }
  if (slug === "prime-number-calculator") {
    const v = n(f.n);
    if (v == null || !Number.isInteger(v) || v < 0) return { error: "Enter a non-negative integer n (≤ 1e9 for trial division).", lines: [] };
    if (v > 1e9) return { error: "n too large for this browser trial division.", lines: [] };
    return { lines: [{ label: isPrimeSmall(v) ? "Prime" : "Composite", value: `n = ${v}` }] };
  }
  if (slug === "prime-factorization-calculator") {
    const v = n(f.n);
    if (v == null || !Number.isInteger(v) || v < 2) return { error: "Enter integer n ≥ 2.", lines: [] };
    const fac = primeFactors(v);
    return { lines: [{ label: "Factors", value: fac.join(" × ") }] };
  }
  if (slug === "lcm-calculator") {
    if (a == null || b == null || !Number.isInteger(a) || !Number.isInteger(b)) {
      return { error: "Enter two integers a and b.", lines: [] };
    }
    return { lines: [{ label: "LCM(a,b)", value: `${lcmInt(a, b)}` }] };
  }
  if (slug === "hcf-gcd-calculator") {
    if (a == null || b == null || !Number.isInteger(a) || !Number.isInteger(b)) {
      return { error: "Enter two integers a and b.", lines: [] };
    }
    return { lines: [{ label: "GCD / HCF", value: `${gcdInt(a, b)}` }] };
  }
  if (slug === "divisibility-calculator") {
    if (a == null || b == null || b === 0) return { error: "Enter dividend a and divisor b (b ≠ 0).", lines: [] };
    return { lines: [{ label: a % b === 0 ? "Divisible" : "Not divisible", value: `remainder ${a % b}` }] };
  }
  if (slug === "multiples-calculator") {
    const m = n(f.m);
    const k = n(f.count) ?? 12;
    if (m == null) return { error: "Enter base m and optional count.", lines: [] };
    return { lines: [{ label: "First multiples", value: multiplesOf(m, k).join(", ") }] };
  }
  if (slug === "factors-calculator") {
    const v = n(f.n);
    if (v == null || !Number.isInteger(v)) return { error: "Enter integer n.", lines: [] };
    return { lines: [{ label: "Factors", value: factorsUpTo(v).join(", ") }] };
  }
  if (slug === "number-base-converter-binary-octal-decimal-hex") {
    const from = typeof f.fromBase === "string" ? parseInt(f.fromBase, 10) : n(f.fromBase);
    const s = String(f.digits ?? "").replace(/\s+/g, "");
    if (!s || from == null || from < 2 || from > 36) {
      return { error: "Enter digits (string) and fromBase integer 2–36.", lines: [] };
    }
    const num = parseInt(s, from);
    if (!Number.isFinite(num)) return { error: "Could not parse digits in given base.", lines: [] };
    return {
      lines: [
        { label: "Decimal", value: `${num}` },
        { label: "Binary", value: num.toString(2) },
        { label: "Octal", value: num.toString(8) },
        { label: "Hex", value: num.toString(16).toUpperCase() },
      ],
    };
  }
  if (slug === "roman-numeral-converter") {
    const mode = f.mode === "toRoman" ? "toRoman" : "fromRoman";
    if (mode === "toRoman") {
      const v = n(f.n);
      if (v == null || v <= 0 || v > 3999) return { error: "Enter integer 1–3999 for toRoman.", lines: [] };
      return { lines: [{ label: "Roman", value: toRoman(v) }] };
    }
    const s = typeof f.roman === "string" ? f.roman : "";
    const t = fromRoman(s);
    if (t == null) return { error: "Enter roman field like XIV.", lines: [] };
    return { lines: [{ label: "Decimal", value: `${t}` }] };
  }

  if (slug === "fraction-calculator" || slug === "simplify-fractions-calculator") {
    const an = n(f.an) ?? 0;
    const ad = n(f.ad) ?? 1;
    if (ad === 0) return { error: "Denominator cannot be 0.", lines: [] };
    const g = gcdInt(an, ad);
    const sn = an / g;
    const sd = ad / g;
    return { lines: [{ label: "Simplified", value: `${fmt(sn, 0)} / ${fmt(sd, 0)}` }, { label: "Decimal", value: `${fmt(an / ad, 8)}` }] };
  }
  if (slug === "equivalent-fractions-calculator") {
    const an = n(f.an) ?? 0;
    const ad = n(f.ad) ?? 1;
    const k = n(f.k) ?? 2;
    if (ad === 0) return { error: "Denominator cannot be 0.", lines: [] };
    return { lines: [{ label: "Scaled by k", value: `${an * k} / ${ad * k}` }] };
  }
  if (slug === "mixed-number-calculator" || slug === "improper-fraction-calculator") {
    const an = n(f.an) ?? 0;
    const ad = n(f.ad) ?? 1;
    if (ad === 0) return { error: "Denominator cannot be 0.", lines: [] };
    const whole = Math.trunc(an / ad);
    const rn = an - whole * ad;
    const g = gcdInt(rn, ad);
    return {
      lines: [
        { label: "Mixed", value: `${whole} ${Math.abs(rn / g)}/${Math.abs(ad / g)}` },
        { label: "Improper", value: `${an}/${ad}` },
      ],
    };
  }
  if (slug === "fraction-to-decimal-converter") {
    const an = n(f.an) ?? 0;
    const ad = n(f.ad) ?? 1;
    if (ad === 0) return { error: "Denominator cannot be 0.", lines: [] };
    return { lines: [{ label: "Decimal", value: `${fmt(an / ad, 12)}` }] };
  }
  if (slug === "decimal-to-fraction-converter") {
    const dec = n(f.dec);
    const maxd = n(f.maxDenom) ?? 1000;
    if (dec == null) return { error: "Enter decimal dec.", lines: [] };
    let bestN = 0,
      bestD = 1;
    let bestErr = Infinity;
    for (let d = 1; d <= (maxd ?? 1000); d++) {
      const n0 = Math.round(dec * d);
      const err = Math.abs(dec - n0 / d);
      if (err < bestErr) {
        bestErr = err;
        bestN = n0;
        bestD = d;
      }
    }
    const g = gcdInt(bestN, bestD);
    return { lines: [{ label: "Approx fraction", value: `${bestN / g} / ${bestD / g}` }] };
  }
  if (slug === "decimal-calculator") {
    const u = n(f.a);
    const v = n(f.b);
    const op = String(f.op ?? "+");
    if (u == null || v == null) return { error: "Enter a, b, and op (+ - * /).", lines: [] };
    const r =
      op === "-" ? u - v : op === "*" ? u * v : op === "/" ? (v === 0 ? NaN : u / v) : u + v;
    if (!Number.isFinite(r)) return { error: "Division by zero.", lines: [] };
    return { lines: [{ label: "Result", value: `${fmt(r, 10)}` }] };
  }
  if (slug === "repeating-decimal-calculator") {
    return { lines: [{ label: "Note", value: "Use decimal-to-fraction with maxDenom for a rational approximation of a repeating tail." }] };
  }

  if (slug === "quadratic-equation-calculator") {
    if (a == null || b == null || c == null) return { error: "Enter coefficients a, b, c for ax²+bx+c=0.", lines: [] };
    return quadRoots(a, b, c);
  }
  if (slug === "equation-solver-linear") {
    if (a == null || b == null) return { error: "Enter a and b for ax + b = 0.", lines: [] };
    if (a === 0) return { error: "a cannot be 0.", lines: [] };
    return { lines: [{ label: "x", value: `${fmt(-b / a, 8)}` }] };
  }
  if (slug === "absolute-value-calculator") {
    const v = n(f.n);
    if (v == null) return { error: "Enter n.", lines: [] };
    return { lines: [{ label: "|n|", value: `${fmt(Math.abs(v), 8)}` }] };
  }
  if (slug === "exponent-calculator") {
    if (a == null || b == null) return { error: "Enter base a and exponent b.", lines: [] };
    return { lines: [{ label: "a^b", value: `${fmt(a ** b, 8)}` }] };
  }
  if (slug === "logarithm-calculator") {
    const v = n(f.n);
    const base = n(f.base) ?? Math.E;
    if (v == null || v <= 0 || base <= 0 || base === 1) return { error: "Enter n>0 and base>0, base≠1.", lines: [] };
    return { lines: [{ label: "log", value: `${fmt(Math.log(v) / Math.log(base), 8)}` }] };
  }
  if (slug === "roots-calculator" || slug === "radical-calculator") {
    const v = n(f.n);
    const r = n(f.root) ?? 2;
    if (v == null) return { error: "Enter n (and optional root, default 2).", lines: [] };
    if (r === 0) return { error: "Root degree cannot be 0.", lines: [] };
    return { lines: [{ label: "Result", value: `${fmt(Math.sign(v) * Math.abs(v) ** (1 / r), 8)}` }] };
  }

  if (slug === "area-calculator") {
    const shape = String(f.shape ?? "rectangle");
    if (shape === "rectangle" && a != null && b != null) return { lines: [{ label: "Area", value: `${fmt(a * b, 6)}` }] };
    if (shape === "circle" && a != null) return { lines: [{ label: "Area πr²", value: `${fmt(Math.PI * a * a, 6)}` }] };
    return { error: "For area-calculator use shape rectangle with a,b (sides) or circle with a (radius).", lines: [] };
  }
  if (slug === "perimeter-calculator") {
    const shape = String(f.shape ?? "rectangle");
    if (shape === "rectangle" && a != null && b != null) return { lines: [{ label: "Perimeter", value: `${fmt(2 * (a + b), 6)}` }] };
    if (shape === "circle" && a != null) return { lines: [{ label: "Circumference", value: `${fmt(2 * Math.PI * a, 6)}` }] };
    return { error: "Use shape rectangle (a,b) or circle (radius a).", lines: [] };
  }
  if (slug === "pythagorean-theorem-calculator") {
    if (a != null && b != null) return { lines: [{ label: "c", value: `${fmt(Math.hypot(a, b), 8)}` }] };
    if (a != null && c != null && c >= a) return { lines: [{ label: "b", value: `${fmt(Math.sqrt(c * c - a * a), 8)}` }] };
    return { error: "Enter legs a,b or leg a and hypotenuse c.", lines: [] };
  }
  if (slug === "distance-between-two-points-calculator") {
    if (a == null || b == null || n(f.x2) == null || n(f.y2) == null) {
      return { error: "Enter x1,y1 as a,b and x2,y2 as x2,y2.", lines: [] };
    }
    const x2 = n(f.x2)!;
    const y2 = n(f.y2)!;
    return { lines: [{ label: "Distance", value: `${fmt(Math.hypot(x2 - a, y2 - b), 8)}` }] };
  }
  if (slug === "midpoint-calculator") {
    if (a == null || b == null || n(f.x2) == null || n(f.y2) == null) return { error: "Enter x1,y1 and x2,y2.", lines: [] };
    return {
      lines: [
        { label: "Midpoint x", value: `${fmt((a + n(f.x2)!) / 2, 8)}` },
        { label: "Midpoint y", value: `${fmt((b + n(f.y2)!) / 2, 8)}` },
      ],
    };
  }

  if (slug === "standard-deviation-calculator" || slug === "variance-calculator" || slug === "data-set-analyzer") {
    const nums = list.length ? list : parseIntList(f, "nums");
    if (nums.length < 2) return { error: "Enter comma-separated list in field 'list' or 'nums' (≥2 numbers).", lines: [] };
    const mean = nums.reduce((s, v) => s + v, 0) / nums.length;
    const varP = nums.reduce((s, v) => s + (v - mean) ** 2, 0) / nums.length;
    const varS = (nums.reduce((s, v) => s + (v - mean) ** 2, 0) / (nums.length - 1));
    const lines: MathLine[] = [
      { label: "Mean", value: `${fmt(mean, 8)}` },
      { label: "Population variance", value: `${fmt(varP, 8)}` },
      { label: "Sample variance", value: `${fmt(varS, 8)}` },
    ];
    if (slug === "standard-deviation-calculator") {
      return {
        lines: [
          { label: "σ (population)", value: `${fmt(Math.sqrt(varP), 8)}` },
          { label: "s (sample)", value: `${fmt(Math.sqrt(varS), 8)}` },
        ],
      };
    }
    if (slug === "variance-calculator") return { lines: lines.filter((l) => l.label.includes("variance")) };
    lines.push({ label: "Min", value: `${fmt(Math.min(...nums), 8)}` });
    lines.push({ label: "Max", value: `${fmt(Math.max(...nums), 8)}` });
    return { lines };
  }
  if (slug === "permutation-calculator") {
    const nn = n(f.n);
    const k = n(f.k);
    if (nn == null || k == null || nn < 0 || k < 0 || k > nn) return { error: "Enter n and k with 0 ≤ k ≤ n ≤ 170.", lines: [] };
    let p = 1;
    for (let i = 0; i < k; i++) p *= nn - i;
    return { lines: [{ label: "P(n,k)", value: `${p}` }] };
  }
  if (slug === "combination-calculator") {
    const nn = n(f.n);
    const k = n(f.k);
    if (nn == null || k == null || nn < 0 || k < 0 || k > nn) return { error: "Enter n and k with 0 ≤ k ≤ n.", lines: [] };
    let num = 1,
      den = 1;
    for (let i = 0; i < k; i++) {
      num *= nn - i;
      den *= i + 1;
    }
    return { lines: [{ label: "C(n,k)", value: `${fmt(num / den, 0)}` }] };
  }
  if (slug === "probability-calculator") {
    const favorable = n(f.favorable);
    const total = n(f.total);
    if (favorable == null || total == null || total === 0) return { error: "Enter favorable and total outcomes.", lines: [] };
    return { lines: [{ label: "P", value: `${fmt(favorable / total, 8)}` }] };
  }
  if (slug === "z-score-calculator") {
    const v = n(f.x);
    const mu = n(f.mu);
    const sigma = n(f.sigma);
    if (v == null || mu == null || sigma == null || sigma === 0) {
      return { error: "Enter x, mean μ, and standard deviation σ>0.", lines: [] };
    }
    return { lines: [{ label: "z", value: `${fmt((v - mu) / sigma, 6)}` }] };
  }

  if (slug === "derivative-calculator" || slug === "polynomial-calculator") {
    const c0 = n(f.c0) ?? 0;
    const c1 = n(f.c1) ?? 0;
    const c2 = n(f.c2) ?? 0;
    const c3 = n(f.c3) ?? 0;
    const xx = n(f.x) ?? 0;
    const d0 = c1;
    const d1 = 2 * c2;
    const d2 = 3 * c3;
    const deriv = d0 + d1 * xx + d2 * xx * xx;
    return {
      lines: [
        { label: "P(x)=c0+c1x+c2x²+c3x³ at x", value: `${fmt(c0 + c1 * xx + c2 * xx * xx + c3 * xx * xx * xx, 8)}` },
        { label: "P′(x)", value: `${fmt(deriv, 8)}` },
      ],
    };
  }
  if (slug === "definite-integral-calculator" || slug === "integral-calculator") {
    const c0 = n(f.c0) ?? 0;
    const c1 = n(f.c1) ?? 0;
    const c2 = n(f.c2) ?? 0;
    const c3 = n(f.c3) ?? 0;
    const A = n(f.a) ?? 0;
    const B = n(f.b) ?? 1;
    const F = (t: number) => c0 * t + (c1 / 2) * t * t + (c2 / 3) * t ** 3 + (c3 / 4) * t ** 4;
    return { lines: [{ label: "∫ₐᵇ P(x)dx (polynomial)", value: `${fmt(F(B) - F(A), 8)}` }] };
  }

  if (slug === "determinant-calculator") {
    const a11 = n(f.a11),
      a12 = n(f.a12),
      a21 = n(f.a21),
      a22 = n(f.a22);
    if ([a11, a12, a21, a22].some((v) => v == null)) return { error: "Enter 2×2 matrix a11,a12,a21,a22.", lines: [] };
    const det = a11! * a22! - a12! * a21!;
    return { lines: [{ label: "det", value: `${fmt(det, 8)}` }] };
  }
  if (slug === "matrix-multiplication-calculator" || slug === "matrix-calculator") {
    const a11 = n(f.a11),
      a12 = n(f.a12),
      a21 = n(f.a21),
      a22 = n(f.a22);
    const b11 = n(f.b11),
      b12 = n(f.b12),
      b21 = n(f.b21),
      b22 = n(f.b22);
    if ([a11, a12, a21, a22, b11, b12, b21, b22].some((v) => v == null)) {
      return { error: "Enter 2×2 matrices A and B (a11..a22, b11..b22).", lines: [] };
    }
    const c11 = a11! * b11! + a12! * b21!;
    const c12 = a11! * b12! + a12! * b22!;
    const c21 = a21! * b11! + a22! * b21!;
    const c22 = a21! * b12! + a22! * b22!;
    return {
      lines: [
        { label: "C11", value: `${fmt(c11, 6)}` },
        { label: "C12", value: `${fmt(c12, 6)}` },
        { label: "C21", value: `${fmt(c21, 6)}` },
        { label: "C22", value: `${fmt(c22, 6)}` },
      ],
    };
  }

  if (slug === "dot-product-calculator") {
    if (a == null || b == null || n(f.a2) == null || n(f.b2) == null || n(f.a3) == null || n(f.b3) == null) {
      return { error: "Enter vectors (a1,a2,a3) and (b1,b2,b3) as a,b,a2,b2,a3,b3.", lines: [] };
    }
    const s = a * n(f.a2)! + b * n(f.b2)! + n(f.a3)! * n(f.b3)!;
    return { lines: [{ label: "u·v", value: `${fmt(s, 8)}` }] };
  }
  if (slug === "cross-product-calculator") {
    const ax = n(f.ax),
      ay = n(f.ay),
      az = n(f.az);
    const bx = n(f.bx),
      by = n(f.by),
      bz = n(f.bz);
    if ([ax, ay, az, bx, by, bz].some((v) => v == null)) return { error: "Enter ax,ay,az and bx,by,bz.", lines: [] };
    const cx = ay! * bz! - az! * by!;
    const cy = az! * bx! - ax! * bz!;
    const cz = ax! * by! - ay! * bx!;
    return {
      lines: [
        { label: "x", value: `${fmt(cx, 8)}` },
        { label: "y", value: `${fmt(cy, 8)}` },
        { label: "z", value: `${fmt(cz, 8)}` },
      ],
    };
  }

  if (slug === "length-converter") {
    const meters = n(f.meters);
    if (meters == null) return { error: "Enter meters.", lines: [] };
    return {
      lines: [
        { label: "Feet", value: `${fmt(meters * 3.28084, 6)}` },
        { label: "Inches", value: `${fmt(meters * 39.3701, 6)}` },
      ],
    };
  }

  return {
    error:
      "Use the labeled numeric fields in the calculator card (a,b,c,x,list,...). This slug is supported; add the inputs shown in the form hints above Calculate.",
    lines: [],
  };
}
