import { code } from "../expressions"
import { Bool, GLSLType, Node } from "../tree"

export const Uniform = <T extends GLSLType>(type: T, name: string) =>
  Node<T>(type, code`${name}`, {
    name: `Uniform: ${name}`,
    vertexHeader: `uniform ${type} ${name};`,
    fragmentHeader: `uniform ${type} ${name};`
  })

export const Time = Uniform("float", "u_time")

export const Resolution = Uniform("vec2", "u_resolution")

const Attribute = <T extends GLSLType>(type: T, name: string) =>
  Node(type, code`${name}`, { varying: true })
