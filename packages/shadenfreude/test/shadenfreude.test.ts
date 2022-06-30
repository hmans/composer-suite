import { Vector3 } from "three"
import { TimeNode } from "../src"
import {
  float,
  ShaderNode,
  variable,
  compileShader,
  plug,
  Factory,
  vec3
} from "../src/shadenfreude"

describe("ShaderNode", () => {
  it("creates a shader node", () => {
    const n = ShaderNode({ name: "A Blank Shader Node" })
    expect(n).toEqual({ name: "A Blank Shader Node" })
  })

  it("assigns the node to its input and output variables", () => {
    const n = ShaderNode({
      in: { a: float() },
      out: { value: float() }
    })
    expect(n.in.a.node).toBe(n)
    expect(n.out.value.node).toBe(n)
  })

  it("assigns props when given as a second argument", () => {
    const props = { a: 1 }
    const n = ShaderNode({ in: { a: float() } }, props)
    expect(n.in.a.value).toBe(1)
  })
})

describe("Factory", () => {
  it("creates a shader node factory that can assign inputs props", () => {
    const TestNode = Factory(() => ({
      in: { a: float() }
    }))

    const node = TestNode({ a: 123 })

    expect(node.in.a.value).toBe(123)
  })
})

describe("variable", () => {
  it("creates a variable of the specified type", () => {
    const v = variable("float")
    expect(v.type).toBe("float")
    expect(v.value).toBeUndefined()
  })

  it("assigns the given value", () => {
    const v = variable("float", 123)
    expect(v.value).toBe(123)
  })
})

describe("compileShader", () => {
  it("compiles the given node into a shader", () => {
    const n = ShaderNode({
      name: "Test Node",
      in: {
        a: float(),
        vec: vec3(new Vector3(1, 2, 3))
      },
      out: {
        value: float("a * 2.0")
      }
    })
    const [c] = compileShader(n)

    expect(c.vertexShader).toMatchInlineSnapshot(`
      "

      /*** BEGIN: Test Node ***/
      /*** END: Test Node ***/

      void main()
      {
        /*** BEGIN: Test Node ***/
        float out_Test_Node_1_value;
        {
          float in_a;
          vec3 in_vec = 
              vec3(
                1.00000,
                2.00000,
                3.00000);
          float out_value = a * 2.0;
          out_Test_Node_1_value = out_value;
        }
        /*** END: Test Node ***/

      }"
    `)

    expect(c.fragmentShader).toMatchInlineSnapshot(`
      "

      /*** BEGIN: Test Node ***/
      /*** END: Test Node ***/

      void main()
      {
        /*** BEGIN: Test Node ***/
        float out_Test_Node_1_value;
        {
          float in_a;
          vec3 in_vec = 
              vec3(
                1.00000,
                2.00000,
                3.00000);
          float out_value = a * 2.0;
          out_Test_Node_1_value = out_value;
        }
        /*** END: Test Node ***/

      }"
    `)
  })
})

describe("plug", () => {
  it("connects the given variables", () => {
    const time = TimeNode()

    const offset = ShaderNode({
      in: {
        x: float()
      }
    })

    plug(time.out.value).into(offset.in.x)

    expect(offset.in.x.value).toBe(time.out.value)
  })
})
