import { glslRepresentation } from "./glslRepresentation"

export type Expression = {
  _: "Expression"
  values: any[]
  render: () => string
}

const zip = (a: TemplateStringsArray, b: any[]) => a.map((k, i) => [k, b[i]])

export const expr = (
  strings: TemplateStringsArray,
  ...values: any[]
): Expression => ({
  _: "Expression",

  values,

  render: () =>
    zip(strings, values.map(glslRepresentation))
      .flat()
      .join("")
})

export function isExpression(v: any): v is Expression {
  return v && v._ === "Expression"
}
