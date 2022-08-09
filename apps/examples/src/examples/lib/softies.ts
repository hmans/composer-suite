import {
  $,
  Float,
  Input,
  InstanceMatrix,
  ModelMatrix,
  Mul,
  Resolution,
  Snippet,
  Uniform,
  Vec2,
  Vec4,
  ViewMatrix
} from "shader-composer"
import { ModuleFactory } from "vfx-composer/modules"

export const SoftParticles: ModuleFactory<{
  softness: Input<"float">
  depthSampler2D: Input<"sampler2D">
}> = ({ softness, depthSampler2D }) => (state) => ({
  ...state,
  alpha: Mul(
    state.alpha,
    SoftParticle(softness, depthSampler2D, state.position)
  )
})

export const FragmentCoordinate = Vec2($`gl_FragCoord.xy`)

export const ScreenUV = Vec2($`${FragmentCoordinate} / ${Resolution}`)

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

const readDepth = Snippet(
  (name) => $`
    float ${name}(vec2 coord, sampler2D depthTexture) {
      float depthZ = texture2D(depthTexture, coord).x;
      float viewZ = perspectiveDepthToViewZ(depthZ, ${CameraNear}, ${CameraFar});
      return viewZ;
    }
  `
)

export const SoftParticle = (
  softness: Input<"float">,
  depthTexture: Input<"sampler2D">,
  position: Input<"vec3">
) => {
  const positionViewZ = ToViewSpace(position).z
  const sceneDepth = Float($`${readDepth}(${ScreenUV}, ${depthTexture})`)

  return Float(
    $`clamp((${positionViewZ} - ${sceneDepth}) / ${softness}, 0.0, 1.0)`,
    { name: "Soft Particle" }
  )
}
