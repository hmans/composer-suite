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
  DepthTexture,
  Float16BufferAttribute,
  PerspectiveCamera,
  Scene,
  Vector2,
  WebGLRenderer,
  WebGLRenderTarget
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

const SceneDepth = (xy: Input<"vec2">, renderContext: RenderContext) => {
  const renderTarget = new WebGLRenderTarget(256, 256, {
    depthTexture: new DepthTexture(256, 256)
  })

  const depthTexture = Uniform("sampler2D", renderTarget.depthTexture)

  return Float(
    ReadDepth(
      xy,
      depthTexture,
      renderContext.CameraNear,
      renderContext.CameraFar
    ),

    {
      name: "Scene Depth",

      update: () => {
        /* Render depth texture */
        renderContext.gl.setRenderTarget(renderTarget)
        renderContext.gl.render(renderContext.scene, renderContext.camera)
        renderContext.gl.setRenderTarget(null)
      }
    }
  )
}

export const SoftParticle = (
  softness: Input<"float">,
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
      (v) => Sub(v, SceneDepth(screenUV, renderContext)),
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
  renderContext: RenderContext
}> = ({ softness, renderContext }) => (state) => ({
  ...state,
  alpha: Mul(state.alpha, SoftParticle(softness, state.position, renderContext))
})

export type RenderContext = ReturnType<typeof RenderContext>

export const CameraNear = (camera: Camera) => {
  const uniform = Uniform("float", 0 as number)

  return Float(uniform, {
    name: "Camera Near",
    update: () => {
      if (camera instanceof PerspectiveCamera) uniform.value = camera.near
    }
  })
}

export const CameraFar = (camera: Camera) => {
  const uniform = Uniform("float", 0 as number)

  return Float(uniform, {
    name: "Camera Far",
    update: () => {
      if (camera instanceof PerspectiveCamera) uniform.value = camera.far
    }
  })
}

export const RenderContext = (
  gl: WebGLRenderer,
  scene: Scene,
  camera: Camera
) => {
  const ResolutionUniform = Uniform("vec2", new Vector2())

  const Resolution = Vec2(ResolutionUniform, {
    name: "Resolution",
    update: () => {
      ResolutionUniform.value.set(window.innerWidth, window.innerHeight)
    }
  })

  return {
    gl,
    scene,
    camera,
    CameraNear: CameraNear(camera),
    CameraFar: CameraFar(camera),
    Resolution
  }
}
