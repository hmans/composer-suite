import { GLSLChunk } from "three-vfx"
import { ShaderNode } from "./ShaderNode"
import { GLSLtoJSType, GLSLType } from "./types"

export type Value<T extends GLSLType> =
  | GLSLtoJSType<T>
  | Variable<T>
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

  set(value: Value<T> | { outputs: { value: Value<T> } }) {
    if (value instanceof ShaderNode) {
      this.value = value.outputs.value as Value<T>
    } else {
      this.value = value as Value<T>
    }
  }

  renderValue(): string | undefined {
    /* TODO: add support for Vector3 and other Three types */

    if (this.value === undefined) {
      return undefined
    } else if (typeof this.value === "number") {
      /* TODO: use the better algorithm here that maintains precision */
      return this.value.toFixed(5)
    } else if (typeof this.value === "string") {
      return this.value
    } else if (this.value instanceof Variable) {
      return this.value.renderValue()
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
