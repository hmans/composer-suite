import { useTexture } from "@react-three/drei"
import { between, plusMinus, upTo } from "randomish"
import { AdditiveBlending, MeshStandardMaterial } from "three"
import {
  Emitter,
  MeshParticles,
  MeshParticlesMaterial,
  Repeat,
  SpawnSetup
} from "three-vfx"
import { particleUrl } from "./textures"

export const Snow = ({ intensity = 100, lifetime = 10 }) => {
  const texture = useTexture(particleUrl)

  const setup = ({ preDelay = false } = {}): SpawnSetup => (c) => {
    c.position.set(5 + plusMinus(20), 40, plusMinus(20))
    c.velocity.set(-2 + plusMinus(2), -10 + plusMinus(2), plusMinus(2))
    c.lifetime.delay = upTo(1) - (preDelay ? upTo(lifetime) : 0)
    c.lifetime.duration = lifetime

    const scale = between(0.1, 0.2)
    c.scale.min.setScalar(scale)
    c.scale.max.setScalar(scale)
  }

  return (
    <MeshParticles maxParticles={intensity * lifetime} safetySize={intensity}>
      <planeGeometry />

      <MeshParticlesMaterial
        baseMaterial={MeshStandardMaterial}
        map={texture}
        blending={AdditiveBlending}
        depthTest={true}
        depthWrite={false}
        billboard
        transparent
      />

      <Emitter
        count={(intensity * lifetime) / 2}
        setup={setup({ preDelay: true })}
      />

      <Repeat interval={1}>
        <Emitter count={intensity} setup={setup()} />
      </Repeat>
    </MeshParticles>
  )
}
