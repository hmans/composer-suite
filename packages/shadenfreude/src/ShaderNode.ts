import { GLSLType, Program, Variables } from "./types"
import { Variable } from "./Variable"

type Outputs<T extends GLSLType | undefined> = T extends GLSLType
  ? Variables & { value: Variable<T> }
  : Variables

export abstract class ShaderNode<T extends GLSLType | undefined = undefined> {
  name: string = "Unnamed Shader Node"

  vertex: Program = {}
  fragment: Program = {}

  inputs: Variables = {}

  abstract outputs: Outputs<T>

  /** Return this node's immediate dependencies. */
  getDependencies() {
    const dependencies = new Set<ShaderNode<GLSLType>>()
    for (const input of Object.values(this.inputs)) {
      if (input.value instanceof ShaderNode) {
        dependencies.add(input.value)
      } else if (input.value instanceof Variable) {
        // TODO: look up the variable's dependencies
        // dependencies.add(input.value)
      }
    }

    return dependencies
  }
}

export abstract class RootNode extends ShaderNode<undefined> {
  outputs: Outputs<undefined> = {}
}
