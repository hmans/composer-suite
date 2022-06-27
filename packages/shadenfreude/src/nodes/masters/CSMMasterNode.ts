import { nodeFactory, node, vec3 } from "../../factories"
import { Value } from "../../types"

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
