import {
  $,
  Add,
  InstanceMatrix,
  Mat3,
  Mul,
  pipe,
  Value,
  Vec3
} from "shader-composer"
import { ParticleAge, ParticleProgress } from "./units"

export type ModulePayload = {
  position: Value<"vec3">
  color: Value<"vec3">
}

export type Module = (input: ModulePayload) => ModulePayload

export const LifetimeModule = (): Module => ({ position, color }) => ({
  position,
  color: Vec3(color, {
    fragment: {
      body: $`if (${ParticleProgress} < 0.0 || ${ParticleProgress} > 1.0) discard;`
    }
  })
})

export const VelocityModule = (velocity: Value<"vec3">): Module => ({
  position,
  color
}) => ({
  /* This module doesn't touch color... */
  color,

  /* ...but it does update position */
  position: pipe(
    velocity,
    (v) => Mul(v, Mat3($`mat3(${InstanceMatrix})`)),
    (v) => Mul(v, ParticleAge),
    (v) => Add(position, v)
  )
})

export const ScaleModule = (scale: Value<"float"> = 1): Module => ({
  position,
  color
}) => ({ color, position: Mul(position, scale) })
