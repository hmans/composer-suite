import { Color, Vector3 } from "three"
import {
  AddNode,
  assign,
  float,
  FloatNode,
  getValueType,
  MixNode,
  ShaderNode,
  variable,
  vec3
} from "../src"

describe("typings", () => {
  test("creating simple nodes", () => {
    ShaderNode({
      name: "I'm a dummy"
    })
  })

  test("creating variables", () => {
    const f = variable("float", 123)
  })

  test("getValue", () => {
    expect(getValueType(1)).toBe("float")
    expect(getValueType(new Color())).toBe("vec3")
  })

  test("accessing variables", () => {
    const node = ShaderNode({
      in: { foo: float() },
      out: { foo: float() }
    })

    node.in.foo
    node.out.foo
  })

  test("directly assigning JS values", () => {
    ShaderNode({
      in: { foo: vec3(new Vector3()) }
    })

    ShaderNode({
      in: { foo: vec3(new Color()) }
    })
  })

  test("assigning variables", () => {
    const a = FloatNode({ value: 1 })
    const b = FloatNode({ value: 2 })

    AddNode({
      a,
      b
    })

    MixNode({
      a,
      b,
      amount: float(0.5)
    })
  })

  test("assigning nodes", () => {
    const f1 = FloatNode({ value: 1 })
    const f2 = FloatNode({ value: 2 })

    const added = AddNode({
      a: f1,
      b: f2
    })

    assign(123).to(added.in.a)
  })
})
