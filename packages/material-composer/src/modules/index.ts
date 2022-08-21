import {
  Add,
  Gradient,
  Input,
  Mul,
  OneMinus,
  pipe,
  Smoothstep,
  Unit
} from "shader-composer"
import { PSRDNoise3D } from "shader-composer-toybox"
import { Color } from "three"
import { Heat, HeatOptions } from "../units"

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

export * from "./Acceleration"
export * from "./Billboard"
export * from "./Particles"
export * from "./Rotate"
export * from "./Scale"
export * from "./SoftParticles"
export * from "./Translate"
export * from "./Velocity"

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
