import { useTexture } from "@react-three/drei"
import { between } from "randomish"
import { useMemo } from "react"
import { TextureLoader, Vector3 } from "three"
import {
  Emitter,
  MeshParticles,
  ParticlesMaterial,
  TexturedParticlesMaterial
} from "vfx"

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
        opacity={0.5}
        // depthWrite={false}
      />

      {/* <ParticlesMaterial color="hotpink" /> */}
      {/* <boxGeometry /> */}

      <Emitter
        spawnCount={500}
        setup={(c) => {
          c.position.randomDirection().multiplyScalar(between(0, 50))
          // c.alphaEnd = 1
          c.lifetime = 10
          c.scaleStart.setScalar(10)
          c.scaleEnd.copy(c.scaleStart)
          // c.velocity.copy(c.position)
        }}
      />
    </MeshParticles>
  )
}
