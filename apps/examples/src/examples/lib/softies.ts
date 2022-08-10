import {
  Div,
  Float,
  Input,
  LocalToViewSpace,
  Mul,
  pipe,
  Saturate,
  SceneDepth,
  ScreenUV,
  Sub
} from "shader-composer"
import { ModuleFactory } from "vfx-composer/modules"

export const SoftParticle = (
  softness: Input<"float">,
  position: Input<"vec3">
) => {
  return Float(
    pipe(
      position,
      /* Convert position to view space and grab depth */
      (v) => LocalToViewSpace(v).z,
      /* Subtract from the existing scene depth at the fragment coordinate */
      (v) => Sub(v, SceneDepth(ScreenUV)),
      /* Divide by softness factor */
      (v) => Div(v, softness),
      /* Clamp between 0 and 1 */
      (v) => Saturate(v)
    ),

    { name: "Soft Particle" }
  )
}

export const SoftParticles: ModuleFactory<{
  softness: Input<"float">
}> = ({ softness }) => (state) => ({
  ...state,
  alpha: Mul(state.alpha, SoftParticle(softness, state.position))
})
