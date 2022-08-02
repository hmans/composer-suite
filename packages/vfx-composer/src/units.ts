import {
  $,
  Attribute,
  Float,
  glslType,
  Input,
  Snippet,
  Vec3
} from "shader-composer"
import { Color, InstancedMesh, Vector2, Vector3, Vector4 } from "three"
import { Particles } from "./Particles"
import { makeAttribute } from "./util/makeAttribute"

/* TODO: promote this into Shader Composer */
type GLSLTypeFor<J> = J extends number
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

let nextAttributeId = 1

export type ParticleAttribute = ReturnType<typeof ParticleAttribute>

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

    get value() {
      return value
    },

    set value(v: J) {
      value = v
    },

    setupParticle: ({ geometry, cursor }: Particles) => {
      const attribute = geometry.attributes[name]

      switch (type) {
        case "float": {
          attribute.setX(cursor, value as number)
          break
        }

        case "vec2": {
          attribute.setXY(cursor, (value as Vector2).x, (value as Vector2).y)
          break
        }

        case "vec3": {
          attribute.setXYZ(
            cursor,
            (value as Vector3).x,
            (value as Vector3).y,
            (value as Vector3).z
          )
          break
        }

        case "vec4": {
          attribute.setXYZW(
            cursor,
            (value as Vector4).x,
            (value as Vector4).y,
            (value as Vector4).z,
            (value as Vector4).w
          )
          break
        }
      }

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
