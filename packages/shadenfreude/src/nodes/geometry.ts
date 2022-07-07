import { Vec3 } from "../variables"
import { Varying } from "./inputs"

export const VertexPosition = Varying(
  "vec3",
  Vec3("position", { only: "vertex" })
)

export const VertexNormal = Varying(
  "vec3",
  Vec3(
    "normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal)",
    { only: "vertex" }
  )
)
