import {
  $,
  Attribute,
  Div,
  Float,
  GLSLType,
  Input,
  isUnit,
  JSTypes,
  Snippet,
  SplitVector2,
  Sub,
  Uniform,
  Unit,
  Vec3,
  ViewMatrix
} from "shader-composer"
import { InstancedMesh, Vector2, Vector3, Vector4 } from "three"
import { makeAttribute } from "./util/makeAttribute"

export type MeshSetupCallback = (mesh: InstancedMesh) => void

export type ParticleAttribute<T extends GLSLType> = Unit<T> & {
  isParticleAttribute: true
  setupMesh: MeshSetupCallback
  setupParticle: (
    mesh: InstancedMesh,
    index: number,
    getParticleValue: () => JSTypes[T]
  ) => void
}

let nextAttributeId = 1

export const ParticleAttribute = <T extends GLSLType>(
  type: T
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

    setupParticle: (
      { geometry }: InstancedMesh,
      index: number,
      getParticleValue: () => JSTypes[T]
    ) => {
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

export const billboard = Snippet(
  (name) => $`
    vec3 ${name}(vec2 v, mat4 view){
      vec3 up = vec3(view[0][1], view[1][1], view[2][1]);
      vec3 right = vec3(view[0][0], view[1][0], view[2][0]);
      vec3 p = right * v.x + up * v.y;
      return p;
    }
  `
)

export const Billboard = (position: Input<"vec3">) =>
  Vec3($`${billboard}(${position}.xy, viewMatrix)`)

export const Random = (n: Input<"float">) =>
  Float($`fract(sin(${n}) * 1e4)`, { name: "Random1" })
