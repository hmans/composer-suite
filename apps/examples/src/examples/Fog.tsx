import { useTexture } from "@react-three/drei"
import { between, insideSphere, plusMinus, upTo } from "randomish"
import { MeshStandardMaterial, NormalBlending, Vector3 } from "three"
import {
  Emitter,
  MeshParticles,
  MeshParticlesMaterial,
  Repeat,
  SpawnSetup
} from "three-vfx"
import { useDepthBuffer } from "./lib/useDepthBuffer"
import { smokeUrl } from "./textures"

export const Fog = () => {
  const depthTexture = useDepthBuffer().depthTexture

  const texture = useTexture(smokeUrl)

  const setup = ({ preDelay = 0 } = {}): SpawnSetup => (c) => {
    c.position.set(0, 6, 0).add(insideSphere(5) as Vector3)
    c.velocity.randomDirection().multiplyScalar(between(0, 1))
    c.lifetime.delay = upTo(5) - preDelay
    c.lifetime.duration = 30
    c.scale.min.setScalar(between(10, 50))
    c.scale.max.setScalar(c.scale.min.x * (1.0 + plusMinus(0.3)))
    c.alpha.min = 0
    c.alpha.max = between(0.05, 0.1)
  }

  return (
    <MeshParticles maxParticles={500}>
      <planeGeometry />

      <MeshParticlesMaterial
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
  )
}
