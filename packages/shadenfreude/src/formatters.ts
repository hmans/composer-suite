import { Color, Vector2, Vector3, Vector4 } from "three"

export function formatInt(n: number) {
  return Math.round(n).toString()
}

export function formatFloat(n: number) {
  const s = n.toString()
  return s.includes(".") || s.includes("e") ? s : s + ".0"
}

export function formatVec2(a: number, b: number) {
  return `vec2(${formatValue(a)}, ${formatValue(b)})`
}

export function formatVec3(a: number, b: number, c: number) {
  return `vec3(${formatValue(a)}, ${formatValue(b)}, ${formatValue(c)})`
}

export function formatVec4(a: number, b: number, c: number, d: number) {
  return `vec4(${formatValue(a)}, ${formatValue(b)}, ${formatValue(
    c
  )}, ${formatValue(d)})`
}

export function formatColor(color: Color) {
  return formatVec3(color.r, color.g, color.b)
}

export function formatValue(
  value: string | number | Color | Vector2 | Vector3 | Vector4
): string {
  if (typeof value === "string") {
    return value
  } else if (typeof value === "number") {
    return formatFloat(value)
  } else if (value instanceof Color) {
    return formatColor(value)
  } else if (value instanceof Vector2) {
    return formatVec2(value.x, value.y)
  } else if (value instanceof Vector3) {
    return formatVec3(value.x, value.y, value.z)
  } else if (value instanceof Vector4) {
    return formatVec4(value.x, value.y, value.z, value.w)
  } else {
    throw new Error(`Could not render value to a GLSL representation: ${value}`)
  }
}
