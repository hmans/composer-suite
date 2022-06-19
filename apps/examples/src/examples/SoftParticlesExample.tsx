import { MeshStandardMaterial } from "three"
import {
  Emitter,
  MeshParticles,
  ParticlesMaterial,
  VisualEffect
} from "three-vfx"
import { useDepthBuffer } from "./lib/useDepthBuffer"

export const SoftParticlesExample = () => {
  const depthTexture = useDepthBuffer()

  return (
    <VisualEffect>
      <MeshParticles>
        <planeGeometry args={[20, 20]} />

        <ParticlesMaterial
          baseMaterial={MeshStandardMaterial}
          color="hotpink"
          billboard
          transparent
          softness={5}
          depthWrite={false}
          depthTexture={depthTexture}
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
