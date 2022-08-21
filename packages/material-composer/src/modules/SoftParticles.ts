import { Input, Mul, Unit } from "shader-composer"
import { SoftParticle } from "../units"
import { ModuleFactory } from "./index"

export const SoftParticles: ModuleFactory<{
  softness: Input<"float">
  depthTexture: Unit<"sampler2D">
}> = ({ softness, depthTexture }) => (state) => ({
  ...state,
  alpha: Mul(state.alpha, SoftParticle(softness, state.position, depthTexture))
})
