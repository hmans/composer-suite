import { float, nodeFactory, vec3 } from "../factories"
import { Program, Value } from "../types"
import { Vec3VaryingNode } from "./util"

export const WorldPositionNode = nodeFactory(() => ({
  ...Vec3VaryingNode({
    value: `
      vec3(
        -viewMatrix[0][2],
        -viewMatrix[1][2],
        -viewMatrix[2][2]
      )
    `
  }),

  name: "World Position (?)"
}))

export const WorldNormalNode = nodeFactory(() => ({
  ...Vec3VaryingNode({
    value: `
      normalize(
        mat3(
          modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz
        ) * normal
      )
  `
  }),

  name: "World Normal (?)"
}))

export const FresnelNode = nodeFactory(() => ({
  name: "Fresnel",
  inputs: {
    alpha: float(1),
    bias: float(0),
    intensity: float(1),
    power: float(2),
    factor: float(1),
    worldPosition: vec3(WorldPositionNode().value),
    worldNormal: vec3(WorldNormalNode().value)
  },
  outputs: {
    value: float()
  },
  fragment: {
    body: `
      float f_a = (factor + dot(worldPosition, worldNormal));
      float f_fresnel = bias + intensity * pow(abs(f_a), power);
      f_fresnel = clamp(f_fresnel, 0.0, 1.0);
      value = f_fresnel;
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
