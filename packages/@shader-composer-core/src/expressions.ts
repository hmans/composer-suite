import { glslRepresentation } from "./glslRepresentation"

const zip = (a: TemplateStringsArray, b: any[]) => a.map((k, i) => [k, b[i]])

export type Expression = {
  _: "Expression"
  values: any[]
  render: () => string
  toString: () => string
}

export const glsl = (strings: TemplateStringsArray, ...values: any[]): Expression => {
  const render = () =>
    zip(
      strings,
      values.map((v) => glslRepresentation(v))
    )
      .flat()
      .join("")

  return {
    _: "Expression",
    values,
    render,
    toString: render
  }
}

/** A shortcut for the `glsl` tagged template literal helper. */
export const $ = glsl

export function isExpression(v: any): v is Expression {
  return v && v._ === "Expression"
}
