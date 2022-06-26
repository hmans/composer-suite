import { variable, node, vec3, float } from "../factories"
import { GLSLType, Operator, Program, Variable } from "../types"

export const TimeNode = () => {
  const u_time = variable("float", 0)

  return node({
    name: "Time Uniform",
    uniforms: { u_time },
    outputs: { time: float(u_time) },

    update: (_, dt) => {
      u_time.value! += dt
    }
  })
}

export const FloatValueNode = (value: number) =>
  node({
    name: "Float Value",
    outputs: { value: float(value) }
  })

export const VertexPositionNode = () =>
  node({
    name: "Vertex Position",
    outputs: { position: vec3() },
    vertex: {
      body: "position = csm_Position;"
    }
  })

export const MasterNode = (inputs: {
  diffuseColor?: Variable
  position?: Variable
}) =>
  node({
    name: "Master Node",
    inputs: {
      diffuseColor: vec3(inputs.diffuseColor),
      position: vec3(inputs.position)
    },
    vertex: {
      body: "csm_Position = position;"
    },
    fragment: {
      body: "csm_DiffuseColor.rgb = diffuseColor;"
    }
  })

export const OperatorNode = (
  type: GLSLType,
  operator: Operator,
  inputs: { a: Variable; b: Variable }
) =>
  node({
    name: `Perform ${operator} on ${type}`,
    inputs: {
      a: variable(type, inputs.a),
      b: variable(type, inputs.b)
    },
    outputs: {
      result: variable(type)
    },
    vertex: {
      body: `result = a ${operator} b;`
    },
    fragment: {
      body: `result = a ${operator} b;`
    }
  })

export const AddNode = (a: Variable, b: Variable) =>
  OperatorNode(a.type, "+", { a, b }).outputs.result

export const MultiplyNode = (a: Variable, b: Variable) =>
  OperatorNode(a.type, "*", { a, b }).outputs.result

export const MixNode = (a: Variable, b: Variable, factor: Variable) =>
  node({
    name: "Mix",
    inputs: {
      a: variable(a.type, a),
      b: variable(b.type, b),
      factor: variable("float", factor)
    },
    outputs: {
      result: variable(a.type)
    },
    vertex: {
      body: `result = mix(a, b, factor);`
    },
    fragment: {
      body: `result = mix(a, b, factor);`
    }
  }).outputs.result

export const FresnelNode = () =>
  node({
    name: "Fresnel",
    inputs: {
      color: vec3("vec3(1.0, 1.0, 1.0)"),
      alpha: float(1),
      bias: float(0),
      intensity: float(1),
      power: float(2),
      factor: float(1)
    },
    outputs: {
      fresnel: vec3()
    },
    vertex: {
      header: `
        varying vec3 v_worldPosition;
        varying vec3 v_worldNormal;
      `,
      body: `
        v_worldPosition = vec3(
          -viewMatrix[0][2],
          -viewMatrix[1][2],
          -viewMatrix[2][2]
        );

        v_worldNormal = normalize(
          mat3(
            modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz
          ) * normal
        );
      `
    },
    fragment: {
      header: `
        varying vec3 v_worldPosition;
        varying vec3 v_worldNormal;
      `,
      body: `
        float f_a = (factor + dot(v_worldPosition, v_worldNormal));
        float f_fresnel = bias + intensity * pow(abs(f_a), power);
        f_fresnel = clamp(f_fresnel, 0.0, 1.0);

        // return vec4(f_fresnel * color, u_alpha);

        fresnel.rgb = f_fresnel * color;
      `
    }
  })

export const BlendNode = (input: {
  a: Variable
  b: Variable
  opacity: Variable<number>
}) => {
  const program: Program = {
    header: `
      float blend_softlight(const in float x, const in float y) {
        return (y < 0.5) ?
          (2.0 * x * y + x * x * (1.0 - 2.0 * y)) :
          (sqrt(x) * (2.0 * y - 1.0) + 2.0 * x * (1.0 - y));
      }
    `,
    body: `
      vec3 z = vec3(
        blend_softlight(a.r, b.r),
        blend_softlight(a.g, b.g),
        blend_softlight(a.b, b.b)
      );

      result = vec3(z.xyz * opacity + a.xyz * (1.0 - opacity));
      result = z.xyz * opacity;;
    `
  }

  return node({
    name: "Softlight Blend",
    inputs: {
      a: vec3(input.a),
      b: vec3(input.b),
      opacity: float(input.opacity)
    },
    outputs: {
      result: vec3()
    },
    vertex: program,
    fragment: program
  })
}
