import { Vec3VaryingNode } from "../util/Vec3VaryingNode"

export type VertexPositionNodeProps = {}

export const VertexPositionNode = () => ({
  ...Vec3VaryingNode({ value: "position" }),
  name: "Vertex Position"
})
