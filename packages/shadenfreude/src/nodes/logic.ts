import { code } from "../expressions"
import { type } from "../glslType"
import { GLSLType, Node, Value } from "../tree"

export const If = <T extends GLSLType>(
  expression: Value<"bool">,
  then: Value<T>,
  else_: Value<T>
) => Node(type(then), code`(${expression} ? ${then} : ${else_})`)
