import { pipe } from "fp-ts/function"
import { Add, Input, Mul } from "shader-composer"
import { PSRDNoise3D } from "shader-composer-toybox"
import { ModuleFactory } from ".."

export type SurfaceWobbleProps = {
  offset?: Input<"vec3" | "float">
  amplitude?: Input<"float">
}

export const SurfaceWobble: ModuleFactory<SurfaceWobbleProps> =
  ({ offset = 1, amplitude = 1 }) =>
  (state) => {
    const displacement = pipe(
      state.position,
      (v) => Add(v, offset),
      (v) => PSRDNoise3D(v),
      (v) => Mul(v, amplitude)
    )

    const position = pipe(
      displacement,
      (v) => Mul(state.normal, v),
      (v) => Add(state.position, v)
    )

    return { ...state, position }
  }
