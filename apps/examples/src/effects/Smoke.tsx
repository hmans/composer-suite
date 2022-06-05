import { useTexture } from "@react-three/drei"
import { between } from "randomish"
import { Emitter, MeshParticles, TexturedParticlesMaterial } from "vfx"

export default () => {
  const texture = useTexture({ map: "/textures/smoke.png" })

  return (
    <MeshParticles>
      <planeGeometry />
      <TexturedParticlesMaterial {...texture} />

      <Emitter
        spawnCount={500}
        setup={(c) => {
          c.position.randomDirection().multiplyScalar(between(0, 50))
          c.alphaEnd = 1
          c.lifetime = 60
          c.scaleStart.setScalar(between(2, 5))
          c.scaleEnd.copy(c.scaleStart)
        }}
      />
    </MeshParticles>
  )
}
