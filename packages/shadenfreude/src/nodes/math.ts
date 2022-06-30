import { Factory, float } from "../shadenfreude"

export const SinNode = Factory(() => ({
  name: "Sine",
  in: { value: float() },
  out: { value: float("sin(in_value)") }
}))

export const CosNode = Factory(() => ({
  name: "Cosine",
  in: { value: float() },
  out: { value: float("cos(in_value)") }
}))
