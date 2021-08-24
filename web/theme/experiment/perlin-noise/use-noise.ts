function use2DNoise(seed: number, x: number, y: number) {
  const n = x + y * 57 + seed
  const a = (n << 13) ^ n
  return 1 - ((a * (a * a * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824;
}

function use3DNoise(seed: number, x: number, y: number, z: number) {
  const n = x + y + z * 57 + seed
  const a = (n << 13) ^ n
  return 1 - ((a * (a * a * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824;
}

export function useNoise(seed: number, x: number, y: number): number
export function useNoise(seed: number, x: number, y: number, z: number): number
export function useNoise(seed: number, x: number, y: number, z?: number): number {
  if (y == null) return use2DNoise(seed, x, y)
  return use3DNoise(seed, x, y, z!)
}
