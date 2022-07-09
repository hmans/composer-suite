import { type } from "../glslType"
import { snippet } from "../lib/concatenator3000"
import { Float, GLSLType, Value, Variable } from "../variables"
import { VertexNormalWorld, ViewDirection } from "./geometry"

const buildMultiInputs = (values: Value[]) =>
  values.reduce((acc, v, i) => ({ ...acc, [`m_${i}`]: v }), {})

export const Operator = (title: string, operator: "+" | "-" | "*" | "/") => <
  T extends GLSLType
>(
  a: Value<T>,
  ...rest: Value[]
) => {
  const inputs = buildMultiInputs([a, ...rest])

  /* a + b + c + ... */
  const expression = Object.keys(inputs).join(operator)

  return Variable(type(a), expression, {
    title: `${title} (${type(a)})`,
    inputs
  })
}

export const Add = Operator("Add", "+")
export const Subtract = Operator("Subtract", "-")
export const Multiply = Operator("Multiply", "*")
export const Divide = Operator("Divide", "/")

export const Sin = (x: Float) => Float("sin(x)", { inputs: { x } })
export const Cos = (x: Float) => Float("cos(x)", { inputs: { x } })

export const Mix = <T extends GLSLType>(a: Value<T>, b: Value<T>, f: Float) =>
  Variable(type(a), "mix(a, b, f)", { inputs: { a, b, f } })

export type FresnelProps = {
  alpha?: Float
  bias?: Float
  intensity?: Float
  power?: Float
  factor?: Float
}

export const Fresnel = ({
  alpha = 1,
  bias = 0,
  intensity = 1,
  power = 2,
  factor = 1
}: FresnelProps = {}) =>
  Float(0, {
    inputs: {
      alpha,
      bias,
      intensity,
      power,
      factor,
      ViewDirection,
      normal: VertexNormalWorld
    },
    fragmentBody: `
      float f_a = (factor + dot(ViewDirection, normal));
      float f_fresnel = bias + intensity * pow(abs(f_a), power);
      f_fresnel = clamp(f_fresnel, 0.0, 1.0);
      value = f_fresnel;
    `
  })

export const Step = (edge: Float, v: Float) =>
  Float("step(edge, v)", { inputs: { edge, v } })

export const Smoothstep = (min: Float, max: Float, v: Float) =>
  Float("smoothstep(min, max, v)", { inputs: { min, max, v } })

const remap = snippet(
  (name) => `
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
  Variable(type(v), `${remap}(v, inMin, inMax, outMin, outMax)`, {
    inputs: { v, inMin, inMax, outMin, outMax },
    vertexHeader: [remap],
    fragmentHeader: [remap]
  })
