import { InteractionGroups } from "@dimforge/rapier3d-compat"

export const interactionGroups = (
  memberships: number | number[],
  filters?: number | number[]
): InteractionGroups =>
  (bitmask(memberships) << 16) +
  (filters !== undefined ? bitmask(filters) : 0b1111_1111_1111_1111)

const bitmask = (groups: number | number[]): InteractionGroups =>
  [groups].flat().reduce((acc, layer) => acc | (1 << layer), 0)
