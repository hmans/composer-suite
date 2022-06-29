import { GLSLType, Program, ProgramType, Variables } from "./types"
import { Variable } from "./Variable"

export abstract class ShaderNode<T extends GLSLType> {
  constructor(public type: T) {
    this.outputs = { value: new Variable<T>(type) }
  }

  name: string = "Unnamed Shader Node"

  vertex: Program = {}
  fragment: Program = {}

  inputs: Variables = {}

  outputs: Variables & { value: Variable<T> }
}
