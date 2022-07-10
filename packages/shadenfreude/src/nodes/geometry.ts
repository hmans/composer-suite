import { Vector2 } from "three"
import { code } from "../expressions"
import { Mat4, Vec2, Vec3 } from "../variables"

export const UV = Vec2(code`uv`, { varying: true })
export const VertexPosition = Vec3(code`position`, { varying: true })
export const VertexNormal = Vec3(code`normal`, { varying: true })
export const ViewMatrix = Mat4(code`viewMatrix`, { varying: true })
export const ModelMatrix = Mat4(code`modelMatrix`, { varying: true })
export const InstanceMatrix = Mat4(code`instanceMatrix`, { varying: true })

/*
Now variables like VertexNormalWorld can just source those and work
in both shader stages:
*/

export const VertexNormalWorld = Vec3(
  code`normalize(
      mat3(
        ${ModelMatrix}[0].xyz,
        ${ModelMatrix}[1].xyz,
        ${ModelMatrix}[2].xyz
      ) * ${VertexNormal})`,
  { varying: true }
)

export const ViewDirection = Vec3(
  code`vec3(-${ViewMatrix}[0][2], -${ViewMatrix}[1][2], -${ViewMatrix}[2][2])`,
  { varying: true }
)

export const TilingUV = (
  uv: Vec2 = UV,
  tiling: Vec2 = new Vector2(1, 1),
  offset: Vec2 = new Vector2(0, 0)
) =>
  Vec2(
    code`vec2(
      ${uv}.x * ${tiling}.x + ${offset}.x,
      ${uv}.y * ${tiling}.y + ${offset}.y)`
  )
