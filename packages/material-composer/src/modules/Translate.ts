import { $, Add, Input, pipe, Vec3 } from "shader-composer"
import { ModuleFactory } from ".."

export type Space = "world" | "local" | "view"

type TranslateProps = {
  /** The offset to apply. */
  offset: Input<"vec3">

  /** The offset vector's reference space. (Default: world) */
  space?: Space
}

/* TODO: extract into Shader Composer! */
const conditionalInstanceMatrix = $`
  #ifdef USE_INSTANCING
  * instanceMatrix
  #endif
`

const convertToLocal = (v: Input<"vec3">, space: Space) =>
  space === "world"
    ? Vec3($`vec3(vec4(${v}, 1.0) * modelMatrix ${conditionalInstanceMatrix})`)
    : space === "view"
    ? Vec3(
        $`vec3(vec4(${v}, 1.0) * viewMatrix * modelMatrix ${conditionalInstanceMatrix})`
      )
    : v

/**
 * Applies an offset to the vertex position. The user is expected to provide
 * the offset in the intended space; no further transformation is performed.
 */
export const Translate: ModuleFactory<TranslateProps> = ({
  offset,
  space = "world"
}) => (state) => ({
  ...state,
  position: pipe(
    offset,
    (v) => convertToLocal(v, space),
    (v) => Add(state.position, v)
  )
})
