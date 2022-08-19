import {
  $,
  Add,
  Div,
  Input,
  InstanceMatrix,
  Lerp,
  mat3,
  Mul,
  NormalizePlusMinusOne,
  OneMinus,
  pipe,
  Pow,
  Smoothstep,
  SplitVector2,
  Sub,
  Time,
  Unit,
  vec3,
  Vec3,
  VertexPosition
} from "shader-composer"
import { Color } from "three"
import { Billboard as BillboardUnit, SoftParticle } from "./units"
import { PSRDNoise3D, Turbulence3D } from "shader-composer-toybox"

export type ModuleState = {
  position: Input<"vec3">
  normal: Input<"vec3">
  color: Input<"vec3">
  alpha: Input<"float">
}

/**
 * A Module is a function that accepts a module state as its input and returns a new module state.
 */
export type Module = (state: ModuleState) => ModuleState

/**
 * A Module Factory is a function that returns a Module.
 */
export type ModuleFactory<P extends ModuleFactoryProps = {}> = (
  props: P
) => Module

export type ModuleFactoryProps = Record<string, any>

/**
 * A Module Pipe is an array of Modules.
 */
export type ModulePipe = Module[]

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

type RotateProps = {
  rotation: Input<"mat3">
}

export const Rotate = ({ rotation }: RotateProps): Module => (state) => ({
  ...state,
  position: Mul(state.position, rotation)
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

export const Billboard: ModuleFactory = () => (state) => ({
  ...state,
  position: BillboardUnit(state.position)
})

export const SoftParticles: ModuleFactory<{
  softness: Input<"float">
  depthTexture: Unit<"sampler2D">
}> = ({ softness, depthTexture }) => (state) => ({
  ...state,
  alpha: Mul(state.alpha, SoftParticle(softness, state.position, depthTexture))
})

/* TODO: overriding color is very bad because it will override Lifetime's actions. Find a better solution! */
export const SetColor = ({ color }: { color: Input<"vec3"> }): Module => (
  state
) => ({
  ...state,
  color
})

export const SetAlpha = ({ alpha }: { alpha: Input<"float"> }): Module => (
  state
) => ({
  ...state,
  alpha
})

export const Module = ({ module }: { module: Module }): Module => module

export type LavaProps = {
  offset?: Input<"vec3">
  scale?: Input<"float">
  octaves?: number
  power?: Input<"float">
  color?: (heat: Input<"float">) => Unit<"vec3">
}

const LavaColors = {
  white: new Color("white"),
  yellow: new Color("yellow"),
  red: new Color("red"),
  black: new Color("black")
}

export const Lava: ModuleFactory<LavaProps> = ({
  offset = vec3(0, 0, 0),
  scale = 1,
  octaves = 5,
  power = 1,
  color = (heat) =>
    pipe(
      Vec3(LavaColors.white),
      (v) => Lerp(v, LavaColors.yellow, Smoothstep(0.4, 0.6, heat))
      // (v) => Lerp(v, LavaColors.red, Smoothstep(0.3, 0.6, heat)),
      // (v) => Lerp(v, LavaColors.black, Smoothstep(0.6, 1, heat))
    )
}) => (state) => ({
  ...state,
  color: pipe(
    VertexPosition,
    (v) => Add(v, offset),
    (v) => Mul(v, scale),
    (v) => Turbulence3D(v, octaves),
    (v) => NormalizePlusMinusOne(v),
    (v) => OneMinus(v),
    (v) => Pow(v, power),
    (v) => color(v)
  )
})

export type DistortSurfaceProps = {
  time?: Input<"float">
  frequency?: Input<"float">
  amplitude?: Input<"float">
}

export const DistortSurface: ModuleFactory<DistortSurfaceProps> = ({
  time = Time(),
  frequency = 1,
  amplitude = 1
}) => (state) => {
  const displacement = pipe(
    state.position,
    (v) => Add(v, Mul(time, frequency)),
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
