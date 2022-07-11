import { code } from "../expressions"
import { type } from "../glslType"
import { snippet } from "../lib/concatenator3000"
import { Float, GLSLType, Node, Value } from "../tree"
import { VertexNormalWorld, ViewDirection } from "./geometry"

export const Operator = (title: string, operator: "+" | "-" | "*" | "/") => <
  T extends GLSLType
>(
  a: Value<T>,
  b: Value<any>
) => {
  return Node(type(a), code`${a} ${operator} ${b}`, {
    name: `${title} (${type(a)})`
  })
}

export const Add = Operator("Add", "+")
export const Subtract = Operator("Subtract", "-")
export const Multiply = Operator("Multiply", "*")
export const Divide = Operator("Divide", "/")

export const Sub = Subtract
export const Mul = Multiply
export const Div = Divide

export const Sin = (x: Value<"float">) => Float(code`sin(${x})`)
export const Cos = (x: Value<"float">) => Float(code`cos(${x})`)
export const Pow = (x: Value<"float">, y: Value<"float">) =>
  Float(code`pow(${x}, ${y})`)

export const Clamp = <T extends GLSLType>(
  x: Value<T>,
  min: Value<T>,
  max: Value<T>
) => Node(type(x), code`clamp(${x}, ${min}, ${max})`)

export const Clamp01 = (x: Value<"float">) => Clamp(x, 0, 1)

export const Mix = <T extends GLSLType>(
  a: Value<T>,
  b: Value<T>,
  f: Value<"float">
) => Node(type(a), code`mix(${a}, ${b}, ${f})`)

export type FresnelProps = {
  alpha?: Value<"float">
  bias?: Value<"float">
  intensity?: Value<"float">
  power?: Value<"float">
  factor?: Value<"float">
}

export const Fresnel = ({
  bias = 0,
  intensity = 1,
  power = 2,
  factor = 1
}: FresnelProps = {}) =>
  Float(0, {
    fragmentBody: code`
      float f_a = (${factor} + dot(${ViewDirection}, ${VertexNormalWorld}));
      float f_fresnel = ${bias} + ${intensity} * pow(abs(f_a), ${power});
      f_fresnel = clamp(f_fresnel, 0.0, 1.0);
      value = f_fresnel;
    `
  })

export const Step = (edge: Value<"float">, v: Value<"float">) =>
  Float(code`step(${edge}, ${v})`)

export const Smoothstep = (
  min: Value<"float">,
  max: Value<"float">,
  v: Value<"float">
) => Float(code`smoothstep(${min}, ${max}, ${v})`)

const remap = snippet(
  (name) => /*glsl*/ `
    float ${name}(float value, float inMin, float inMax, float outMin, float outMax) {
      return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
    }

    vec2 ${name}(vec2 value, vec2 inMin, vec2 inMax, vec2 outMin, vec2 outMax) {
      return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
    }

    vec3 ${name}(vec3 value, vec3 inMin, vec3 inMax, vec3 outMin, vec3 outMax) {
      return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
    }

    vec4 ${name}(vec4 value, vec4 inMin, vec4 inMax, vec4 outMin, vec4 outMax) {
      return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
    }`
)

export const Remap = <T extends "float" | "vec2" | "vec3" | "vec4">(
  v: Value<T>,
  inMin: Value<T>,
  inMax: Value<T>,
  outMin: Value<T>,
  outMax: Value<T>
) =>
  Node(type(v), code`${remap}(${v}, ${inMin}, ${inMax}, ${outMin}, ${outMax})`)
