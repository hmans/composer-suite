import {
  $,
  Attribute,
  CameraFar,
  CameraNear,
  Div,
  Float,
  glslType,
  Input,
  InstanceMatrix,
  LocalToViewSpace,
  pipe,
  ReadPerspectiveDepth,
  Saturate,
  ScreenUV,
  Snippet,
  Sub,
  Uniform,
  Vec3,
  ViewMatrix
} from "shader-composer"
import {
  Color,
  DepthTexture,
  InstancedMesh,
  Vector2,
  Vector3,
  Vector4,
  WebGLRenderTarget
} from "three"
import { Particles } from "./Particles"
import { makeAttribute } from "./util/makeAttribute"

/* TODO: promote this into Shader Composer */
type GLSLTypeFor<J> = J extends number
  ? "float"
  : J extends Vector2
  ? "vec2"
  : J extends Vector3
  ? "vec3"
  : J extends Vector4
  ? "vec4"
  : J extends Color
  ? "vec3"
  : never

let nextAttributeId = 1

export type ParticleAttribute = ReturnType<typeof ParticleAttribute>

export const ParticleAttribute = <
  J extends number | Vector2 | Vector3 | Color | Vector4,
  T extends GLSLTypeFor<J>
>(
  initialValue: J
) => {
  const name = `a_particle_${nextAttributeId++}`
  let value = initialValue
  const type = glslType(value as Input<T>)

  return {
    ...Attribute<T>(type, name),

    name,

    isParticleAttribute: true,

    setupMesh: ({ geometry, count }: InstancedMesh) => {
      const itemSize =
        type === "float"
          ? 1
          : type === "vec2"
          ? 2
          : type === "vec3"
          ? 3
          : type === "vec4"
          ? 4
          : 4

      geometry.setAttribute(name, makeAttribute(count, itemSize))
    },

    get value() {
      return value
    },

    set value(v: J) {
      value = v
    },

    setupParticle: ({ geometry, cursor }: Particles) => {
      const attribute = geometry.attributes[name]

      if (typeof value === "number") {
        attribute.setX(cursor, value)
      } else if (value instanceof Vector2) {
        attribute.setXY(cursor, value.x, value.y)
      } else if (value instanceof Vector3) {
        attribute.setXYZ(cursor, value.x, value.y, value.z)
      } else if (value instanceof Color) {
        attribute.setXYZ(cursor, value.r, value.g, value.b)
      } else if (value instanceof Vector4) {
        attribute.setXYZW(cursor, value.x, value.y, value.z, value.w)
      }
    }
  }
}

export const billboard = Snippet(
  (name) => $`
    vec3 ${name}(vec2 v, mat4 view){
      vec3 up = vec3(view[0][1], view[1][1], view[2][1]);
      vec3 right = vec3(view[0][0], view[1][0], view[2][0]);
      vec3 p = right * v.x + up * v.y;
      return p;
    }
  `
)

export const Billboard = (position: Input<"vec3">) =>
  Vec3($`${billboard}(${position}.xy, ${ViewMatrix} * ${InstanceMatrix})`)

export const Random = (n: Input<"float">) =>
  Float($`fract(sin(${n}) * 1e4)`, { name: "Random1" })

export const SoftParticle = (
  softness: Input<"float">,
  position: Input<"vec3">
) => {
  return Float(
    pipe(
      position,
      /* Convert position to view space and grab depth */
      (v) => LocalToViewSpace(v).z,
      /* Subtract from the existing scene depth at the fragment coordinate */
      (v) => Sub(v, SceneDepth(ScreenUV)),
      /* Divide by softness factor */
      (v) => Div(v, softness),
      /* Clamp between 0 and 1 */
      (v) => Saturate(v)
    ),

    { name: "Soft Particle" }
  )
}

export const SceneDepth = (xy: Input<"vec2">, resolution = 0.5) => {
  const width = 256
  const height = 256

  const renderTarget = new WebGLRenderTarget(width, height, {
    depthTexture: new DepthTexture(width, height)
  })

  let cursor = 0

  const uniform = Uniform("sampler2D", renderTarget.depthTexture)

  return Float(
    ReadPerspectiveDepth(xy, uniform, CameraNear, CameraFar),

    {
      name: "Scene Depth",

      update: (dt, camera, scene, gl) => {
        // const renderTarget = renderTargets[cursor]

        /* Update rendertarget size if necessary */
        const width = gl.domElement.width * gl.getPixelRatio() * resolution
        const height = gl.domElement.height * gl.getPixelRatio() * resolution

        if (renderTarget.width !== width || renderTarget.height !== height) {
          renderTarget.setSize(width, height)
        }

        /* Render depth texture */
        gl.setRenderTarget(renderTarget)
        gl.clear()
        gl.render(scene, camera)
        gl.setRenderTarget(null)

        /* Cycle render targets */
        // uniform.value = renderTargets[cursor].depthTexture
        cursor = (cursor + 1) % 2
      },

      dispose: () => {
        renderTarget.dispose()
      }
    }
  )
}
