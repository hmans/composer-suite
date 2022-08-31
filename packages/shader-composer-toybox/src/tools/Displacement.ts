import {
  Add,
  Bitangent,
  Cross,
  Input,
  Mul,
  Normalize,
  Sub,
  Tangent,
  Unit,
  VertexNormal,
  VertexPosition
} from "shader-composer"

export type DisplacementFunction = (v: Unit<"vec3">) => Unit<"vec3">

export type DisplacementOptions = {
  position?: Unit<"vec3">
  normal?: Unit<"vec3">
  offset?: Input<"float">
}

export const Displacement = (
  displacementFun: DisplacementFunction,
  {
    position: originalPosition = VertexPosition,
    normal: originalNormal = VertexNormal,
    offset = 0.001
  }: DisplacementOptions = {}
) => {
  const tangent = Tangent(originalNormal)
  const bitangent = Bitangent(originalNormal, tangent)

  const displacedNeighbors = [
    Add(originalPosition, Mul(tangent, offset)),
    Add(originalPosition, Mul(bitangent, offset))
  ].map(displacementFun)

  /* Displace the original position. */
  const position = displacementFun(originalPosition)

  /* Now compare the displaced neighbors to the displaced original position. */
  const displacedTangent = Sub(displacedNeighbors[0], position)
  const displacedBitangent = Sub(displacedNeighbors[1], position)

  const normal = Normalize(Cross(displacedTangent, displacedBitangent))

  return {
    position,
    normal
  }
}
