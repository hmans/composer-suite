import { Color } from "three"
import { float, node, nodeFactory, variable, vec3 } from "../factories"
import { GLSLType, Operator, Program, Value, Variable } from "../types"

export const TimeNode = nodeFactory(() => {
  const u_time = variable("float", 0)

  return node({
    name: "Time Uniform",
    uniforms: { u_time },
    outputs: { value: float(u_time) },

    update: (_, dt) => {
      ;(u_time.value as number)! += dt
    }
  })
})

export const ColorNode = nodeFactory<{ color?: Value<"vec3"> }>(
  ({ color = new Color(1.0, 1.0, 1.0) }) => ({
    name: "Constant Color Value",
    outputs: {
      value: vec3(color)
    }
  })
)

export const FloatNode = nodeFactory<{ value: Value<"float"> }>(
  ({ value }) => ({
    name: "Constant Float Value",
    outputs: {
      value: float(value)
    }
  })
)

export const VertexPositionNode = nodeFactory(() =>
  node({
    name: "Vertex Position",
    outputs: { value: vec3() },
    vertex: {
      body: "value = position;"
    }
  })
)

export const CSMMasterNode = nodeFactory<{
  position?: Value<"vec3">
  normal?: Value<"vec3">
  pointSize?: Value<"float">
  diffuseColor?: Value<"vec3">
  fragColor?: Value<"vec3">
  emissiveColor?: Value<"vec3">
}>(({ position, normal, pointSize, diffuseColor, fragColor, emissiveColor }) =>
  node({
    name: "Master Node",
    inputs: {
      diffuseColor: vec3(diffuseColor),
      emissiveColor: vec3(emissiveColor),
      position: vec3(position),
      normal: vec3(normal)
    },
    vertex: {
      body: `
        ${pointSize ? "csm_PointSize = pointSize;" : ""}
        ${position ? "csm_Position = position;" : ""}
        ${normal ? "csm_Normal = normal;" : ""}
      `
    },
    fragment: {
      body: `
        ${diffuseColor ? "csm_DiffuseColor.rgb = diffuseColor;" : ""}
        ${fragColor ? "csm_FragColor.rgb = fragColor;" : ""}
        ${emissiveColor ? "csm_EmissiveColor.rgb = emissiveColor;" : ""}
      `
    }
  })
)

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
      value: variable(type)
    },
    vertex: {
      body: `value = a ${operator} b;`
    },
    fragment: {
      body: `value = a ${operator} b;`
    }
  })

export const AddNode = nodeFactory<{ a: Variable; b: Variable }>(({ a, b }) =>
  OperatorNode(a.type, "+", { a, b })
)

export const MultiplyNode = nodeFactory<{ a: Variable; b: Variable }>(
  ({ a, b }) => OperatorNode(a.type, "*", { a, b })
)

export const MixNode = nodeFactory<{
  a: Variable
  b: Variable
  factor: Value<"float">
}>(({ a, b, factor }) => ({
  name: "Mix",
  inputs: {
    a: variable(a.type, a),
    b: variable(b.type, b),
    factor: variable("float", factor)
  },
  outputs: {
    value: variable(a.type)
  },
  vertex: {
    body: `value = mix(a, b, factor);`
  },
  fragment: {
    body: `value = mix(a, b, factor);`
  }
}))

export const FresnelNode = nodeFactory(() => ({
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
    value: vec3()
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

      value.rgb = f_fresnel * color;
    `
  }
}))

export const BlendNode = nodeFactory<{
  a: Value<"vec3">
  b: Value<"vec3">
  opacity: Value<"float">
}>((props) => {
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

      value = vec3(z.xyz * opacity + a.xyz * (1.0 - opacity));
      value = z.xyz * opacity;;
    `
  }

  return {
    name: "Softlight Blend",
    inputs: {
      a: vec3(props.a),
      b: vec3(props.b),
      opacity: float(props.opacity)
    },
    outputs: {
      value: vec3()
    },
    vertex: program,
    fragment: program
  }
})
