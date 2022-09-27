import { Attribute, glslType, Input } from "shader-composer"
import { Color, Vector2, Vector3, Vector4 } from "three"
import { InstancedParticles } from "./InstancedParticles"
import { makeAttribute } from "./util/makeAttribute"

/* TODO: promote this into Shader Composer */
export type GLSLTypeFor<J> = J extends number
  ? "float"
  : J extends Vector2
  ? "vec2"
  : J extends Vector3
  ? "vec3"
  : J extends Vector4
  ? "vec4"
  : J extends Color
  ? "vec3"
  : never

export type ParticleAttribute = ReturnType<typeof ParticleAttribute>
let nextAttributeId = 1

export const ParticleAttribute = <
  J extends number | Vector2 | Vector3 | Color | Vector4,
  T extends GLSLTypeFor<J>
>(
  initialValue: J
) => {
  const name = `a_particle_${nextAttributeId++}`
  let value = initialValue
  const type = glslType(value as Input<T>)

  return {
    ...Attribute<T>(type, name),

    name,

    isParticleAttribute: true,

    setupMesh: ({ geometry, capacity, safetyCapacity }: InstancedParticles) => {
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

      geometry.setAttribute(
        name,
        makeAttribute(capacity + safetyCapacity, itemSize)
      )
    },

    get value() {
      return value
    },

    set value(v: J) {
      value = v
    },

    setupParticle: ({ geometry, cursor }: InstancedParticles) => {
      const attribute = geometry.attributes[name]

      if (typeof value === "number") {
        attribute.setX(cursor, value)
      } else if (value instanceof Vector2) {
        attribute.setXY(cursor, value.x, value.y)
      } else if (value instanceof Vector3) {
        attribute.setXYZ(cursor, value.x, value.y, value.z)
      } else if (value instanceof Color) {
        attribute.setXYZ(cursor, value.r, value.g, value.b)
      } else if (value instanceof Vector4) {
        attribute.setXYZW(cursor, value.x, value.y, value.z, value.w)
      }
    }
  }
}
