import { useTexture } from "@react-three/drei"
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
  Uniform
} from "shader-composer"
import { MeshStandardMaterial, Vector3 } from "three"
import { InstanceSetupCallback } from "vfx-composer"
import { Emitter, Particles, VFX, VFXMaterial } from "vfx-composer/fiber"
import { ParticleAttribute } from "vfx-composer/units"
import { useDepthBuffer } from "./lib/useDepthBuffer"
import { smokeUrl } from "./textures"

const ViewPosition = Vec4(
  $`viewMatrix * instanceMatrix * modelMatrix * vec4(csm_Position, 1.0);`,
  { varying: true }
)

const FragmentCoordinate = Vec2($`gl_FragCoord.xy`)

const ScreenUV = Vec2($`${FragmentCoordinate} / ${Resolution}`)

const ViewZ = Float($`${ViewPosition}.z`, { varying: true })

const readDepth = Snippet(
  (name) => $`
    float ${name}(vec2 coord, sampler2D depthTexture, float near, float far) {
      float depthZ = texture2D(depthTexture, coord).x;
      float viewZ = perspectiveDepthToViewZ(depthZ, near, far);
      return viewZ;
    }
  `
)

const SoftParticle = (color: Input<"vec3">, depthTexture: Input<"sampler2D">) =>
  Vec3(color, {
    fragment: {
      body: $`
        /* Get the existing depth at the fragment position */
        float depth = ${readDepth}(${ScreenUV}, ${depthTexture}, 0.0, 1.0);

        float d = depth;
        float z = ${ViewZ};

        float distance = z - d;
        float softness = 1.0;
        value = ${color} * clamp(distance / softness, 0.0, 1.0);
      `
    }
  })

export const Fog = () => {
  const depthTexture = useDepthBuffer().depthTexture
  const texture = useTexture(smokeUrl)

  const depthSampler2D = Uniform("sampler2D", depthTexture)

  const time = Time()
  const velocity = ParticleAttribute(new Vector3())
  const rotation = ParticleAttribute(0 as number)

  const setup: InstanceSetupCallback = ({ position, scale }) => {
    position.set(plusMinus(10), between(0, 15), plusMinus(10))
    scale.setScalar(between(5, 10))
    velocity.value.randomDirection().multiplyScalar(upTo(0.01))
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
        <VFX.SetAlpha alpha={0.15} />
        <VFX.Velocity velocity={velocity} time={time} />
        <VFX.Rotate rotation={Rotation3DZ(Mul(time, rotation))} />
        <VFX.Billboard />

        <VFX.Module
          module={(state) => ({
            ...state,
            color: SoftParticle(state.color, depthSampler2D)
          })}
        />
      </VFXMaterial>

      <Emitter count={10} setup={setup} />
    </Particles>
  )
}
