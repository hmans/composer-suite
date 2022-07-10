import { Color, Vector2, Vector3, Vector4 } from "three"
import { isExpression } from "./expressions"
import { isSnippet } from "./lib/concatenator3000"
import { isNode, Value } from "./tree"

export const glslRepresentation = (value: Value): string => {
  if (isNode(value)) return value._config.slug
  if (isExpression(value)) return value.render()
  if (isSnippet(value)) return value.name

  if (typeof value === "string") return value

  if (typeof value === "boolean") return value ? "true" : "false"

  if (typeof value === "number") {
    const s = value.toString()
    return s.match(/[.e]/) ? s : `${s}.0`
  }

  if (value instanceof Color)
    return `
      vec3(
        ${glslRepresentation(value.r)},
        ${glslRepresentation(value.g)},
        ${glslRepresentation(value.b)}
      )`

  if (value instanceof Vector2)
    return `
      vec2(
        ${glslRepresentation(value.x)},
        ${glslRepresentation(value.y)}
      )`

  if (value instanceof Vector3)
    return `
      vec3(
        ${glslRepresentation(value.x)},
        ${glslRepresentation(value.y)},
        ${glslRepresentation(value.z)}
      )`

  if (value instanceof Vector4)
    return `
      vec4(
        ${glslRepresentation(value.x)},
        ${glslRepresentation(value.y)},
        ${glslRepresentation(value.z)}
        ${glslRepresentation(value.w)}
      )`

  /* TODO: Matrix3 */

  /* TODO: Matrix4 */

  /* Fail */
  throw new Error(`Could not render value to GLSL: ${value}`)
}
