import { nodeFactory } from "../../factories"
import { Vec3VaryingNode } from "../util/Vec3VaryingNode"

export const VertexPositionNode = nodeFactory(() => ({
  ...Vec3VaryingNode({ value: "position" }),
  name: "Vertex Position"
}))
