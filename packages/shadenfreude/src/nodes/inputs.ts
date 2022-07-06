import idGenerator from "../lib/idGenerator"
import { GLSLType, float, variable, Value } from "../variables"

export const Uniform = (type: GLSLType, name: string) =>
  float(name, {
    title: `Uniform: ${name}`,
    vertexHeader: `uniform ${type} ${name};`,
    fragmentHeader: `uniform ${type} ${name};`
  })

export const Time = Uniform("float", "u_time")

const nextVaryingId = idGenerator()

export const Varying = <T extends GLSLType>(type: T, source: Value<T>) => {
  const varyingName = `v_${nextVaryingId()}`

  return variable(type, varyingName, {
    title: `Varying: ${varyingName}`,

    inputs: {
      source
    },

    vertexHeader: `varying ${type} ${varyingName};`,
    vertexBody: `${varyingName} = source;`,
    fragmentHeader: `varying ${type} ${varyingName};`
  })
}
