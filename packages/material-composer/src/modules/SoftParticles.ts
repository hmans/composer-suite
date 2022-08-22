import { Input, Mul, Unit } from "shader-composer"
import { Softness } from "shader-composer-toybox"
import { ModuleFactory } from "./index"

export const SoftParticles: ModuleFactory<{
  softness: Input<"float">
  depthTexture: Unit<"sampler2D">
}> = ({ softness, depthTexture }) => (state) => ({
  ...state,
  alpha: Mul(state.alpha, Softness(softness, state.position, depthTexture))
})
