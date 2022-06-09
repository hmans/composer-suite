import { between } from "randomish"
import { useMemo } from "react"
import { AdditiveBlending, MeshStandardMaterial, TextureLoader } from "three"
import { Emitter, MeshParticles, ParticlesMaterial, VisualEffect } from "vfx"

export const Fog = () => {
  const texture = useMemo(
    () => new TextureLoader().load("/textures/smoke.png"),
    []
  )

  return (
    <VisualEffect renderOrder={1}>
      <MeshParticles>
        <planeGeometry />

        <ParticlesMaterial
          baseMaterial={MeshStandardMaterial}
          map={texture}
          blending={AdditiveBlending}
          depthTest={true}
          depthWrite={false}
          billboard
        />

        <Emitter
          count={100}
          setup={(c) => {
            c.position.randomDirection().multiplyScalar(between(0, 50))
            c.velocity.randomDirection().multiplyScalar(between(0, 3))
            c.lifetime = Infinity
            c.scaleStart.setScalar(between(1, 50))
            c.scaleEnd.setScalar(0)
            c.alphaStart = between(0.05, 0.1)
            c.alphaEnd = 0
          }}
        />
      </MeshParticles>
    </VisualEffect>
  )
}
