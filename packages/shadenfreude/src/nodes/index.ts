import { float, nodeFactory, vec3 } from "../factories"
import { Program, Value } from "../types"
export * from "./inputs"
export * from "./masters"
export * from "./math"
export * from "./values"

export const FresnelNode = nodeFactory(() => ({
  name: "Fresnel",
  inputs: {
    alpha: float(1),
    bias: float(0),
    intensity: float(1),
    power: float(2),
    factor: float(1)
  },
  outputs: {
    value: float()
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
      value = clamp(f_fresnel, 0.0, 1.0);
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
