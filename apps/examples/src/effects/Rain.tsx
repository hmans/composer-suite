import { between } from "randomish"
import { Emitter, MeshParticles, ParticlesMaterial } from "vfx"

export default () => {
  return (
    <MeshParticles>
      <dodecahedronBufferGeometry />
      <ParticlesMaterial color="#fff" />

      <Emitter
        spawnCount={100}
        setup={(c) => {
          c.position.randomDirection().multiplyScalar(between(0, 30))
          c.alphaEnd = 1
          c.lifetime = 60
        }}
      />
    </MeshParticles>
  )
}
