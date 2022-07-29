import {
  $,
  Add,
  Input,
  InstanceMatrix,
  Mat3,
  Mul,
  pipe,
  Pow,
  Value,
  Vec3,
  VertexPosition
} from "shader-composer"
import { Color, Vector3 } from "three"
import { ParticleAge, ParticleAttribute, ParticleProgress } from "./units"

export type ModulePayload = {
  position: Value<"vec3">
  color: Value<"vec3">
  alpha: Value<"float">
}

export type Module = (input: ModulePayload) => ModulePayload

export const modularPipe = (...modules: Module[]) =>
  pipe(
    {
      color: new Color("red"),
      position: VertexPosition,
      alpha: 1
    },
    ...(modules as [Module])
  )

export const LifetimeModule = () => (color: Input<"vec3">) =>
  Vec3(color, {
    fragment: {
      body: $`if (${ParticleProgress} < 0.0 || ${ParticleProgress} > 1.0) discard;`
    }
  })

export const VelocityModule = (velocity: Input<"vec3"> | (() => Vector3)) => (
  position: Input<"vec3">
) =>
  pipe(
    typeof velocity === "function"
      ? ParticleAttribute("vec3", velocity)
      : velocity,
    (v) => Mul(v, $`mat3(${InstanceMatrix})`),
    (v) => Mul(v, ParticleAge),
    (v) => Add(position, v)
  )

export const AccelerationModule = (acceleration: Value<"vec3">): Module => ({
  position,
  color,
  alpha
}) => ({
  color,
  alpha,
  position: pipe(
    acceleration,
    (v) => Mul(v, Mat3($`mat3(${InstanceMatrix})`)),
    (v) => Mul(v, Pow(ParticleAge, 2)),
    (v) => Mul(v, 0.5),
    (v) => Add(position, v)
  )
})

export const ScaleModule = (scale: Input<"float"> = 1) => (
  position: Input<"vec3">
) => Mul(position, scale)

export const OffsetModule = (offset: Input<"vec3">) => (
  position: Input<"vec3">
) => Add(position, Mul(offset, $`mat3(${InstanceMatrix})`))
