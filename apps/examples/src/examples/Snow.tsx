import { useTexture } from "@react-three/drei"
import { between, insideSphere, plusMinus, upTo } from "randomish"
import { AdditiveBlending, MeshStandardMaterial, Vector3 } from "three"
import {
  Emitter,
  MeshParticles,
  ParticlesMaterial,
  Repeat,
  SpawnSetup,
  VisualEffect
} from "three-vfx"

export const Snow = () => {
  const texture = useTexture("/textures/particle.png")

  const setup = ({ preDelay = 0 } = {}): SpawnSetup => (c) => {
    c.position.set(5 + plusMinus(20), 30, plusMinus(20))
    c.velocity.set(-2 + plusMinus(2), -10 + plusMinus(2), plusMinus(2))
    c.delay = upTo(1) - preDelay
    c.lifetime = 10

    const scale = between(0.1, 0.2)
    c.scale[0].setScalar(scale)
    c.scale[1].setScalar(scale)
    c.alpha = [1, 1]
  }

  return (
    <VisualEffect>
      <MeshParticles maxParticles={10_000} safetySize={1000}>
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

        {/* <Emitter count={50} setup={setup({ preDelay: 15 })} /> */}

        <Repeat interval={1}>
          <Emitter count={1000} setup={setup()} />
        </Repeat>
      </MeshParticles>
    </VisualEffect>
  )
}
