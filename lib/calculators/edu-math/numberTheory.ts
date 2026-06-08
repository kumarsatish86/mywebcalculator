function n(x: unknown): number | null {
  if (typeof x !== "number" || !Number.isFinite(x)) return null;
  return x;
}

export function gcdInt(a: number, b: number): number {
  let x = Math.abs(Math.trunc(a));
  let y = Math.abs(Math.trunc(b));
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 0;
}

export function lcmInt(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(Math.trunc(a / gcdInt(a, b)) * b);
}

export function isPrimeSmall(p: number): boolean {
  const n = Math.abs(Math.trunc(p));
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  const lim = Math.floor(Math.sqrt(n));
  for (let i = 3; i <= lim; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

export function primeFactors(n0: number): number[] {
  let n = Math.abs(Math.trunc(n0));
  if (n < 2) return [];
  const out: number[] = [];
  while (n % 2 === 0) {
    out.push(2);
    n /= 2;
  }
  let f = 3;
  while (f * f <= n) {
    while (n % f === 0) {
      out.push(f);
      n /= f;
    }
    f += 2;
  }
  if (n > 1) out.push(n);
  return out;
}

export function factorsUpTo(n0: number, limit = 500): number[] {
  const n = Math.abs(Math.trunc(n0));
  if (n === 0) return [];
  const out: number[] = [];
  const lim = Math.min(Math.floor(Math.sqrt(n)), limit);
  for (let i = 1; i <= lim; i++) {
    if (n % i === 0) {
      out.push(i);
      const j = n / i;
      if (j !== i) out.push(j);
    }
  }
  return out.sort((a, b) => a - b);
}

export function multiplesOf(m: number, count: number): number[] {
  const mm = Math.trunc(m);
  const c = Math.min(Math.max(1, Math.trunc(count)), 200);
  const arr: number[] = [];
  for (let i = 1; i <= c; i++) arr.push(mm * i);
  return arr;
}

export function parseIntList(f: Record<string, unknown>, key: string): number[] {
  const raw = f[key];
  if (typeof raw !== "string") return [];
  return raw
    .split(/[\s,;]+/)
    .map((s) => Number(s.trim()))
    .filter((v) => Number.isFinite(v));
}

export { n };
