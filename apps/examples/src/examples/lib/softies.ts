import {
  $,
  Div,
  Float,
  Input,
  InstanceMatrix,
  ModelMatrix,
  Mul,
  pipe,
  Resolution,
  Saturate,
  Snippet,
  Sub,
  Texture2D,
  Uniform,
  Unit,
  Vec2,
  Vec4,
  ViewMatrix
} from "shader-composer"
import { ModuleFactory } from "vfx-composer/modules"

export const SoftParticles: ModuleFactory<{
  softness: Input<"float">
  depthSampler2D: Unit<"sampler2D">
}> = ({ softness, depthSampler2D }) => (state) => ({
  ...state,
  alpha: Mul(
    state.alpha,
    SoftParticle(softness, depthSampler2D, state.position)
  )
})

export const FragmentCoordinate = Vec2($`gl_FragCoord.xy`)

export const ScreenUV = Vec2($`${FragmentCoordinate} / ${Resolution}`, {
  name: "Screen UV"
})

/**
 * Converts the given position (which is assumed to be in local space) to view space.
 */
export const ToViewSpace = (position: Input<"vec3">) =>
  Vec4(
    $`${ViewMatrix} * ${InstanceMatrix} * ${ModelMatrix} * vec4(${position}, 1.0)`,
    { varying: true }
  )

export const CameraNear = Uniform<"float", number>("float", 0)
export const CameraFar = Uniform<"float", number>("float", 1)

const ReadDepth = (
  xy: Input<"vec2">,
  depthTexture: Unit<"sampler2D">,
  cameraNear: Input<"float"> = CameraNear,
  cameraFar: Input<"float"> = CameraFar
) =>
  Float(
    pipe(
      xy,
      (v) => Texture2D(depthTexture, v).x,
      (v) => $`perspectiveDepthToViewZ(${v}, ${cameraNear}, ${cameraFar})`
    ),
    { name: "Read Depth" }
  )

const SceneDepth = (xy: Input<"vec2">, depthTexture: Unit<"sampler2D">) => {
  // TODO: make your own damn depth texture

  return Float(ReadDepth(xy, depthTexture), { name: "Scene Depth" })
}

export const SoftParticle = (
  softness: Input<"float">,
  depthTexture: Unit<"sampler2D">,
  position: Input<"vec3">
) =>
  Float(
    pipe(
      position,
      /* Convert position to view space and grab depth */
      (v) => ToViewSpace(v).z,
      /* Subtract from the existing scene depth at the fragment coordinate */
      (v) => Sub(v, SceneDepth(ScreenUV, depthTexture)),
      /* Divide by softness factor */
      (v) => Div(v, softness),
      /* Clamp between 0 and 1 */
      (v) => Saturate(v)
    ),

    { name: "Soft Particle" }
  )
