import { between } from "randomish"
import { useMemo } from "react"
import { TextureLoader } from "three"
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
        transparent
        depthWrite={false}
      />

      {/* <ParticlesMaterial color="hotpink" /> */}
      {/* <boxGeometry /> */}

      <Emitter
        spawnCount={500}
        setup={(c) => {
          c.position.randomDirection().multiplyScalar(between(0, 50))
          c.lifetime = 1000
          c.scaleStart.setScalar(between(5, 10))
          c.scaleEnd.copy(c.scaleStart)
          c.alphaStart = 0.2
          c.alphaEnd = 0.2
        }}
      />
    </MeshParticles>
  )
}
