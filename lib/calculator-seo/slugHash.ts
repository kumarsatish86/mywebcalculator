/** Deterministic 32-bit mix for per-slug content variation (not crypto). */

export function fnv1a32(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function pick<T>(arr: readonly T[], seed: number, salt: number): T {
  const idx = (seed + salt * 0x9e3779b9) % arr.length;
  return arr[idx]!;
}

export function spread(seed: number, i: number): number {
  return (Math.imul(seed ^ i, 0x45d9f3b) >>> 0) % 1_000_000;
}
