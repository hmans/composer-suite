import { Attribute, glslType, GLSLTypeFor, Input } from "shader-composer"
import { Color, Vector2, Vector3, Vector4 } from "three"
import { InstancedParticles } from "./InstancedParticles"
import { makeAttribute } from "./util/makeAttribute"

export type ParticleAttribute = ReturnType<typeof ParticleAttribute>

/* TODO: move this into Shader Composer */
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

  /* Determine item size in buffer from type */
  const itemSize =
    type === "float" ? 1 : type === "vec2" ? 2 : type === "vec3" ? 3 : 4

  return {
    ...Attribute<T>(type, name),

    write: (mesh: InstancedParticles, getValue: J | ((value: J) => J)) => {
      /* Execute the user-provided value getter. */
      const v = typeof getValue === "function" ? getValue(value) : getValue

      /* Write the value to the attribute. */
      const attribute = getAttribute(mesh, name, itemSize)
      if (typeof v === "number") {
        attribute.setX(mesh.cursor, v)
      } else if (v instanceof Vector2) {
        attribute.setXY(mesh.cursor, v.x, v.y)
      } else if (v instanceof Vector3) {
        attribute.setXYZ(mesh.cursor, v.x, v.y, v.z)
      } else if (v instanceof Color) {
        attribute.setXYZ(mesh.cursor, v.r, v.g, v.b)
      } else if (v instanceof Vector4) {
        attribute.setXYZW(mesh.cursor, v.x, v.y, v.z, v.w)
      }
    }
  }
}

const getAttribute = (
  mesh: InstancedParticles,
  name: string,
  itemSize: number
) => {
  /* Check if the attribute exists. If it doesn't, create it. */
  if (!mesh.geometry.attributes[name]) {
    mesh.geometry.setAttribute(
      name,
      makeAttribute(mesh.capacity + mesh.safetyCapacity, itemSize)
    )
  }

  /* Return the attribute. */
  return mesh.geometry.attributes[name]
}
