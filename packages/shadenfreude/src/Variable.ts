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

  renderValue(): string | undefined {
    if (this.value === undefined) {
      return undefined
    } else if (typeof this.value === "number") {
      /* TODO: use the better algorithm here that maintains precision */
      return this.value.toFixed(5)
    } else if (typeof this.value === "string") {
      return this.value
    } else if (this.value instanceof Variable) {
      return this.value.renderValue()
    } else if (this.value instanceof ShaderNode) {
      return this.value.outputs.value.renderValue()
    } else {
      throw new Error("Could not render value: " + this.value)
    }
  }

  renderWithName(name: string, includeValue = true) {
    const value = includeValue ? this.renderValue() : undefined
    return `${this.type} ${name}${value ? ` = ${value}` : ""};`
  }

  render(includeValue = true) {
    return this.renderWithName(this.globalName, includeValue)
  }
}
