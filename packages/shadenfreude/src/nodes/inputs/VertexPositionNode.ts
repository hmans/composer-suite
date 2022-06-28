import { node } from "../../factories"
import { Vec3VaryingNode } from "../util/Vec3VaryingNode"

export type VertexPositionNodeProps = {}

export const VertexPositionNode = () =>
  node({
    ...Vec3VaryingNode({ value: "position" }),
    name: "Vertex Position"
  })
