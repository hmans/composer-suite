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

export const Fog = () => {
  const texture = useTexture("/textures/smoke.png")

  const setup = ({ preDelay = 0 } = {}): SpawnSetup => (c) => {
    c.lifetime = 300
    c.scale[0].setScalar(30)
    c.scale[1].setScalar(30)
    c.alpha = [0.5, 0.5]
  }

  return (
    <VisualEffect>
      <MeshParticles maxParticles={500}>
        <planeGeometry />

        <ParticlesMaterial
          baseMaterial={MeshStandardMaterial}
          map={texture}
          blending={AdditiveBlending}
          // depthTest={false}
          depthWrite={false}
          billboard
          transparent
          soft
          colorFunction="smoothstep(0.0, 1.0, sin(v_progress * PI))"
        />

        <Emitter count={1} setup={setup()} />
      </MeshParticles>
    </VisualEffect>
  )
}
