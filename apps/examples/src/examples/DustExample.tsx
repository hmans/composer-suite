import { useTexture } from "@react-three/drei"
import { between, plusMinus, upTo } from "randomish"
import { AdditiveBlending, DoubleSide, MeshStandardMaterial } from "three"
import { Emitter, MeshParticles, MeshParticlesMaterial } from "three-vfx"
import { particleUrl } from "./textures"

export const DustExample = ({ intensity = 300 }) => {
  const texture = useTexture(particleUrl)

  return (
    <MeshParticles maxParticles={intensity} safetySize={0}>
      <planeGeometry />

      <MeshParticlesMaterial
        baseMaterial={MeshStandardMaterial}
        map={texture}
        color="#aaa"
        blending={AdditiveBlending}
        depthTest={true}
        depthWrite={false}
        side={DoubleSide}
      />

      <Emitter
        count={intensity}
        setup={(c) => {
          c.quaternion.random()
          c.position.set(plusMinus(30), plusMinus(30), plusMinus(30))
          c.velocity.randomDirection().multiplyScalar(upTo(0.2))

          const scale = between(0.1, 0.2)
          c.scale.min.setScalar(scale)
          c.scale.max.setScalar(scale)
        }}
      />
    </MeshParticles>
  )
}
