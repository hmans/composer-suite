import { useConst } from "@hmans/use-const"
import { useTexture } from "@react-three/drei"
import { ComposableMaterial, Modules } from "material-composer-r3f"
import { Layers, useRenderPipeline } from "r3f-stage"
import { between, plusMinus, upTo } from "randomish"
import { Mul, Rotation3DZ, Time } from "shader-composer"
import { useUniformUnit } from "shader-composer-r3f"
import { MeshStandardMaterial, Vector3 } from "three"
import { Emitter, Particles, useParticleAttribute } from "vfx-composer-r3f"
import { WorldToInstanceSpace } from "./lib/WorldToInstanceSpace"
import { smokeUrl } from "./textures"

export const FogExample = () => (
  <group>
    <Fog />
    <Sculpture />
  </group>
)

export const Fog = () => {
  const texture = useTexture(smokeUrl)

  const time = useConst(() => Time())
  const velocity = useParticleAttribute(() => new Vector3())
  const rotation = useParticleAttribute(() => 0 as number)
  const scale = useParticleAttribute(() => 1 as number)

  const depth = useUniformUnit("sampler2D", useRenderPipeline().depth)

  return (
    <group>
      <Particles layers-mask={Layers.TransparentFX}>
        <planeGeometry />
        <ComposableMaterial
          baseMaterial={MeshStandardMaterial}
          map={texture}
          opacity={0.1}
          transparent
          depthWrite={false}
        >
          <Modules.Rotate rotation={Rotation3DZ(Mul(time, rotation))} />
          <Modules.Scale scale={scale} />
          <Modules.Velocity
            velocity={WorldToInstanceSpace(velocity)}
            time={time}
          />
          <Modules.Billboard />
          <Modules.Softness softness={5} depthTexture={depth} />
        </ComposableMaterial>

        <Emitter
          count={50}
          setup={({ position }) => {
            position.set(plusMinus(3), between(-2, 4), plusMinus(3))
            velocity.value.randomDirection().multiplyScalar(upTo(0.05))
            rotation.value = plusMinus(0.2)
            scale.value = between(1, 10)
          }}
        />
      </Particles>
    </group>
  )
}

const Sculpture = () => (
  <mesh position-y={0.6} castShadow>
    <torusKnotGeometry args={[2, 0.9, 128, 32]} />
    <meshStandardMaterial color="black" metalness={0.5} roughness={0.6} />
  </mesh>
)
