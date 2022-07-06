import { Color, Vector3 } from "three"
import { isVariable, Value } from "./variables"

export const glslRepresentation = (value: Value): string => {
  if (isVariable(value)) return value.name

  if (typeof value === "string") return value

  if (typeof value === "boolean") return value ? "true" : "false"

  if (typeof value === "number") return value.toFixed(5)

  if (value instanceof Color)
    return `vec3(${glslRepresentation(value.r)}, ${glslRepresentation(
      value.g
    )}, ${glslRepresentation(value.b)})`

  if (value instanceof Vector3)
    return `vec3(${glslRepresentation(value.x)}, ${glslRepresentation(
      value.y
    )}, ${glslRepresentation(value.z)})`

  /* Fail */
  throw new Error(`Could not render value to GLSL: ${value}`)
}
