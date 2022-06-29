import { GLSLType, Program, Variables } from "./types"
import { Variable } from "./Variable"

type Outputs<T extends GLSLType | undefined> = T extends GLSLType
  ? Variables & { value: Variable<T> }
  : Variables

export abstract class ShaderNode<T extends GLSLType | undefined> {
  name: string = "Unnamed Shader Node"

  vertex: Program = {}
  fragment: Program = {}

  inputs: Variables = {}

  abstract outputs: Outputs<T>
}

export abstract class RootNode extends ShaderNode<undefined> {
  outputs: Outputs<undefined> = {}
}
