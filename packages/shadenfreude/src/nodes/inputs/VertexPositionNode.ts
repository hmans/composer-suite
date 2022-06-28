import { node } from "../../factories"
import { VaryingNode } from "../util"

export type VertexPositionNodeProps = {}

export const VertexPositionNode = () =>
  node<"vec3">({
    ...VaryingNode({ type: "vec3", source: "position" }),
    name: "Vertex Position"
  })
