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

  /* Create the actual attribute unit */
  const attribute = Attribute<T>(type, name)

  return {
    ...attribute,

    write: (mesh: InstancedParticles, getValue: J | ((value: J) => J)) => {
      const { geometry, cursor } = mesh

      /* Check if the geometry attribute exists on the given mesh. If not,
      create it and add it to the mesh. */
      if (!mesh.geometry.attributes[name]) {
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
          makeAttribute(mesh.capacity + mesh.safetyCapacity, itemSize)
        )
      }

      /* Execute the user-provided value getter. */
      const v = typeof getValue === "function" ? getValue(value) : getValue

      /* Write the value to the attribute. */
      const attribute = geometry.attributes[name]
      if (typeof v === "number") {
        attribute.setX(cursor, v)
      } else if (v instanceof Vector2) {
        attribute.setXY(cursor, v.x, v.y)
      } else if (v instanceof Vector3) {
        attribute.setXYZ(cursor, v.x, v.y, v.z)
      } else if (v instanceof Color) {
        attribute.setXYZ(cursor, v.r, v.g, v.b)
      } else if (v instanceof Vector4) {
        attribute.setXYZW(cursor, v.x, v.y, v.z, v.w)
      }
    }
  }
}
