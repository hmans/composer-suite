import { MeshStandardMaterial } from "three"
import { Emitter, Particles, VFX, VFXMaterial } from "vfx-composer/fiber"

export const SoftParticlesExample = () => {
  return (
    <Particles>
      <planeGeometry args={[20, 20]} />

      <VFXMaterial
        baseMaterial={MeshStandardMaterial}
        color="hotpink"
        transparent
        depthWrite={false}
      >
        <VFX.Billboard />
        <VFX.SoftParticles softness={3} />
      </VFXMaterial>

      <Emitter />
    </Particles>
  )
}
