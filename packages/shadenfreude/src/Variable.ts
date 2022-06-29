import { GLSLChunk } from "three-vfx"
import { ShaderNode } from "./ShaderNode"
import { GLSLtoJSType, GLSLType } from "./types"

export type Value<T extends GLSLType> =
  | GLSLtoJSType<T>
  | Variable<T>
  | ShaderNode<T>
  | GLSLChunk

export class Variable<T extends GLSLType = any> {
  node: ShaderNode
  type: T
  value?: Value<T>
  globalName: string

  constructor(node: ShaderNode, type: T, value?: Value<T>) {
    this.node = node
    this.type = type
    this.value = value
    this.globalName = `var_${Math.floor(Math.random() * 1000000)}`
  }

  set(value: Value<T>) {
    this.value = value
  }
}
