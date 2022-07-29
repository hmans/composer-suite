import {
  $,
  Add,
  GLSLType,
  Input,
  InstanceMatrix,
  mat3,
  Mat3,
  Mul,
  pipe,
  Pow,
  Value,
  vec3,
  Vec3
} from "shader-composer"
import {
  Billboard as BillboardUnit,
  ParticleAge,
  ParticleProgress
} from "./units"

export type ModuleState = {
  position: Input<"vec3">
  color: Input<"vec3">
  alpha: Input<"float">
}

export type Module = (state: ModuleState) => ModuleState

export type ModulePipe = Module[]

export const pipeModules = (initial: ModuleState, ...modules: Module[]) =>
  pipe(initial, ...(modules as [Module]))

export const Lifetime = (): Module => (state) => ({
  ...state,
  color: Vec3(state.color, {
    fragment: {
      body: $`if (${ParticleProgress} < 0.0 || ${ParticleProgress} > 1.0) discard;`
    }
  })
})

export const Scale = (scale: Input<"float"> = 1): Module => (state) => ({
  ...state,
  position: Mul(state.position, scale)
})

export const Translate = (offset: Input<"vec3">): Module => (state) => ({
  ...state,
  position: pipe(
    offset,
    (v) => Mul(v, mat3(InstanceMatrix)),
    (v) => Add(state.position, v)
  )
})

export const Velocity = (velocity: Input<"vec3">) =>
  Translate(Mul(velocity, ParticleAge))

export const Acceleration = (acceleration: Input<"vec3">) =>
  Translate(
    pipe(
      acceleration,
      (v) => Mul(v, Pow(ParticleAge, 2)),
      (v) => Mul(v, 0.5)
    )
  )

/**
 * Apply a downward force, just like gravity.
 *
 * @param amount The gravity force (default: 9.81).
 */
export const Gravity = (amount: Input<"float"> = 9.81) =>
  Acceleration(vec3(0, -amount, 0))

export const Billboard = (): Module => (state) => ({
  ...state,
  position: BillboardUnit(state.position)
})

export const SetColor = (color: Input<"vec3">): Module => (state) => ({
  ...state,
  color
})
