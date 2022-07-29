import { InstancedBufferAttribute } from "three"

export const makeAttribute = (count: number, itemSize: number) =>
  new InstancedBufferAttribute(new Float32Array(count * itemSize), itemSize)
