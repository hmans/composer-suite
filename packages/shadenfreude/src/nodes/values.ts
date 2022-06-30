import { Factory, float, vec3 } from "../shadenfreude"

export const FloatNode = Factory(() => ({
  name: "Float Value",
  in: {
    value: float()
  },
  out: {
    value: float("in_value")
  }
}))

export const Vector3Node = Factory(() => ({
  name: "Vector3 Value",
  in: {
    value: vec3()
  },
  out: {
    value: vec3("in_value")
  }
}))
