import { Color, Vector2, Vector3, Vector4 } from "three"
import { isVariable, Value } from "./variables"

export const glslRepresentation = (value: Value): string => {
  if (isVariable(value)) return value.name

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
      vec3(
        ${glslRepresentation(value.x)},
        ${glslRepresentation(value.y)},
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

  /* Fail */
  throw new Error(`Could not render value to GLSL: ${value}`)
}
