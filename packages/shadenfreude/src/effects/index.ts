import { Color } from "three"
import {
  Add,
  Bitangent,
  Cross,
  Mul,
  Multiply,
  Normalize,
  Remap,
  Simplex3DNoise,
  Smoothstep,
  Step,
  Sub,
  Subtract,
  Tangent,
  VertexNormal,
  VertexPosition
} from "../nodes"
import { Value } from "../tree"

export const Dissolve = (
  visibility: Value<"float"> = 0.5,
  scale: Value<"float"> = 1,
  edgeThickness: Value<"float"> = 0.1,
  edgeColor: Value<"vec3"> = new Color(0, 10, 8)
) => {
  const noise = Remap(
    Simplex3DNoise(Multiply(VertexPosition, scale)),
    -1,
    Add(edgeThickness, 1),
    0,
    1
  )

  return {
    color: Multiply(
      edgeColor,
      Smoothstep(Subtract(visibility, edgeThickness), visibility, noise)
    ),

    alpha: Step(noise, visibility)
  }
}

export const ModifyVertex = (
  originalPosition: Value<"vec3">,
  originalNormal: Value<"vec3">,
  modifier: (v: Value<"vec3">) => Value<"vec3">,
  offset = 0.001
) => {
  const tangent = Tangent(originalNormal)
  const bitangent = Bitangent(originalNormal, tangent)

  const displacedNeighbors = [
    Add(originalPosition, Mul(tangent, offset)),
    Add(originalPosition, Mul(bitangent, offset))
  ].map(modifier)

  const position = modifier(originalPosition)
  const displacedTangent = Sub(displacedNeighbors[0], position)
  const displacedBitangent = Sub(displacedNeighbors[1], position)

  const normal = Normalize(Cross(displacedTangent, displacedBitangent))

  return {
    position,
    normal
  }
}
