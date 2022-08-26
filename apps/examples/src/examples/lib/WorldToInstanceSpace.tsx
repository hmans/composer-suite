import { $, Input, Vec3 } from "shader-composer"

/* TODO: is this correct?! */
export const WorldToInstanceSpace = (v: Input<"vec3">) =>
  Vec3($`vec3(vec4(${v}, 1.0) * instanceMatrix)`)
