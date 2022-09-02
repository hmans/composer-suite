import { pipe } from "fp-ts/function"
import { $ } from "../expressions"
import { Input, Unit } from "../units"
import { Texture2D } from "./textures"
import { CameraFar, CameraNear } from "./uniforms"
import { Float } from "./values"

export const SceneColor = (uv: Input<"vec2">, texture: Unit<"sampler2D">) =>
  Texture2D(texture, uv)

/**
 * Sample a depth texture and return the raw depth value.
 *
 * @param uv Screen UV
 * @param depthTexture Depth texture to sample
 * @returns Float unit containing the depth as stored in the texture
 */
export const RawDepth = (uv: Input<"vec2">, depthTexture: Unit<"sampler2D">) =>
  Float(Texture2D(depthTexture, uv).x, {
    name: "Read Depth from Depth Texture (Raw)"
  })

/**
 * Sample a depth texture and return the depth value in eye space units.
 *
 * @param xy Screen position
 * @param depthTexture Depth texture to sample
 * @param cameraNear Camera near plane (defaults to CameraNear)
 * @param cameraFar Camera far plane (defaults to CameraFar)
 * @returns Float unit containing the depth in eye space units
 */
export const PerspectiveDepth = (
  xy: Input<"vec2">,
  depthTexture: Unit<"sampler2D">,
  cameraNear: Input<"float"> = CameraNear,
  cameraFar: Input<"float"> = CameraFar
) =>
  Float(
    pipe(
      xy,
      (v) => RawDepth(v, depthTexture),
      (v) => $`perspectiveDepthToViewZ(${v}, ${cameraNear}, ${cameraFar})`
    ),
    { name: "Read Depth from Depth Texture (Eye Space)" }
  )
