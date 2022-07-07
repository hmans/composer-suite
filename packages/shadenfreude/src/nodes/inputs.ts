import idGenerator from "../lib/idGenerator"
import { GLSLType, Float, Variable, Value } from "../variables"

export const Uniform = (type: GLSLType, name: string) =>
  Float(name, {
    title: `Uniform: ${name}`,
    vertexHeader: `uniform ${type} ${name};`,
    fragmentHeader: `uniform ${type} ${name};`
  })

export const Time = Uniform("float", "u_time")

const nextVaryingId = idGenerator()

export const Varying = <T extends GLSLType>(type: T, source: Value<T>) => {
  const varyingName = `v_${nextVaryingId()}`

  return Variable(type, varyingName, {
    title: `Varying: ${varyingName}`,

    inputs: {
      source
    },

    vertexHeader: `varying ${type} ${varyingName};`,
    vertexBody: `value = ${varyingName} = source;`,
    fragmentHeader: `varying ${type} ${varyingName};`
  })
}

// const Attribute = <T extends GLSLType>(type: T, name: string) =>
//   variable(type, name, { only: "vertex" })
