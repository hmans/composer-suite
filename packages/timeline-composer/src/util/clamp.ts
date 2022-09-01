export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

export const clamp01 = (value: number) => clamp(value, 0, 1)
