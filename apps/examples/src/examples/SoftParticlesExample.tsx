import { Mul } from "shader-composer"
import { MeshStandardMaterial } from "three"
import { Emitter, Particles, VFX, VFXMaterial } from "vfx-composer/fiber"
import { SoftParticle } from "./lib/softies"

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
        <VFX.Module
          module={(state) => ({
            ...state,
            alpha: Mul(state.alpha, SoftParticle(3, state.position))
          })}
        />
      </VFXMaterial>

      <Emitter />
    </Particles>
  )
}
