import { between } from "randomish"
import { useMemo } from "react"
import { AdditiveBlending, TextureLoader } from "three"
import { Emitter, MeshParticles, TexturedParticlesMaterial } from "vfx"

export default () => {
  const texture = useMemo(
    () => new TextureLoader().load("/textures/smoke.png"),
    []
  )

  return (
    <MeshParticles>
      <planeGeometry />

      <TexturedParticlesMaterial
        map={texture}
        alphaMap={texture}
        blending={AdditiveBlending}
        depthTest={true}
        depthWrite={false}
      />

      <Emitter
        spawnCount={100}
        setup={(c) => {
          c.position.randomDirection().multiplyScalar(between(0, 50))
          c.velocity.randomDirection().multiplyScalar(between(0, 3))
          c.lifetime = 1000
          c.scaleStart.setScalar(between(1, 50))
          c.scaleEnd.copy(c.scaleStart)
          c.alphaStart = 0.1
          c.alphaEnd = 0.1
        }}
      />
    </MeshParticles>
  )
}
