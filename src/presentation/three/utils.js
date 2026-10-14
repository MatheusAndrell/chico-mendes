// ───────── utilidades ─────────
export function mulberry32(a) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function easeOutBack(x) {
  if (x <= 0) return 0
  if (x >= 1) return 1
  const c1 = 1.4
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}

export const clamp01 = (x) => Math.max(0, Math.min(1, x))
export const range = (x, a, b) => clamp01((x - a) / (b - a))
export const smooth = (x) => x * x * (3 - 2 * x)
