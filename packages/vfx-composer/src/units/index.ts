import {
  $,
  Add,
  Clamp01,
  Div,
  Float,
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
import { Color, Vector2, Vector3, Vector4 } from "three"

export * from "./particles"

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
