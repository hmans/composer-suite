import { useTexture } from "@react-three/drei"
import { between, plusMinus, upTo } from "randomish"
import { AdditiveBlending, DoubleSide, MeshStandardMaterial } from "three"
import {
  Emitter,
  MeshParticles,
  ParticlesMaterial,
  Repeat,
  SpawnSetup,
  VisualEffect
} from "three-vfx"

export const DebrisExample = ({ intensity = 300 }) => {
  const texture = useTexture("/textures/particle.png")

  return (
    <VisualEffect>
      <MeshParticles maxParticles={intensity} safetySize={0}>
        <planeGeometry />

        <ParticlesMaterial
          baseMaterial={MeshStandardMaterial}
          map={texture}
          color="#aaa"
          blending={AdditiveBlending}
          depthTest={true}
          depthWrite={false}
          side={DoubleSide}
        />

        <Emitter
          count={intensity}
          setup={(c) => {
            c.quaternion.random()
            c.position.set(plusMinus(30), plusMinus(30), plusMinus(30))
            c.velocity.randomDirection().multiplyScalar(upTo(0.2))
            c.lifetime = Infinity

            const scale = between(0.1, 0.2)
            c.scale[0].setScalar(scale)
            c.scale[1].setScalar(scale)
            c.alpha = [1, 1]
          }}
        />
      </MeshParticles>
    </VisualEffect>
  )
}
