import { useTexture } from "@react-three/drei"
import { between, insideSphere } from "randomish"
import { AdditiveBlending, MeshStandardMaterial, Vector3 } from "three"
import {
  Delay,
  Emitter,
  MeshParticles,
  ParticlesMaterial,
  Repeat,
  SpawnSetup,
  VisualEffect
} from "three-vfx"

export const Fog = () => {
  const texture = useTexture("/textures/smoke.png")

  const setup: SpawnSetup = (c) => {
    c.position.copy(insideSphere(20) as Vector3)
    c.velocity.randomDirection().multiplyScalar(between(0, 1))
    c.lifetime = 100
    c.scale[0].setScalar(0)
    c.scale[1].setScalar(between(1, 50))
    c.alpha = [between(0.05, 0.1), 0]
  }

  return (
    <VisualEffect>
      <MeshParticles maxParticles={500}>
        <planeGeometry />

        <ParticlesMaterial
          baseMaterial={MeshStandardMaterial}
          map={texture}
          blending={AdditiveBlending}
          depthTest={true}
          depthWrite={false}
          billboard
          transparent
          scaleFunction="smoothstep(0.0, 1.0, sin(v_progress * PI))"
        />

        <Emitter count={50} setup={setup} />

        <Delay seconds={10}>
          <Repeat interval={10}>
            <Emitter count={10} setup={setup} />
          </Repeat>
        </Delay>
      </MeshParticles>
    </VisualEffect>
  )
}
