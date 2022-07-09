import { glslRepresentation } from "./glslRepresentation"
import { GLSLType, ValueFunction } from "./variables"

const collectedDependencies = new Array<any>()

export const flushDependencies = () => {
  const deps = [...collectedDependencies]
  collectedDependencies.splice(0)
  return deps
}

const zip = (a: TemplateStringsArray, b: any[]) => a.map((k, i) => [k, b[i]])

export const expr = <T extends GLSLType>(
  strings: TemplateStringsArray,
  ...values: any[]
): ValueFunction => {
  collectedDependencies.push(...values)

  return () =>
    zip(strings, values.map(glslRepresentation))
      .flat()
      .join("")
}
