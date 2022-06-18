import { useDepthBuffer, useTexture } from "@react-three/drei"
import { between, insideSphere, plusMinus, upTo } from "randomish"
import { useEffect, useRef } from "react"
import {
  AdditiveBlending,
  Material,
  MeshStandardMaterial,
  ShaderMaterial,
  Vector3
} from "three"
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

  const material = useRef<Material>(null!)
  const depthBuffer = useDepthBuffer()

  useEffect(() => {
    material.current.uniforms.u_depth.value = depthBuffer
  }, [depthBuffer])

  const setup = ({ preDelay = 0 } = {}): SpawnSetup => (c) => {
    c.position.copy(insideSphere(20) as Vector3)
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
          ref={material}
          baseMaterial={MeshStandardMaterial}
          map={texture}
          blending={AdditiveBlending}
          depthTest={true}
          depthWrite={false}
          billboard
          transparent
          soft
          colorFunction="smoothstep(0.0, 1.0, sin(v_progress * PI))"
        />

        <Emitter count={50} setup={setup({ preDelay: 15 })} />

        <Repeat interval={5}>
          <Emitter count={20} setup={setup()} />
        </Repeat>
      </MeshParticles>
    </VisualEffect>
  )
}
