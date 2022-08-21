import { Color, Vector2, Vector3, Vector4 } from "three"

export * from "./billboard"
export * from "./experiments"
export * from "./softness"

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
