import { useTexture } from "@react-three/drei"
import { between, plusMinus, upTo } from "randomish"
import { AdditiveBlending, MeshStandardMaterial } from "three"
import {
  Emitter,
  MeshParticles,
  ParticlesMaterial,
  Repeat,
  SpawnSetup,
  VisualEffect
} from "three-vfx"

export const Snow = ({ intensity = 100, lifetime = 10 }) => {
  const texture = useTexture("/textures/particle.png")

  const setup = ({ preDelay = false } = {}): SpawnSetup => (c) => {
    c.position.set(5 + plusMinus(20), 40, plusMinus(20))
    c.velocity.set(-2 + plusMinus(2), -10 + plusMinus(2), plusMinus(2))
    c.delay = upTo(1) - (preDelay ? upTo(lifetime) : 0)
    c.lifetime = lifetime

    const scale = between(0.1, 0.2)
    c.scale[0].setScalar(scale)
    c.scale[1].setScalar(scale)
    c.alpha = [1, 1]
  }

  return (
    <VisualEffect>
      <MeshParticles maxParticles={intensity * lifetime} safetySize={intensity}>
        <planeGeometry />

        <ParticlesMaterial
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
    </VisualEffect>
  )
}
