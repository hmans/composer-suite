import { GLSLType, Program, ProgramType, Variables } from "./types"
import { Variable } from "./Variable"

export abstract class ShaderNode<T extends GLSLType> {
  name: string = "Unnamed Shader Node"

  vertex: Program = {}
  fragment: Program = {}

  inputs: Variables = {}

  outputs: Variables & { value: Variable<T> } = {
    value: new Variable<T>()
  }
}
