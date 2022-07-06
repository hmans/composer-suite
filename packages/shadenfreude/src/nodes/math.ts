import { float, Value } from "../variables"

export const Sin = (x: Value<"float">) => float("sin(x)", { inputs: { x } })
export const Cos = (x: Value<"float">) => float("cos(x)", { inputs: { x } })
