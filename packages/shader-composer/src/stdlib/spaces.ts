import { $ } from "../expressions"
import { Input } from "../units"
import { ModelMatrix, ViewMatrix } from "./geometry"
import { Vec3 } from "./values"

// "Note that modelViewMatrix is not set when rendering an instanced model"
// https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram
export const localToViewSpace = (v: Input<"vec3">) => $`
  vec3(
    ${ViewMatrix} *
    ${ModelMatrix} *
    #ifdef USE_INSTANCING
    instanceMatrix *
    #endif
    vec4(${v}, 1.0)
  )
`

export const localToWorldSpace = (v: Input<"vec3">) => $`
  vec3(
    ${ModelMatrix} *
    #ifdef USE_INSTANCING
    instanceMatrix *
    #endif
    vec4(${v}, 1.0)
  )
`

/**
 * Converts the given position vector (which is assumed to be in local space)
 * to view space.
 */
export const LocalToViewSpace = (position: Input<"vec3">) =>
  Vec3(localToViewSpace(position))

/**
 * Converts the given position vector (which is assumed to be in local space)
 * to world space.
 */
export const LocalToWorldSpace = (position: Input<"vec3">) =>
  Vec3(localToWorldSpace(position))
