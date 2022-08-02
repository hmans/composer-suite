import { useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { between, plusMinus, upTo } from "randomish"
import {
  $,
  Float,
  Input,
  Mul,
  Resolution,
  Rotation3DZ,
  Snippet,
  Time,
  Vec2,
  Vec3,
  Vec4,
  Uniform,
  VertexPosition
} from "shader-composer"
import { MeshStandardMaterial, Vector3 } from "three"
import { depthTexture } from "three-vfx/src/layers"
import { InstanceSetupCallback } from "vfx-composer"
import { Emitter, Particles, VFX, VFXMaterial } from "vfx-composer/fiber"
import { ParticleAttribute } from "vfx-composer/units"
import { useDepthBuffer } from "./lib/useDepthBuffer"
import { smokeUrl } from "./textures"

const ViewPosition = (position: Input<"vec3">) =>
  Vec4($`viewMatrix * instanceMatrix * modelMatrix * vec4(${position}, 1.0);`, {
    varying: true
  })

const FragmentCoordinate = Vec2($`gl_FragCoord.xy`)

const ScreenUV = Vec2($`${FragmentCoordinate} / ${Resolution}`)

export const CameraNear = Uniform<"float", number>("float", 0)
export const CameraFar = Uniform<"float", number>("float", 1)

const SceneDepth = (xy: Input<"vec2">, texture: Input<"sampler2D">) =>
  Float(
    $`perspectiveDepthToViewZ(texture2D(${texture}, ${xy}).x, ${CameraNear}, ${CameraFar})`,
    { name: "Scene Depth" }
  )

const DistanceToSceneDepth = (depthTexture: Input<"sampler2D">) =>
  Float($`(${ViewPosition}.z - ${SceneDepth(ScreenUV, depthTexture)})`)

export const SoftParticle = (
  position: Input<"vec3">,
  softness: Input<"float">,
  depthTexture: Input<"sampler2D">
) =>
  Float($`clamp(${DistanceToSceneDepth(depthTexture)} / ${softness}, 0.0, 1.0)`)

export const Fog = () => {
  const depthTexture = useDepthBuffer().depthTexture
  const texture = useTexture(smokeUrl)

  const depthSampler2D = Uniform("sampler2D", depthTexture)

  const time = Time()
  const velocity = ParticleAttribute(new Vector3())
  const rotation = ParticleAttribute(0 as number)

  useFrame(({ camera }) => {
    Resolution.value.set(window.innerWidth, window.innerHeight)
    CameraNear.value = camera.near
    CameraFar.value = camera.far
  })

  const setup: InstanceSetupCallback = ({ position, scale }) => {
    position.set(plusMinus(10), between(0, 15), plusMinus(10))
    scale.setScalar(between(5, 10))
    velocity.value.randomDirection().multiplyScalar(upTo(0.002))
    rotation.value = plusMinus(0.1)
  }

  return (
    <Particles>
      <planeGeometry />
      <VFXMaterial
        baseMaterial={MeshStandardMaterial}
        map={texture}
        transparent
        depthWrite={false}
      >
        <VFX.SetAlpha alpha={0.5} />
        <VFX.Velocity velocity={velocity} time={time} />
        <VFX.Rotate rotation={Rotation3DZ(Mul(time, rotation))} />

        <VFX.Billboard />

        <VFX.Module
          module={(state) => ({
            ...state,
            alpha: Mul(state.alpha, SoftParticle(3, depthSampler2D))
          })}
        />
      </VFXMaterial>

      <Emitter count={10} setup={setup} />
    </Particles>
  )
}
