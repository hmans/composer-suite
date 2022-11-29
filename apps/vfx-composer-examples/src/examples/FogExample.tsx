import { useConst } from "@hmans/use-const"
import { useTexture } from "@react-three/drei"
import { Composable, Modules } from "material-composer-r3f"
import { FlatStage, Layers, useRenderPipeline } from "r3f-stage"
import { between, plusMinus, upTo } from "randomish"
import { Mul, Rotation3DZ, Time } from "@shader-composer/three"
import { useUniformUnit } from "@shader-composer/r3f"
import { Vector3 } from "three"
import {
  Emitter,
  InstancedParticles,
  useParticleAttribute
} from "vfx-composer-r3f"
import { smokeUrl } from "./textures"

export const FogExample = () => (
  <FlatStage>
    <Fog />
    <Sculpture />
  </FlatStage>
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
      <InstancedParticles layers-mask={1 << Layers.TransparentFX}>
        <planeGeometry />

        <Composable.MeshStandardMaterial
          map={texture}
          opacity={0.1}
          transparent
          depthWrite={false}
        >
          <Modules.Rotate rotation={Rotation3DZ(Mul(time, rotation))} />
          <Modules.Scale scale={scale} />
          <Modules.Velocity direction={velocity} time={time} />
          <Modules.Billboard />
          <Modules.Softness softness={5} depthTexture={depth} />
        </Composable.MeshStandardMaterial>

        <Emitter
          limit={50}
          rate={Infinity}
          setup={({ mesh, position }) => {
            position.set(plusMinus(3), between(-2, 4), plusMinus(3))
            velocity.write(mesh, (v) =>
              v.randomDirection().multiplyScalar(upTo(0.05))
            )
            rotation.write(mesh, plusMinus(0.2))
            scale.write(mesh, between(1, 10))
          }}
        />
      </InstancedParticles>
    </group>
  )
}

const Sculpture = () => (
  <mesh position-y={0.6} castShadow>
    <torusKnotGeometry args={[2, 0.9, 128, 32]} />
    <meshStandardMaterial color="black" metalness={0.5} roughness={0.6} />
  </mesh>
)
