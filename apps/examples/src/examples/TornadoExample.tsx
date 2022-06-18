import { MeshStandardMaterial } from "three"
import {
  Emitter,
  MeshParticles,
  ParticlesMaterial,
  VisualEffect
} from "three-vfx"

const Tornado = () => {
  return (
    <MeshParticles>
      <cylinderGeometry args={[1, 1, 1, 24]} />

      <ParticlesMaterial baseMaterial={MeshStandardMaterial} color="#888" />

      <Emitter
        count={20}
        setup={(c, i) => {
          c.position.set(0, i, 0)
          c.scale[0].set(i / 2, 1, i / 2)
          c.lifetime = Infinity
        }}
      />
    </MeshParticles>
  )
}

export const TornadoExample = () => {
  return (
    <VisualEffect>
      <Tornado />
    </VisualEffect>
  )
}
