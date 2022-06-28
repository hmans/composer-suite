import { MeshStandardMaterial } from "three"
import { Emitter, Particles, ParticlesMaterial, Repeat } from "three-vfx"

export default function() {
  return (
    <group position-y={15}>
      <Particles>
        <sphereGeometry args={[0.25]} />
        <ParticlesMaterial baseMaterial={MeshStandardMaterial} />

        <Repeat interval={0.25}>
          <Emitter count={1} />
        </Repeat>
      </Particles>
    </group>
  )
}
