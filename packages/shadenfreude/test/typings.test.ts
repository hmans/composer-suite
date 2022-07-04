import { Color, Vector3 } from "three"
import {
  AddNode,
  Factory,
  float,
  FloatNode,
  getValueType,
  MixNode,
  set,
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
      inputs: { foo: float() },
      outputs: { foo: float() }
    })

    node.inputs.foo
    node.outputs.foo
  })

  test("directly assigning JS values", () => {
    ShaderNode({
      inputs: { foo: vec3(new Vector3()) }
    })

    ShaderNode({
      inputs: { foo: vec3(new Color()) }
    })
  })

  test("assigning variables", () => {
    const a = FloatNode({ a: 1 })
    const b = FloatNode({ a: 2 })

    AddNode({
      a,
      b
    })

    MixNode({
      a,
      b,
      factor: float(0.5)
    })
  })

  test("assigning nodes", () => {
    const f1 = FloatNode({ a: 1 })
    const f2 = FloatNode({ a: 2 })

    const added = AddNode({
      a: f1,
      b: f2
    })

    set(added.inputs.a).to(123)
  })

  test("factories", () => {
    const TestNode = Factory(() => ({
      inputs: { foo: float() }
    }))

    const test1 = TestNode({ foo: 123 })
  })
})
