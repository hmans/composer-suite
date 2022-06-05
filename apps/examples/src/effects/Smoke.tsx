import { between } from "randomish"
import { useMemo } from "react"
import { AdditiveBlending, TextureLoader } from "three"
import { Emitter, MeshParticles, ParticlesMaterial } from "vfx"

export default () => {
  const texture = useMemo(
    () => new TextureLoader().load("/textures/smoke.png"),
    []
  )

  return (
    <MeshParticles>
      <planeGeometry />

      <ParticlesMaterial
        map={texture}
        alphaMap={texture}
        blending={AdditiveBlending}
        depthTest={true}
        depthWrite={false}
        billboard
      />

      <Emitter
        initialParticles={100}
        setup={(c) => {
          c.position.randomDirection().multiplyScalar(between(0, 50))
          c.velocity.randomDirection().multiplyScalar(between(0, 3))
          c.lifetime = 100
          c.scaleStart.setScalar(between(1, 50))
          c.scaleEnd.setScalar(0)
          c.alphaStart = between(0.05, 0.1)
          c.alphaEnd = 0
        }}
      />
    </MeshParticles>
  )
}
