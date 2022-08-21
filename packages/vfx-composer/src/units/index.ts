import {
  $,
  Add,
  Attribute,
  Clamp01,
  Div,
  Float,
  glslType,
  Input,
  InstanceMatrix,
  LocalToViewSpace,
  Mul,
  PerspectiveDepth,
  pipe,
  Pow,
  Saturate,
  ScreenUV,
  Snippet,
  Sub,
  Unit,
  varying,
  vec3,
  Vec3,
  ViewMatrix
} from "shader-composer"
import { Turbulence3D } from "shader-composer-toybox"
import { Color, InstancedMesh, Vector2, Vector3, Vector4 } from "three"
import { Particles } from "../Particles"
import { makeAttribute } from "../util/makeAttribute"

export * from "./particles"

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
  Vec3($`${billboard}(${position}.xy, ${ViewMatrix} * ${InstanceMatrix})`)

export const Random = (n: Input<"float">) =>
  Float($`fract(sin(${n}) * 1e4)`, { name: "Random1" })

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

export type HeatOptions = {
  offset?: Input<"vec3" | "float">
  scale?: Input<"float">
  octaves?: number
  power?: Input<"float">
}
export const Heat = (
  v: Input<"vec3">,
  { offset = vec3(0, 0, 0), scale = 1, octaves = 5, power = 1 }: HeatOptions
) =>
  pipe(
    v,
    (v) => Add(v, offset),
    (v) => Mul(v, scale),
    (v) => Turbulence3D(v, octaves),
    (v) => Add(v, 0.5),
    (v) => Clamp01(v),
    (v) => Pow(v, power)
  )
