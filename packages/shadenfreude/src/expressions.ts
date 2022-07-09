import { glslRepresentation } from "./glslRepresentation"

const collectedDependencies = new Array<any>()

export const flushDependencies = () => {
  const deps = [...collectedDependencies]
  collectedDependencies.splice(0)
  return deps
}

export type Expression = {
  _: "Expression"
  values: any[]
  render: () => string
}

const zip = (a: TemplateStringsArray | any[], b: any[]) =>
  a.map((k, i) => [k, b[i]])

export const expr = (
  strings: TemplateStringsArray,
  ...values: any[]
): Expression => {
  collectedDependencies.push(...values)

  return {
    _: "Expression",

    values,

    render: () =>
      zip(strings, values.map(glslRepresentation))
        .flat()
        .join("")
  }
}
