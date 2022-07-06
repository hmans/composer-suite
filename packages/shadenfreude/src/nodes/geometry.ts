import { vec3 } from "../variables"
import { Varying } from "./inputs"

export const VertexPosition = Varying(
  "vec3",
  vec3("position", { only: "vertex" })
)
