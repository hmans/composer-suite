import {
  Attribute,
  Div,
  Float,
  glslType,
  Input,
  LocalToViewSpace,
  PerspectiveDepth,
  pipe,
  Saturate,
  ScreenUV,
  SplitVector2,
  Sub,
  Unit,
  varying
} from "shader-composer"
import { Color, InstancedMesh, Vector2, Vector3, Vector4 } from "three"
import { GLSLTypeFor } from "."
import { Particles } from "../Particles"
import { makeAttribute } from "../util/makeAttribute"

export type ParticleUnits = ReturnType<typeof createParticleUnits>

export const createParticleUnits = (
  lifetime: Input<"vec2">,
  time: Input<"float">
) => {
  const [StartTime, EndTime] = SplitVector2(lifetime)
  const MaxAge = Sub(EndTime, StartTime)
  const Age = Sub(time, StartTime)
  const Progress = Div(Age, MaxAge)

  return {
    Age,
    MaxAge,
    StartTime,
    EndTime,
    Progress
  }
}

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

export const SoftParticle = (
  softness: Input<"float">,
  position: Input<"vec3">,
  depthTexture: Unit<"sampler2D">
) => {
  return Float(
    pipe(
      position,
      /* Convert position to view space and grab depth */
      (v) => varying(LocalToViewSpace(v).z),
      /* Subtract from the existing scene depth at the fragment coordinate */
      (v) => Sub(v, PerspectiveDepth(ScreenUV, depthTexture)),
      /* Divide by softness factor */
      (v) => Div(v, softness),
      /* Clamp between 0 and 1 */
      (v) => Saturate(v)
    ),

    { name: "Soft Particle" }
  )
}
