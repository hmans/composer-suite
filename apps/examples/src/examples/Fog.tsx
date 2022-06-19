import { useTexture } from "@react-three/drei"
import { between, insideSphere, plusMinus, upTo } from "randomish"
import { MeshStandardMaterial, NormalBlending, Vector3 } from "three"
import {
  Emitter,
  MeshParticles,
  ParticlesMaterial,
  Repeat,
  SpawnSetup,
  VisualEffect
} from "three-vfx"
import { useDepthBuffer } from "./lib/useDepthBuffer"

export const Fog = () => {
  const depthTexture = useDepthBuffer().depthTexture

  const texture = useTexture("/textures/smoke.png")

  const setup = ({ preDelay = 0 } = {}): SpawnSetup => (c) => {
    c.position.set(0, 6, 0).add(insideSphere(5) as Vector3)
    c.velocity.randomDirection().multiplyScalar(between(0, 1))
    c.delay = upTo(5) - preDelay
    c.lifetime = 30
    c.scale[0].setScalar(between(10, 50))
    c.scale[1].setScalar(c.scale[0].x * (1.0 + plusMinus(0.3)))
    c.alpha = [0, between(0.05, 0.1)]
  }

  return (
    <VisualEffect>
      <MeshParticles maxParticles={500}>
        <planeGeometry />

        <ParticlesMaterial
          baseMaterial={MeshStandardMaterial}
          map={texture}
          blending={NormalBlending}
          depthTest={true}
          depthWrite={false}
          depthTexture={depthTexture}
          billboard
          softness={5}
          transparent
          colorFunction="smoothstep(0.0, 1.0, sin(v_progress * PI))"
        />

        <Emitter count={20} setup={setup({ preDelay: 15 })} />

        <Repeat interval={5}>
          <Emitter count={() => between(5, 10)} setup={setup()} />
        </Repeat>
      </MeshParticles>
    </VisualEffect>
  )
}
