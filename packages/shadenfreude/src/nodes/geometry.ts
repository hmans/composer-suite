import { Mat4, Vec2, Vec3 } from "../variables"

export const UV = Vec2("uv", { varying: true })
export const VertexPosition = Vec3("position", { varying: true })
export const VertexNormal = Vec3("normal", { varying: true })
export const ViewMatrix = Mat4("viewMatrix", { varying: true })
export const ModelMatrix = Mat4("modelMatrix", { varying: true })
export const InstanceMatrix = Mat4("instanceMatrix", { varying: true })

/*
Now variables like VertexNormalWorld can just source those and work
in both shader stages:
*/

export const VertexNormalWorld = Vec3(
  `normalize(
      mat3(
        ModelMatrix[0].xyz,
        ModelMatrix[1].xyz,
        ModelMatrix[2].xyz
      ) * VertexNormal)`,
  {
    inputs: { VertexNormal, ModelMatrix },
    varying: true
  }
)

export const ViewDirection = Vec3(
  "vec3(-ViewMatrix[0][2], -ViewMatrix[1][2], -ViewMatrix[2][2])",
  {
    inputs: { ViewMatrix },
    varying: true
  }
)
