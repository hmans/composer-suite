import { Vector3, Vector4 } from "three"
import { FloatNode, TimeNode } from "../src"
import {
  assign,
  compileShader,
  Factory,
  float,
  set,
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
      inputs: { a: float() },
      outputs: { value: float() }
    })
    expect(n.inputs.a.node).toBe(n)
    expect(n.outputs.value.node).toBe(n)
  })

  it("assigns props when given as a second argument", () => {
    const props = { a: 1 }
    const n = ShaderNode({ inputs: { a: float() } }, props)
    expect(n.inputs.a.value).toBe(1)
  })
})

describe("Factory", () => {
  it("creates a shader node factory that can assign inputs props", () => {
    const TestNode = Factory(() => ({
      inputs: { a: float() }
    }))

    const node = TestNode({ a: 123 })

    expect(node.inputs.a.value).toBe(123)
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
      inputs: {
        vec: vec3(new Vector3(1, 2, 3))
      },
      outputs: {
        value: float("a * 2.0")
      }
    })
    const [c] = compileShader(n)

    expect(c.vertexShader).toMatchInlineSnapshot(`
      "/*** BEGIN: Test Node ***/
      /*** END: Test Node ***/

      void main()
      {
        /*** BEGIN: Test Node ***/
        float out_Test_Node_1_value;
        {
          struct { vec3 vec; } inputs;
          inputs.vec = vec3(1.0, 2.0, 3.0);
          struct { float value; } outputs;
          outputs.value = a * 2.0;
          out_Test_Node_1_value = outputs.value;
        }
        /*** END: Test Node ***/

      }"
    `)

    expect(c.fragmentShader).toMatchInlineSnapshot(`
      "/*** BEGIN: Test Node ***/
      /*** END: Test Node ***/

      void main()
      {
        /*** BEGIN: Test Node ***/
        float out_Test_Node_1_value;
        {
          struct { vec3 vec; } inputs;
          inputs.vec = vec3(1.0, 2.0, 3.0);
          struct { float value; } outputs;
          outputs.value = a * 2.0;
          out_Test_Node_1_value = outputs.value;
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
      inputs: {
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
        float out_Time_1_value;
        float out_Time_1_sin;
        float out_Time_1_cos;
        {
          struct { float value; float sin; float cos; } outputs;
          outputs.value = u_time;
          outputs.sin = sin(u_time);
          outputs.cos = cos(u_time);
          out_Time_1_value = outputs.value;
          out_Time_1_sin = outputs.sin;
          out_Time_1_cos = outputs.cos;
        }
        /*** END: Time ***/

        /*** BEGIN: Time ***/
        float out_Time_2_value;
        float out_Time_2_sin;
        float out_Time_2_cos;
        {
          struct { float value; float sin; float cos; } outputs;
          outputs.value = u_time;
          outputs.sin = sin(u_time);
          outputs.cos = cos(u_time);
          out_Time_2_value = outputs.value;
          out_Time_2_sin = outputs.sin;
          out_Time_2_cos = outputs.cos;
        }
        /*** END: Time ***/

        /*** BEGIN: A Node using two TimeNodes for some reason ***/
        {
          struct { float a; float b; } inputs;
          inputs.a = out_Time_1_value;
          inputs.b = out_Time_2_value;
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
        float out_Time_1_value;
        float out_Time_1_sin;
        float out_Time_1_cos;
        {
          struct { float value; float sin; float cos; } outputs;
          outputs.value = u_time;
          outputs.sin = sin(u_time);
          outputs.cos = cos(u_time);
          out_Time_1_value = outputs.value;
          out_Time_1_sin = outputs.sin;
          out_Time_1_cos = outputs.cos;
        }
        /*** END: Time ***/

        /*** BEGIN: Time ***/
        float out_Time_2_value;
        float out_Time_2_sin;
        float out_Time_2_cos;
        {
          struct { float value; float sin; float cos; } outputs;
          outputs.value = u_time;
          outputs.sin = sin(u_time);
          outputs.cos = cos(u_time);
          out_Time_2_value = outputs.value;
          out_Time_2_sin = outputs.sin;
          out_Time_2_cos = outputs.cos;
        }
        /*** END: Time ***/

        /*** BEGIN: A Node using two TimeNodes for some reason ***/
        {
          struct { float a; float b; } inputs;
          inputs.a = out_Time_1_value;
          inputs.b = out_Time_2_value;
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
      outputs: {
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
          struct { vec3 value; } outputs;
          outputs.value = v_pos;
          out_Node_with_a_Varying_1_value = outputs.value;
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
          struct { vec3 value; } outputs;
          outputs.value = v_pos;
          out_Node_with_a_Varying_1_value = outputs.value;
        }
        /*** END: Node with a Varying ***/

      }"
    `)
  })

  it("only includes dependencies in the GLSL once", () => {
    const f = FloatNode({ a: 1 })

    const n = ShaderNode({
      inputs: {
        a: float(f),
        b: float(f)
      }
    })
    const [c] = compileShader(n)

    expect(c.vertexShader).toMatchInlineSnapshot(`
      "/*** BEGIN: Value (float) ***/
      /*** END: Value (float) ***/

      /*** BEGIN: Unnamed Node ***/
      /*** END: Unnamed Node ***/

      void main()
      {
        /*** BEGIN: Value (float) ***/
        float out_Value_float_1_value;
        {
          struct { float a; } inputs;
          inputs.a = 1.0;
          struct { float value; } outputs;
          outputs.value = inputs.a;
          out_Value_float_1_value = outputs.value;
        }
        /*** END: Value (float) ***/

        /*** BEGIN: Unnamed Node ***/
        {
          struct { float a; float b; } inputs;
          inputs.a = out_Value_float_1_value;
          inputs.b = out_Value_float_1_value;
        }
        /*** END: Unnamed Node ***/

      }"
    `)

    expect(c.fragmentShader).toMatchInlineSnapshot(`
      "/*** BEGIN: Value (float) ***/
      /*** END: Value (float) ***/

      /*** BEGIN: Unnamed Node ***/
      /*** END: Unnamed Node ***/

      void main()
      {
        /*** BEGIN: Value (float) ***/
        float out_Value_float_1_value;
        {
          struct { float a; } inputs;
          inputs.a = 1.0;
          struct { float value; } outputs;
          outputs.value = inputs.a;
          out_Value_float_1_value = outputs.value;
        }
        /*** END: Value (float) ***/

        /*** BEGIN: Unnamed Node ***/
        {
          struct { float a; float b; } inputs;
          inputs.a = out_Value_float_1_value;
          inputs.b = out_Value_float_1_value;
        }
        /*** END: Unnamed Node ***/

      }"
    `)
  })

  it("compiles filters", () => {
    const AdditionFilter = Factory(() => ({
      name: "Addition",
      inputs: {
        a: float(),
        b: float()
      },
      outputs: {
        value: float(`in_value + in_other`)
      }
    }))

    const nodeWithfilters = ShaderNode({
      name: "Node with filters",
      inputs: {
        a: float(1)
      },
      outputs: {
        value: float("in_value")
      },
      filters: [AdditionFilter({ b: 2 })]
    })

    const [c] = compileShader(nodeWithfilters)

    expect(c.vertexShader).toMatchInlineSnapshot(`
      "/*** BEGIN: Addition ***/
      /*** END: Addition ***/

      /*** BEGIN: Node with filters ***/
      /*** END: Node with filters ***/

      void main()
      {
        /*** BEGIN: Node with filters ***/
        float out_Node_with_filters_2_value;
        {
          struct { float a; } inputs;
          inputs.a = 1.0;
          struct { float value; } outputs;
          outputs.value = in_value;
          out_Node_with_filters_2_value = outputs.value;
          /*** BEGIN: Addition ***/
          float out_Addition_1_value;
          {
            struct { float a; float b; } inputs;
            inputs.a = out_Node_with_filters_2_value;
            inputs.b = 2.0;
            struct { float value; } outputs;
            outputs.value = in_value + in_other;
            out_Addition_1_value = outputs.value;
          }
          /*** END: Addition ***/

          out_Node_with_filters_2_value = out_Addition_1_value;
        }
        /*** END: Node with filters ***/

      }"
    `)
  })

  it("still compiles if filters is defined, but empty", () => {
    const nodeWithNoFilters = ShaderNode({
      inputs: {
        a: float(1)
      },
      outputs: {
        value: float("in_value")
      },
      filters: [
        // TheDeveloperCommentedOutTheOnlyFilter()
      ]
    })

    const [c] = compileShader(nodeWithNoFilters)

    expect(c.vertexShader).toMatchInlineSnapshot(`
      "/*** BEGIN: Unnamed Node ***/
      /*** END: Unnamed Node ***/

      void main()
      {
        /*** BEGIN: Unnamed Node ***/
        float out_Unnamed_Node_1_value;
        {
          struct { float a; } inputs;
          inputs.a = 1.0;
          struct { float value; } outputs;
          outputs.value = in_value;
          out_Unnamed_Node_1_value = outputs.value;
        }
        /*** END: Unnamed Node ***/

      }"
    `)
  })
})

describe("assign", () => {
  it("assigns the given value to the variable", () => {
    const f = float(0)
    assign(f, 1)
    expect(f.value).toBe(1)
  })

  it("can assign other variables to the variable", () => {
    const a = float(0)
    const b = float(1)
    assign(a, b)
    expect(a.value).toBe(b)
  })

  it("can assign other nodes to the variable, using their default output value", () => {
    const a = float(0)
    const node = FloatNode({ a: 1 })
    assign(a, node)
    expect(a.value).toBe(node.outputs.value)
  })

  it("can assign to a node, using its default a input", () => {
    const f = float(0)
    const node = ShaderNode({ inputs: { a: float() } })

    assign(node, f)
    expect(node.inputs.a.value).toBe(f)
  })

  it("changes the type of the target variable (if it allows it)", () => {
    const vec3OrFloat = variable<"vec3" | "float">("float")
    const vec3 = variable("vec3", new Vector3())

    expect(vec3OrFloat.type).toBe("float")
    assign(vec3OrFloat, vec3)
    expect(vec3OrFloat.type).toBe("vec3")
  })
})

describe("set(a).to(b)", () => {
  it("sets the target variable to the source value", () => {
    const time = TimeNode()

    const offset = ShaderNode({
      inputs: {
        a: float()
      }
    })

    set(offset).to(time)

    expect(offset.inputs.a.value).toBe(time.outputs.value)
  })
})
