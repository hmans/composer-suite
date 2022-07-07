import { Color, Matrix3, Matrix4, Vector2, Vector3, Vector4 } from "three"
import { glslRepresentation } from "./glslRepresentation"
import { type } from "./glslType"
import { identifier } from "./lib/concatenator3000"
import idGenerator from "./lib/idGenerator"

export type GLSLType =
  | "bool"
  | "float"
  | "vec2"
  | "vec3"
  | "vec4"
  | "mat3"
  | "mat4"

export type JSTypes = {
  bool: boolean
  float: number
  vec2: Vector2
  vec3: Vector3 | Color
  vec4: Vector4
  mat3: Matrix3
  mat4: Matrix4
}

export type Value<T extends GLSLType = any> = string | JSTypes[T] | Variable<T>

export type Variable<T extends GLSLType = any> = {
  _: "Variable"
  id: number
  title: string
  name: string
  type: T
  value: Value<T>
  inputs: Record<string, Value>
  only?: "vertex" | "fragment"
  vertexHeader?: string
  vertexBody?: string
  fragmentHeader?: string
  fragmentBody?: string

  /*
  Some convenient helpers to directly apply math operations to variables.
  Do these increase complexity too much for some cute glue? Maybe, maybe not.
  */
  Add: (...operands: Value[]) => Variable<T>
  Subtract: (...operands: Value[]) => Variable<T>
  Multiply: (...operands: Value[]) => Variable<T>
  Divide: (...operands: Value[]) => Variable<T>
}

const nextAnonymousId = idGenerator()

const buildMultiInputs = (values: Value[]) =>
  values.reduce((acc, v, i) => ({ ...acc, [`m_${i}`]: v }), {})

export const variable = <T extends GLSLType>(
  type: T,
  value: Value<T>,
  extras: Partial<Variable<T>> = {}
) => {
  const id = nextAnonymousId()

  const v: Variable<T> = {
    id,
    title: `Anonymous ${type} = ${glslRepresentation(value)}`,
    name: identifier("anonymous", id),
    inputs: {},
    ...extras,
    _: "Variable",
    type,
    value,

    /* Math helpers! */
    Add: (...operands: Value[]) => Add(v, ...operands),
    Subtract: (...operands: Value[]) => Subtract(v, ...operands),
    Multiply: (...operands: Value[]) => Multiply(v, ...operands),
    Divide: (...operands: Value[]) => Divide(v, ...operands)
  }

  return v
}

export function isVariable(v: any): v is Variable {
  return v && v._ === "Variable"
}

export function isType<T extends GLSLType>(v: any, t: T): v is Value<T> {
  return type(v) === t
}

/* Helpers */

const makeVariableHelper = <T extends GLSLType>(type: T) => (
  v: Value<T>,
  extras?: Partial<Variable<T>>
) => variable(type, v, extras)

export const float = makeVariableHelper("float")
export const bool = makeVariableHelper("bool")
export const vec2 = makeVariableHelper("vec2")
export const vec3 = makeVariableHelper("vec3")
export const vec4 = makeVariableHelper("vec4")
export const mat3 = makeVariableHelper("mat3")
export const mat4 = makeVariableHelper("mat4")

/*** OPERATORS ***

TODO: Move this somewhere else!

It used to be in maths.ts, which caused a circular dependency. Pretty much everything
was fine with this except for ts-jest, which objected strongly, and crashed.
*/

export const Operator = (title: string, operator: "+" | "-" | "*" | "/") => <
  T extends GLSLType
>(
  a: Value<T>,
  ...rest: Value[]
) => {
  const inputs = buildMultiInputs([a, ...rest])

  /* a + b + c + ... */
  const expression = Object.keys(inputs).join(operator)

  return variable(type(a), expression, {
    title: `${title} (${type(a)})`,
    inputs
  })
}

export const Add = Operator("Add", "+")
export const Subtract = Operator("Subtract", "-")
export const Multiply = Operator("Multiply", "*")
export const Divide = Operator("Divide", "/")
