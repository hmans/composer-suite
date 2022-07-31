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
  Time,
  vec3,
  Vec3
} from "shader-composer"
import { Billboard as BillboardUnit } from "./units"

export type ModuleState = {
  position: Input<"vec3">
  color: Input<"vec3">
  alpha: Input<"float">
}

export type Module = (state: ModuleState) => ModuleState

export type ModulePipe = Module[]

export const pipeModules = (initial: ModuleState, ...modules: Module[]) =>
  pipe(initial, ...(modules as [Module]))

export const Lifetime = (lifetime: Input<"vec2">, time: Input<"float">) => {
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

export const Velocity = (velocity: Input<"vec3">, time: Input<"float">) =>
  Translate(Mul(velocity, time))

export const Acceleration = (
  acceleration: Input<"vec3">,
  time: Input<"float">
) =>
  Translate(
    pipe(
      acceleration,
      (v) => Mul(v, Pow(time, 2)),
      (v) => Mul(v, 0.5)
    )
  )

export const Billboard = (): Module => (state) => ({
  ...state,
  position: BillboardUnit(state.position)
})

/* TODO: overriding color is very bad because it will override Lifetime. Find a better solution! */
export const SetColor = (color: Input<"vec3">): Module => (state) => ({
  ...state,
  color
})

export type DefaultModulesProps = {
  time: Input<"float">
  lifetime: Input<"vec2">
  billboard?: Input<"bool">
  gravity?: Input<"float">
  scale?: Input<"float">
  color?: Input<"vec3">
  alpha?: Input<"float">
  velocity?: Input<"vec3">
  acceleration?: Input<"vec3">
}

export const DefaultModules = ({
  time,
  lifetime: lifetimeInput,
  billboard,
  scale,
  color,
  velocity,
  acceleration
}: DefaultModulesProps) => {
  const lifetime = Lifetime(lifetimeInput, time)

  return [
    lifetime.module,
    billboard && Billboard(),
    scale && Scale(scale),
    velocity && Velocity(velocity, lifetime.ParticleAge),
    acceleration && Acceleration(acceleration, lifetime.ParticleAge),
    color && SetColor(color)
  ].filter((d) => !!d) as ModulePipe
}
