import { Bool, Float, GLSLType, Variable } from "../variables"

export const Uniform = <T extends GLSLType>(type: T, name: string) =>
  Variable<T>(type, name, {
    title: `Uniform: ${name}`,
    vertexHeader: `uniform ${type} ${name};`,
    fragmentHeader: `uniform ${type} ${name};`
  })

export const Sampler2D = (name: string) =>
  Bool(true, {
    title: `Sampler2D: ${name}`,
    vertexHeader: `uniform sampler2D ${name};`,
    fragmentHeader: `uniform sampler2D ${name};`
  })

export const Time = Uniform("float", "u_time")

const Attribute = <T extends GLSLType>(type: T, name: string) =>
  Variable(type, name, { varying: true })
