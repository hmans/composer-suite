import { code } from "../expressions"
import { type } from "../glslType"
import { Bool, GLSLType, Node, Value } from "../tree"

export const If = <T extends GLSLType>(
  expression: Value<"bool">,
  then: Value<T>,
  else_: Value<T>
) => Node(type(then) as T, code`(${expression} ? ${then} : ${else_})`)

export const GreaterOrEqual = <T extends GLSLType>(a: Value<T>, b: Value<T>) =>
  Bool(code`(${a} >= ${b})`)
