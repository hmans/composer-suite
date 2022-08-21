import {
  $,
  Add,
  Gradient,
  Input,
  InstanceMatrix,
  mat3,
  Mul,
  OneMinus,
  pipe,
  Pow,
  Smoothstep,
  Unit,
  Vec3
} from "shader-composer"
import { PSRDNoise3D } from "shader-composer-toybox"
import { Color } from "three"
import { Heat, HeatOptions, SoftParticle } from "../units"

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

export * from "./Billboard"

export const Particles: ModuleFactory<{ Progress: Input<"float"> }> = ({
  Progress
}) => (state) => ({
  ...state,
  color: Vec3(state.color, {
    fragment: {
      body: $`if (${Progress} < 0.0 || ${Progress} > 1.0) discard;`
    }
  })
})

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

export type LavaProps = HeatOptions & {
  color?: (heat: Input<"float">) => Unit<"vec3">
}

export const Lava: ModuleFactory<LavaProps> = ({
  color = (heat) =>
    Gradient(
      heat,
      [new Color("#03071E"), 0],
      [new Color("#03071E"), 0.1],
      [new Color("#DC2F02"), 0.5],
      [new Color("#E85D04"), 0.6],
      [new Color("#FFBA08").multiplyScalar(2), 0.65],
      [new Color("white").multiplyScalar(2), 0.97],
      [new Color("white").multiplyScalar(2), 0.99],
      [new Color("white").multiplyScalar(2), 1]
    ),
  ...opts
}) => (state) => {
  const heat = Heat(state.position, opts)

  return {
    ...state,
    color: color(heat)
  }
}

export type PlasmaProps = HeatOptions & {
  color?: (heat: Input<"float">) => Unit<"vec3">
}

export const Plasma: ModuleFactory<PlasmaProps> = ({
  color = (heat: Input<"float">) =>
    Gradient(
      heat,
      [new Color("#457b9d"), 0.85],
      [new Color("#a2d2ff"), 0.95],
      [new Color("white").multiplyScalar(3), 0.975]
    ),
  offset,
  scale = 0.5,
  octaves = 3,
  power = 1
}) => (state) => {
  const heat = OneMinus(Heat(state.position, { offset, scale, octaves, power }))
  const alpha = Smoothstep(0.7, 0.9, heat)

  return {
    ...state,
    alpha,
    color: color(heat)
  }
}

export type DistortSurfaceProps = {
  offset?: Input<"vec3" | "float">
  amplitude?: Input<"float">
}

export const DistortSurface: ModuleFactory<DistortSurfaceProps> = ({
  offset = 1,
  amplitude = 1
}) => (state) => {
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
