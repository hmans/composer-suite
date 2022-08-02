import { useFrame } from "@react-three/fiber"
import {
  $,
  Float,
  Input,
  InstanceMatrix,
  ModelMatrix,
  Mul,
  Resolution,
  Uniform,
  Vec2,
  Vec4,
  ViewMatrix
} from "shader-composer"
import { MeshStandardMaterial, Vector4 } from "three"
import { Emitter, Particles, VFX, VFXMaterial } from "vfx-composer/fiber"
import { useDepthBuffer } from "./lib/useDepthBuffer"

const FragmentCoordinate = Vec2($`gl_FragCoord.xy`)

const ScreenUV = Vec2($`${FragmentCoordinate} / ${Resolution}`)

const ToViewSpace = (position: Input<"vec3">) =>
  Vec4(
    $`${ViewMatrix} * ${InstanceMatrix} * ${ModelMatrix} * vec4(${position}, 1.0)`
  )

const SoftParticle = (
  softness: Input<"float">,
  depthTexture: Input<"sampler2D">,
  position: Input<"vec3">
) =>
  Float(1, {
    name: "Soft Particle",
    fragment: {
      header: $`
        float readDepth(vec2 coord) {
          float depthZ = texture2D(${depthTexture}, coord).x;
          float viewZ = perspectiveDepthToViewZ(depthZ, ${CameraNear}, ${CameraFar});
          return viewZ;
        }
      `,
      body: $`
        /* Get the existing depth at the fragment position */
        float depth = readDepth(${ScreenUV});

        float v_viewZ = ${Float(0, {
          varying: true,
          vertex: {
            body: $`value = (${ToViewSpace(position)}).z;`
          }
        })};

        /* Prepare some convenient local variables */
        float d = depth;
        float z = v_viewZ;
        float softness = ${softness};

        /* Calculate the distance to the fragment */
        float distance = z - d;

        /* Apply the distance to the fragment alpha */
        value = clamp(distance / softness, 0.0, 1.0);
      `
    }
  })

export const CameraNear = Uniform<"float", number>("float", 0)
export const CameraFar = Uniform<"float", number>("float", 1)

export const SoftParticlesExample = () => {
  const { depthTexture } = useDepthBuffer()

  const depthSampler2D = Uniform("sampler2D", depthTexture)

  useFrame(({ camera }) => {
    Resolution.value.set(window.innerWidth, window.innerHeight)
    CameraNear.value = camera.near
    CameraFar.value = camera.far
  })

  return (
    <Particles>
      <planeGeometry args={[20, 20]} />

      <VFXMaterial
        baseMaterial={MeshStandardMaterial}
        color="hotpink"
        transparent
        depthWrite={false}
      >
        <VFX.Billboard />
        <VFX.Module
          module={(state) => ({
            ...state,
            alpha: Mul(
              state.alpha,
              SoftParticle(1, depthSampler2D, state.position)
            )
          })}
        />
      </VFXMaterial>

      <Emitter />
    </Particles>
  )
}
