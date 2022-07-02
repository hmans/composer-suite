import { Vector3 } from "three"
import { AddNode, FloatNode, TimeNode } from "../src"
import {
  assign,
  compileShader,
  Factory,
  float,
  plug,
  ShaderNode,
  variable,
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

  it("allows instantiation options not connected to inputs", () => {
    const UniformNode = Factory(({ name, type }) => ({
      uniforms: {
        [name]: variable(type)
      },
      out: {
        value: variable(type, name)
      }
    }))

    const node = UniformNode({}, { name: "u_foo", type: "float" })

    const [c] = compileShader(node)

    expect(c.vertexShader).toMatchInlineSnapshot(`
      "/*** BEGIN: Unnamed Node ***/
      uniform float u_foo;
      /*** END: Unnamed Node ***/

      void main()
      {
        /*** BEGIN: Unnamed Node ***/
        float out_Unnamed_Node_1_value;
        {
          float out_value = u_foo;
          out_Unnamed_Node_1_value = out_value;
        }
        /*** END: Unnamed Node ***/

      }"
    `)
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
          vec3 in_vec = vec3(1.0, 2.0, 3.0);
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
          vec3 in_vec = vec3(1.0, 2.0, 3.0);
          float out_value = a * 2.0;
          out_Test_Node_1_value = out_value;
        }
        /*** END: Test Node ***/

      }"
    `)
  })

  it("creates uniforms for nodes that use them", () => {
    const node = ShaderNode({
      name: "Node referencing a uniform",
      uniforms: {
        u_time: float()
      }
    })

    const [c] = compileShader(node)

    expect(c.vertexShader).toMatchInlineSnapshot(`
      "/*** BEGIN: Node referencing a uniform ***/
      uniform float u_time;
      /*** END: Node referencing a uniform ***/

      void main()
      {
        /*** BEGIN: Node referencing a uniform ***/
        {
        }
        /*** END: Node referencing a uniform ***/

      }"
    `)

    expect(c.fragmentShader).toMatchInlineSnapshot(`
      "/*** BEGIN: Node referencing a uniform ***/
      uniform float u_time;
      /*** END: Node referencing a uniform ***/

      void main()
      {
        /*** BEGIN: Node referencing a uniform ***/
        {
        }
        /*** END: Node referencing a uniform ***/

      }"
    `)
  })

  it("makes sure uniforms are only ever declared once", () => {
    const node = ShaderNode({
      name: "A Node using two TimeNodes for some reason",
      in: {
        a: float(TimeNode()),
        b: float(TimeNode())
      }
    })

    const [c] = compileShader(node)

    expect(c.vertexShader).toMatchInlineSnapshot(`
      "/*** BEGIN: Time ***/
      uniform float u_time;
      /*** END: Time ***/

      /*** BEGIN: Time ***/
      /*** END: Time ***/

      /*** BEGIN: A Node using two TimeNodes for some reason ***/
      /*** END: A Node using two TimeNodes for some reason ***/

      void main()
      {
        /*** BEGIN: Time ***/
        float out_Time_2_value;
        float out_Time_2_sin;
        float out_Time_2_cos;
        {
          float out_value = u_time;
          float out_sin = sin(u_time);
          float out_cos = cos(u_time);
          out_Time_2_value = out_value;
          out_Time_2_sin = out_sin;
          out_Time_2_cos = out_cos;
        }
        /*** END: Time ***/

        /*** BEGIN: Time ***/
        float out_Time_3_value;
        float out_Time_3_sin;
        float out_Time_3_cos;
        {
          float out_value = u_time;
          float out_sin = sin(u_time);
          float out_cos = cos(u_time);
          out_Time_3_value = out_value;
          out_Time_3_sin = out_sin;
          out_Time_3_cos = out_cos;
        }
        /*** END: Time ***/

        /*** BEGIN: A Node using two TimeNodes for some reason ***/
        {
          float in_a = out_Time_2_value;
          float in_b = out_Time_3_value;
        }
        /*** END: A Node using two TimeNodes for some reason ***/

      }"
    `)
    expect(c.fragmentShader).toMatchInlineSnapshot(`
      "/*** BEGIN: Time ***/
      uniform float u_time;
      /*** END: Time ***/

      /*** BEGIN: Time ***/
      /*** END: Time ***/

      /*** BEGIN: A Node using two TimeNodes for some reason ***/
      /*** END: A Node using two TimeNodes for some reason ***/

      void main()
      {
        /*** BEGIN: Time ***/
        float out_Time_2_value;
        float out_Time_2_sin;
        float out_Time_2_cos;
        {
          float out_value = u_time;
          float out_sin = sin(u_time);
          float out_cos = cos(u_time);
          out_Time_2_value = out_value;
          out_Time_2_sin = out_sin;
          out_Time_2_cos = out_cos;
        }
        /*** END: Time ***/

        /*** BEGIN: Time ***/
        float out_Time_3_value;
        float out_Time_3_sin;
        float out_Time_3_cos;
        {
          float out_value = u_time;
          float out_sin = sin(u_time);
          float out_cos = cos(u_time);
          out_Time_3_value = out_value;
          out_Time_3_sin = out_sin;
          out_Time_3_cos = out_cos;
        }
        /*** END: Time ***/

        /*** BEGIN: A Node using two TimeNodes for some reason ***/
        {
          float in_a = out_Time_2_value;
          float in_b = out_Time_3_value;
        }
        /*** END: A Node using two TimeNodes for some reason ***/

      }"
    `)
  })

  it("supports the dynamic creation of varyings", () => {
    const node = ShaderNode({
      name: "Node with a Varying",
      varyings: {
        v_pos: vec3("position")
      },
      out: {
        value: vec3("v_pos")
      }
    })

    const [c] = compileShader(node)

    expect(c.vertexShader).toMatchInlineSnapshot(`
      "/*** BEGIN: Node with a Varying ***/
      varying vec3 v_Node_with_a_Varying_1_v_pos;
      /*** END: Node with a Varying ***/

      void main()
      {
        /*** BEGIN: Node with a Varying ***/
        vec3 out_Node_with_a_Varying_1_value;
        {
          vec3 v_pos = position;
          vec3 out_value = v_pos;
          out_Node_with_a_Varying_1_value = out_value;
          v_Node_with_a_Varying_1_v_pos = v_pos;
        }
        /*** END: Node with a Varying ***/

      }"
    `)

    expect(c.fragmentShader).toMatchInlineSnapshot(`
      "/*** BEGIN: Node with a Varying ***/
      varying vec3 v_Node_with_a_Varying_1_v_pos;
      /*** END: Node with a Varying ***/

      void main()
      {
        /*** BEGIN: Node with a Varying ***/
        vec3 out_Node_with_a_Varying_1_value;
        {
          vec3 v_pos = v_Node_with_a_Varying_1_v_pos;
          vec3 out_value = v_pos;
          out_Node_with_a_Varying_1_value = out_value;
        }
        /*** END: Node with a Varying ***/

      }"
    `)
  })

  it("only includes dependencies in the GLSL once", () => {
    const f = FloatNode({ value: 1 })

    const n = ShaderNode({
      in: {
        a: float(f.out.value),
        b: float(f.out.value)
      }
    })
    const [c] = compileShader(n)

    expect(c.vertexShader).toMatchInlineSnapshot(`
      "
      /*** BEGIN: Value (float) ***/
      /*** END: Value (float) ***/

      /*** BEGIN: Unnamed Node ***/
      /*** END: Unnamed Node ***/

      void main()
      {
        /*** BEGIN: Value (float) ***/
        float out_Value_float_2_value;
        {
          float in_value = 1.0;
          float out_value = in_value;
          out_Value_float_2_value = out_value;
        }
        /*** END: Value (float) ***/

        /*** BEGIN: Unnamed Node ***/
        {
          float in_a = out_Value_float_2_value;
          float in_b = out_Value_float_2_value;
        }
        /*** END: Unnamed Node ***/

      }"
    `)

    expect(c.fragmentShader).toMatchInlineSnapshot(`
      "
      /*** BEGIN: Value (float) ***/
      /*** END: Value (float) ***/

      /*** BEGIN: Unnamed Node ***/
      /*** END: Unnamed Node ***/

      void main()
      {
        /*** BEGIN: Value (float) ***/
        float out_Value_float_2_value;
        {
          float in_value = 1.0;
          float out_value = in_value;
          out_Value_float_2_value = out_value;
        }
        /*** END: Value (float) ***/

        /*** BEGIN: Unnamed Node ***/
        {
          float in_a = out_Value_float_2_value;
          float in_b = out_Value_float_2_value;
        }
        /*** END: Unnamed Node ***/

      }"
    `)
  })

  it("compiles filters", () => {
    const AdditionFilter = Factory(() => ({
      name: "Addition",
      in: {
        a: float(),
        b: float()
      },
      out: {
        value: float(`in_value + in_other`)
      }
    }))

    const nodeWithfilters = ShaderNode({
      name: "Node with filters",
      in: {
        a: float(1)
      },
      out: {
        value: float("in_value")
      },
      filters: [AdditionFilter({ b: 2 })]
    })

    const [c] = compileShader(nodeWithfilters)

    expect(c.vertexShader).toMatchInlineSnapshot(`
      "
      /*** BEGIN: Node with filters ***/
      /*** END: Node with filters ***/



      /*** BEGIN: Addition ***/
      /*** END: Addition ***/

      void main()
      {
        /*** BEGIN: Node with filters ***/
        float out_Node_with_filters_1_value;
        {
          float in_a = 1.0;
          float out_value = in_value;
          out_Node_with_filters_1_value = out_value;
          /*** BEGIN: Addition ***/
          float out_Addition_2_value;
          {
            float in_a = in_value;
            float in_b = 2.0;
            float out_value = in_value + in_other;
            out_Addition_2_value = out_value;
          }
          /*** END: Addition ***/

          out_Node_with_filters_1_value = out_Addition_2_value;
        }
        /*** END: Node with filters ***/

      }"
    `)
  })
})

describe("assign", () => {
  it("assigns the given value to the variable", () => {
    const f = float(0)
    assign(1).to(f)
    expect(f.value).toBe(1)
  })

  it("can assign other variables to the variable", () => {
    const a = float(0)
    const b = float(1)
    assign(b).to(a)
    expect(a.value).toBe(b)
  })

  it("can assign other nodes to the variable, using their default output value", () => {
    const a = float(0)
    const node = FloatNode({ value: 1 })
    assign(node).to(a)
    expect(a.value).toBe(node.out.value)
  })

  it("can assign to a node, using its default a input", () => {
    const f = float(0)
    const node = ShaderNode({ in: { a: float() } })

    assign(f).to(node)
    expect(node.in.a.value).toBe(f)
  })

  it("throws an error if the source has a different type from the target", () => {
    const f = float(0)
    const v = vec3()

    expect(() => {
      // @ts-ignore
      assign(f).to(v)
    }).toThrowErrorMatchingInlineSnapshot(`"Tried to assign float to vec3"`)
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
