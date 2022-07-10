import { Vector2 } from "three"
import { expr } from "../expressions"
import { Mat4, Vec2, Vec3 } from "../variables"

export const UV = Vec2(expr`uv`, { varying: true })
export const VertexPosition = Vec3(expr`position`, { varying: true })
export const VertexNormal = Vec3(expr`normal`, { varying: true })
export const ViewMatrix = Mat4(expr`viewMatrix`, { varying: true })
export const ModelMatrix = Mat4(expr`modelMatrix`, { varying: true })
export const InstanceMatrix = Mat4(expr`instanceMatrix`, { varying: true })

/*
Now variables like VertexNormalWorld can just source those and work
in both shader stages:
*/

export const VertexNormalWorld = Vec3(
  expr`normalize(
      mat3(
        ${ModelMatrix}[0].xyz,
        ${ModelMatrix}[1].xyz,
        ${ModelMatrix}[2].xyz
      ) * ${VertexNormal})`,
  { varying: true }
)

export const ViewDirection = Vec3(
  expr`vec3(-${ViewMatrix}[0][2], -${ViewMatrix}[1][2], -${ViewMatrix}[2][2])`,
  { varying: true }
)

export const TilingUV = (
  uv: Vec2 = UV,
  tiling: Vec2 = new Vector2(1, 1),
  offset: Vec2 = new Vector2(0, 0)
) =>
  Vec2(
    expr`vec2(
      ${uv}.x * ${tiling}.x + ${offset}.x,
      ${uv}.y * ${tiling}.y + ${offset}.y)`
  )
