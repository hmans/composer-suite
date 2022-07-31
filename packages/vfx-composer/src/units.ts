import {
  $,
  Attribute,
  Float,
  GLSLType,
  Input,
  JSTypes,
  Snippet,
  Vec3
} from "shader-composer"
import { InstancedMesh, Vector2, Vector3, Vector4 } from "three"
import { Particles } from "./Particles"
import { makeAttribute } from "./util/makeAttribute"

let nextAttributeId = 1

export const ParticleAttribute = <T extends GLSLType, J extends JSTypes[T]>(
  type: T,
  initValue: () => J
) => {
  const name = `a_particle_${nextAttributeId++}`

  let value = initValue()

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
      { geometry, cursor }: Particles,
      setup?: (v: J) => void
    ) => {
      setup?.(value)

      const attribute = geometry.attributes[name]

      switch (type) {
        case "float": {
          attribute.setX(cursor, value as number)
          break
        }

        case "vec2": {
          attribute.setXY(cursor, ...(value as Vector2).toArray())
          break
        }

        case "vec3": {
          attribute.setXYZ(cursor, ...(value as Vector3).toArray())
          break
        }

        case "vec4": {
          attribute.setXYZW(cursor, ...(value as Vector4).toArray())
          break
        }
      }

      /* TODO: only do partial uploads */
      attribute.needsUpdate = true
    }
  }
}

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
  Vec3($`${billboard}(${position}.xy, viewMatrix * instanceMatrix)`)

export const Random = (n: Input<"float">) =>
  Float($`fract(sin(${n}) * 1e4)`, { name: "Random1" })
