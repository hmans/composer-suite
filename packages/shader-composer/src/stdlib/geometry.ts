/** @packageDocumentation
 * Geometryyyy
 */

import { Vector2 } from "three"
import { $, Expression } from "../expressions"
import { injectAPI, GLSLType, Input, Unit } from "../units"
import { localToViewSpace, localToWorldSpace } from "./spaces"
import { Bool, Mat4, Vec2, Vec3 } from "./values"

export const CameraPosition = Vec3($`cameraPosition`, {
  name: "Camera Position"
})

export const ViewMatrix = Mat4($`viewMatrix`, {
  name: "View Matrix"
})

export const ModelMatrix = Mat4($`modelMatrix`, {
  name: "Model Matrix"
})

export const ModelViewMatrix = Mat4($`modelViewMatrix`, {
  name: "ModelView Matrix"
})

export const NormalMatrix = Mat4($`normalMatrix`, {
  name: "Normal Matrix"
})

export const ProjectionMatrix = Mat4($`projectionMatrix`, {
  name: "Projection Matrix"
})

/**
 * Returns true if instanced rendering is enabled, false if it is not.
 */
export const UsingInstancing = Bool($`
  #ifdef USE_INSTANCING
    true
  #else
    false
  #endif
`)

/**
 * Returns the instance matrix. Please note that this is only available when
 * instanced rendering is enabled.
 */
export const InstanceMatrix = Mat4($`instanceMatrix`, {
  name: "Instance Matrix",
  only: "vertex"
})

export const UV = Vec2($`uv`, {
  name: "UV",
  varying: true
})

const Vec3WithSpaceConversions = (expr: Expression, name: string) =>
  injectAPI(Vec3(expr, { name, varying: true }), (unit) => ({
    get world() {
      return Vec3(localToWorldSpace(unit), {
        varying: true,
        name: `${name} (World Space)`
      })
    },

    get view() {
      return Vec3(localToViewSpace(unit), {
        varying: true,
        name: `${name} (View Space)`
      })
    }
  }))

export const VertexPosition = Vec3WithSpaceConversions($`position`, "Vertex Position")
export const VertexNormal = Vec3WithSpaceConversions($`normal`, "Vertex Normal")

export const ViewDirection = Vec3(
  $`vec3(-${ViewMatrix}[0][2], -${ViewMatrix}[1][2], -${ViewMatrix}[2][2])`,
  { varying: true, name: "View Direction" }
)

export const IsFrontFacing = Bool($`gl_FrontFacing`, { only: "fragment" })

export const TilingUV = (
  uv: Input<"vec2"> = UV,
  tiling: Input<"vec2"> = new Vector2(1, 1),
  offset: Input<"vec2"> = new Vector2(0, 0)
) =>
  Vec2(
    $`vec2(
      ${uv}.x * ${tiling}.x + ${offset}.x,
      ${uv}.y * ${tiling}.y + ${offset}.y)`
  )

export const Attribute = <T extends GLSLType>(type: T, name: string) =>
  Unit(type, $`${name}`, {
    name: `Attribute: ${name}`,
    varying: true,
    vertex: {
      header: $`attribute ${type} ${name};`
    }
  })
