import { pipe } from "fp-ts/function"
import {
  Div,
  Float,
  Input,
  LocalToViewSpace,
  PerspectiveDepth,
  Saturate,
  ScreenUV,
  Sub,
  Unit,
  varying
} from "shader-composer"

export const Softness = (
  softness: Input<"float">,
  position: Input<"vec3">,
  depthTexture: Unit<"sampler2D">
) =>
  Float(
    pipe(
      position,
      /* Convert position to view space and grab depth */
      (v) => varying(LocalToViewSpace(v).z),
      /* Subtract from the existing scene depth at the fragment coordinate */
      (v) => Sub(v, PerspectiveDepth(ScreenUV, depthTexture)),
      /* Divide by softness factor */
      (v) => Div(v, softness),
      /* Clamp between 0 and 1 */
      (v) => Saturate(v)
    ),

    { name: "Soft Particle" }
  )
