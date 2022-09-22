export const bitmask = (...groups: number[]) =>
  groups.reduce((acc, layer) => acc | (1 << layer), 0)

const not = (...groups: number[]) => ~bitmask(...groups)

bitmask.not = not
