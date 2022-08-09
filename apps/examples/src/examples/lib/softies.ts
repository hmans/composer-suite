import {
  $,
  Div,
  Float,
  Input,
  InstanceMatrix,
  ModelMatrix,
  Mul,
  pipe,
  Saturate,
  Sub,
  Texture2D,
  Uniform,
  Unit,
  Vec2,
  Vec4,
  ViewMatrix
} from "shader-composer"
import {
  Camera,
  Float16BufferAttribute,
  PerspectiveCamera,
  Scene,
  Vector2
} from "three"
import { ModuleFactory } from "vfx-composer/modules"

/**
 * Returns the current fragment's on-screen coordinate.
 */
export const FragmentCoordinate = Vec2($`gl_FragCoord.xy`, {
  name: "Fragment Coordinate",
  only: "fragment"
})

/**
 * Converts the given position vector (which is assumed to be in local space)
 * to view space.
 */
export const ToViewSpace = (position: Input<"vec3">) =>
  Vec4(
    $`${ViewMatrix} * ${InstanceMatrix} * ${ModelMatrix} * vec4(${position}, 1.0)`,
    { varying: true }
  )

const ReadDepth = (
  xy: Input<"vec2">,
  depthTexture: Unit<"sampler2D">,
  cameraNear: Input<"float">,
  cameraFar: Input<"float">
) =>
  Float(
    pipe(
      xy,
      (v) => Texture2D(depthTexture, v).x,
      (v) => $`perspectiveDepthToViewZ(${v}, ${cameraNear}, ${cameraFar})`
    ),
    { name: "Read Depth" }
  )

const SceneDepth = (
  xy: Input<"vec2">,
  depthTexture: Unit<"sampler2D">,
  renderContext: RenderContext
) => {
  return Float(
    ReadDepth(
      xy,
      depthTexture,
      renderContext.CameraNear,
      renderContext.CameraFar
    ),
    {
      name: "Scene Depth"
    }
  )
}

export const SoftParticle = (
  softness: Input<"float">,
  depthTexture: Unit<"sampler2D">,
  position: Input<"vec3">,
  renderContext: RenderContext
) => {
  const screenUV = Vec2($`${FragmentCoordinate} / ${renderContext.Resolution}`)

  return Float(
    pipe(
      position,
      /* Convert position to view space and grab depth */
      (v) => ToViewSpace(v).z,
      /* Subtract from the existing scene depth at the fragment coordinate */
      (v) => Sub(v, SceneDepth(screenUV, depthTexture, renderContext)),
      /* Divide by softness factor */
      (v) => Div(v, softness),
      /* Clamp between 0 and 1 */
      (v) => Saturate(v)
    ),

    { name: "Soft Particle" }
  )
}

export const SoftParticles: ModuleFactory<{
  softness: Input<"float">
  depthSampler2D: Unit<"sampler2D">
  renderContext: RenderContext
}> = ({ softness, depthSampler2D, renderContext }) => (state) => ({
  ...state,
  alpha: Mul(
    state.alpha,
    SoftParticle(softness, depthSampler2D, state.position, renderContext)
  )
})

export type RenderContext = ReturnType<typeof RenderContext>

export const RenderContext = (scene: Scene, camera: PerspectiveCamera) => {
  const CameraNearUniform = Uniform<"float", number>("float", 0)
  const CameraFarUniform = Uniform<"float", number>("float", 1)

  const CameraNear = Float(CameraNearUniform, {
    name: "Camera Near",
    update: () => (CameraNearUniform.value = camera.near)
  })

  const CameraFar = Float(CameraFarUniform, {
    name: "Camera Far",
    update: () => (CameraFarUniform.value = camera.far)
  })

  const ResolutionUniform = Uniform("vec2", new Vector2())

  const Resolution = Vec2(ResolutionUniform, {
    name: "Resolution",
    update: () =>
      ResolutionUniform.value.set(window.innerWidth, window.innerHeight)
  })

  return { CameraNear, CameraFar, Resolution }
}
