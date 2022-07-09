import { Color } from "three"
import {
  Remap,
  Simplex3DNoise,
  Multiply,
  VertexPosition,
  Add,
  Smoothstep,
  Subtract,
  Step
} from "../nodes"
import { Float, Vec3 } from "../variables"

export const Dissolve = (
  visibility: Float = 0.5,
  scale: Float = 1,
  edgeThickness: Float = 0.1,
  edgeColor: Vec3 = new Color(0, 10, 8)
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
