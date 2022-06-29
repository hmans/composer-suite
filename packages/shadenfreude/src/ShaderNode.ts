import { GLSLType, Program, Variables } from "./types"
import { Value, Variable } from "./Variable"

type Outputs<T extends GLSLType | undefined> = T extends GLSLType
  ? Variables & { value: Variable<T> }
  : Variables

export abstract class ShaderNode<T extends GLSLType | undefined = any> {
  name: string = "Unnamed Shader Node"
  slug: string = this.name
    .replace(/[^a-zA-Z0-9_]/g, "_")
    .replace(/_{2,}/g, "_")
    .toLowerCase()

  vertex: Program = {}
  fragment: Program = {}

  inputs: Variables = {}

  abstract outputs: Outputs<T>

  /** Return this node's immediate dependencies. */
  getDependencies() {
    const dependencies = new Set<ShaderNode<GLSLType>>()

    for (const input of Object.values(this.inputs)) {
      if (input.value instanceof Variable) {
        dependencies.add(input.value.node)
      }
    }

    return [...dependencies]
  }

  variable<T extends GLSLType>(type: T, value?: Value<T>): Variable<T> {
    const variable = new Variable(this, type, value)
    return variable
  }

  float(value?: Value<"float">): Variable<"float"> {
    return this.variable("float", value)
  }
}

export abstract class RootNode extends ShaderNode<undefined> {
  outputs: Outputs<undefined> = {}
}
