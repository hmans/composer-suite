import {
  $,
  Add,
  Div,
  Input,
  InstanceMatrix,
  mat3,
  Mul,
  pipe,
  Pow,
  SplitVector2,
  Sub,
  Vec3
} from "shader-composer"
import { Billboard as BillboardUnit } from "./units"

export type ModuleState = {
  position: Input<"vec3">
  color: Input<"vec3">
  alpha: Input<"float">
}

export type Module = (state: ModuleState) => ModuleState
export type ModuleProps = Record<string, any>
export type ModuleFactory<P extends ModuleProps> = (props: P) => Module

export type ModulePipe = Module[]

export type LifetimeProps = { lifetime: Input<"vec2">; time: Input<"float"> }

export const Lifetime = ({ lifetime, time }: LifetimeProps) => {
  const [ParticleStartTime, ParticleEndTime] = SplitVector2(lifetime)

  const ParticleMaxAge = Sub(ParticleEndTime, ParticleStartTime)
  const ParticleAge = Sub(time, ParticleStartTime)
  const ParticleProgress = Div(ParticleAge, ParticleMaxAge)

  const module: Module = (state) => ({
    ...state,
    color: Vec3(state.color, {
      fragment: {
        body: $`if (${ParticleProgress} < 0.0 || ${ParticleProgress} > 1.0) discard;`
      }
    })
  })

  return {
    module,
    time,
    ParticleAge,
    ParticleMaxAge,
    ParticleStartTime,
    ParticleEndTime,
    ParticleProgress
  }
}

type ScaleProps = {
  scale: Input<"float">
}

export const Scale: ModuleFactory<ScaleProps> = ({ scale = 1 }) => (state) => ({
  ...state,
  position: Mul(state.position, scale)
})

type TranslateProps = {
  offset: Input<"vec3">
}

export const Translate = ({ offset }: TranslateProps): Module => (state) => ({
  ...state,
  position: pipe(
    offset,
    (v) => Mul(v, mat3(InstanceMatrix)),
    (v) => Add(state.position, v)
  )
})

type VelocityProps = {
  velocity: Input<"vec3">
  time: Input<"float">
}

export const Velocity = ({ velocity, time }: VelocityProps) =>
  Translate({ offset: Mul(velocity, time) })

type AccelerationProps = {
  force: Input<"vec3">
  time: Input<"float">
}

export const Acceleration = ({ force, time }: AccelerationProps) =>
  Translate({
    offset: pipe(
      force,
      (v) => Mul(v, Pow(time, 2)),
      (v) => Mul(v, 0.5)
    )
  })

export const Billboard = (): Module => (state) => ({
  ...state,
  position: BillboardUnit(state.position)
})

/* TODO: overriding color is very bad because it will override Lifetime. Find a better solution! */
export const SetColor = ({ color }: { color: Input<"vec3"> }): Module => (
  state
) => ({
  ...state,
  color
})

export const Module = ({ module }: { module: Module }): Module => module
