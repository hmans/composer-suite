import { Mat4, Vec3 } from "../variables"
import { Varying } from "./inputs"

export const VertexPosition = Varying(
  "vec3",
  Vec3("position", { only: "vertex" })
)

/*
A couple of variables sourcing things that are only available in the
vertex shader. The `only` option will make sure that they never get
rendered in the fragment shader.
*/

export const VertexNormalAttribute = Vec3("normal", { only: "vertex" })
export const ViewMatrixAttribute = Mat4("viewMatrix", { only: "vertex" })
export const ModelMatrixAttribute = Mat4("modelMatrix", { only: "vertex" })
export const InstanceMatrixAttribute = Mat4("instanceMatrix", {
  only: "vertex"
})

/*
These variables make the vertex-only values above available in both
stages of the shader, by way of a varying.
*/

export const VertexNormal = Varying("vec3", VertexNormalAttribute)
export const ViewMatrix = Varying("mat4", ViewMatrixAttribute)
export const ModelMatrix = Varying("mat4", ModelMatrixAttribute)
export const InstanceMatrix = Varying("mat4", InstanceMatrixAttribute)

/*
Now variables like VertexNormalWorld can just source those and work
in both shader stages:
*/

export const VertexNormalWorld = Varying(
  "vec3",
  Vec3(
    `normalize(
      mat3(
        ModelMatrix[0].xyz,
        ModelMatrix[1].xyz,
        ModelMatrix[2].xyz
      ) * VertexNormal)`,
    { only: "vertex", inputs: { VertexNormal, ModelMatrix } }
  )
)
