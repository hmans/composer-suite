import {
  Attribute,
  Div,
  Float,
  GLSLType,
  isUnit,
  JSTypes,
  SplitVector2,
  Sub,
  Uniform,
  Unit
} from "shader-composer"
import { InstancedMesh, Vector2, Vector3, Vector4 } from "three"
import { makeAttribute } from "./util/makeAttribute"

export type MeshSetupCallback = (mesh: InstancedMesh) => void

export type ParticleAttribute<T extends GLSLType> = Unit<T> & {
  isParticleAttribute: true
  setupMesh: MeshSetupCallback
  setupParticle: (mesh: InstancedMesh, index: number) => void
}

let nextAttributeId = 1

export const ParticleAttribute = <T extends GLSLType>(
  type: T,
  getParticleValue: () => JSTypes[T]
): ParticleAttribute<T> => {
  const name = `a_particle_${nextAttributeId++}`

  return {
    ...Attribute(type, name),
    isParticleAttribute: true,

    setupMesh: ({ geometry, count }: InstancedMesh) => {
      const itemSize =
        type === "float"
          ? 1
          : type === "vec2"
          ? 2
          : type === "vec3"
          ? 3
          : type === "vec4"
          ? 4
          : 4

      geometry.setAttribute(name, makeAttribute(count, itemSize))
    },

    setupParticle: ({ geometry }: InstancedMesh, index: number) => {
      const value = getParticleValue()
      const attribute = geometry.attributes[name]

      switch (type) {
        case "float": {
          attribute.setX(index, value as number)
          break
        }

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
  }
}

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
