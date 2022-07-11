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

export const UpdateVertexNormal = (
  modifier: (v: Value<"vec3">) => Value<"vec3">,
  offset = 0.001
) => {
  const tangent = Tangent(VertexNormal)
  const bitangent = Bitangent(VertexNormal, tangent)

  const neighbor1 = Add(VertexPosition, Mul(tangent, offset))
  const neighbor2 = Add(VertexPosition, Mul(bitangent, offset))

  const displacedNeighbor1 = modifier(neighbor1)
  const displacedNeighbor2 = modifier(neighbor2)

  const displacedTangent = Sub(displacedNeighbor1, VertexPosition)
  const displacedBitangent = Sub(displacedNeighbor2, VertexPosition)

  return Normalize(Cross(displacedTangent, displacedBitangent))
}
