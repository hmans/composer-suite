import { node } from "../../factories"
import { VaryingNode } from "../util"

export type VertexPositionNodeProps = {}

export const VertexPositionNode = () =>
  node({
    ...VaryingNode({ type: "vec3", source: "position" }),
    name: "Vertex Position"
  })
