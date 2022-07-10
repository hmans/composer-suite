import { Color } from "three"
import {
  Add,
  Multiply,
  Remap,
  Simplex3DNoise,
  Smoothstep,
  Step,
  Subtract,
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
