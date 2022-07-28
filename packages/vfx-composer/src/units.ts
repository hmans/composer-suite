import {
  $,
  Add,
  Attribute,
  Div,
  Float,
  GLSLType,
  InstanceMatrix,
  isUnit,
  JSTypes,
  Mat3,
  Mul,
  pipe,
  Pow,
  SplitVector2,
  Sub,
  Uniform,
  Unit,
  Value,
  Vec3
} from "shader-composer"
import { InstancedMesh, Vector2, Vector3, Vector4 } from "three"
import { makeAttribute } from "./useParticles"

export type MeshSetupCallback = (mesh: InstancedMesh) => void

export type ParticleAttribute<T extends GLSLType> = Unit<T> & {
  isParticleAttribute: true
  setupMesh: MeshSetupCallback
  setupParticle: (mesh: InstancedMesh, index: number) => void
}

export const ParticleAttribute = <T extends GLSLType>(
  type: T,
  name: string,
  getParticleValue: () => JSTypes[T]
): ParticleAttribute<T> => ({
  ...Attribute(type, name),
  isParticleAttribute: true,

  setupMesh: ({ geometry, count }: InstancedMesh) => {
    const itemSize =
      type === "vec2" ? 2 : type === "vec3" ? 3 : type === "vec4" ? 4 : 4

    geometry.setAttribute(name, makeAttribute(count, itemSize))
  },

  setupParticle: ({ geometry }: InstancedMesh, index: number) => {
    const value = getParticleValue()
    const attribute = geometry.attributes[name]

    switch (type) {
      case "vec2": {
        attribute.setXY(index, ...(value as Vector2).toArray())
        break
      }

      case "vec3": {
        attribute.setXYZ(index, ...(value as Vector3).toArray())
        break
      }

      case "vec4": {
        attribute.setXYZW(index, ...(value as Vector4).toArray())
        break
      }
    }

    /* TODO: only do partial uploads */
    attribute.needsUpdate = true
  }
})

export function isParticleAttribute<T extends GLSLType>(
  item: Unit<T>
): item is ParticleAttribute<T> {
  return isUnit(item) && "isParticleAttribute" in item
}

export const EffectAgeUniform = Uniform("float", 0)

export const EffectAge = Float(EffectAgeUniform, {
  update: (dt) => (EffectAgeUniform.value += dt)
})

export const [LifetimeStart, LifetimeEnd] = SplitVector2(
  Attribute("vec2", "lifetime")
)

export const ParticleAge = Sub(EffectAge, LifetimeStart)
export const ParticleMaxAge = Sub(LifetimeEnd, LifetimeStart)
export const ParticleProgress = Div(ParticleAge, ParticleMaxAge)

export const AnimateScale = (scale: Value<"float"> = 1) => (
  position: Value<"vec3">
) => Mul(position, scale)

export const AnimateStatelessVelocity = (velocity: Value<"vec3">) => (
  position: Value<"vec3">
) =>
  pipe(
    velocity,
    (v) => Mul(v, Mat3($`mat3(${InstanceMatrix})`)),
    (v) => Mul(v, ParticleAge),
    (v) => Add(position, v)
  )

export const AnimateStatelessAcceleration = (acceleration: Value<"vec3">) => (
  position: Value<"vec3">
) =>
  pipe(
    acceleration,
    (v) => Mul(v, Mat3($`mat3(${InstanceMatrix})`)),
    (v) => Mul(v, Pow(ParticleAge, 2)),
    (v) => Mul(v, 0.5),
    (v) => Add(position, v)
  )

export const ControlParticleLifetime = (v: Value<"vec3">) =>
  Vec3(v, {
    fragment: {
      body: $`if (${ParticleProgress} < 0.0 || ${ParticleProgress} > 1.0) discard;`
    }
  })
