import { code } from "../expressions"
import { Bool, GLSLType, Node } from "../variables"

export const Uniform = <T extends GLSLType>(type: T, name: string) =>
  Node<T>(type, code`${name}`, {
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

export const Resolution = Uniform("vec2", "u_resolution")

const Attribute = <T extends GLSLType>(type: T, name: string) =>
  Node(type, code`${name}`, { varying: true })
