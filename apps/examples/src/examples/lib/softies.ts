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

const SceneDepth = (xy: Input<"vec2">, depthTexture: Input<"sampler2D">) =>
  Float($`${readDepth}(${xy}, ${depthTexture})`, { name: "Scene Depth" })

export const SoftParticle = (
  softness: Input<"float">,
  depthTexture: Input<"sampler2D">,
  position: Input<"vec3">
) =>
  Float(
    pipe(
      position,
      (v) => ToViewSpace(v).z,
      (v) => Sub(v, SceneDepth(ScreenUV, depthTexture)),
      (v) => Div(v, softness),
      (v) => Saturate(v)
    ),
    { name: "Soft Particle" }
  )
