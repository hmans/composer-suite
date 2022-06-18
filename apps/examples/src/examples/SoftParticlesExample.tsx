import { useTexture } from "@react-three/drei"
import { MeshStandardMaterial } from "three"
import {
  Emitter,
  MeshParticles,
  ParticlesMaterial,
  VisualEffect
} from "three-vfx"

export const SoftParticlesExample = () => {
  return (
    <VisualEffect>
      <MeshParticles>
        <planeGeometry args={[20, 20]} />

        <ParticlesMaterial
          baseMaterial={MeshStandardMaterial}
          color="hotpink"
          billboard
          transparent
          soft
          depthWrite={false}
        />

        <Emitter
          count={1}
          setup={(c) => {
            c.lifetime = Infinity
          }}
        />
      </MeshParticles>
    </VisualEffect>
  )
}
