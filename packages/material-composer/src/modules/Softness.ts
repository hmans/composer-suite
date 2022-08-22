import { Input, Mul, Unit } from "shader-composer"
import { Softness as SoftnessUnit } from "shader-composer-toybox"
import { ModuleFactory } from "."

export const Softness: ModuleFactory<{
  softness: Input<"float">
  depthTexture: Unit<"sampler2D">
}> = ({ softness, depthTexture }) => (state) => ({
  ...state,
  alpha: Mul(state.alpha, SoftnessUnit(softness, state.position, depthTexture))
})
