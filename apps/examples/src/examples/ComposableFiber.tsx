import { MeshStandardMaterial } from "three"
import { Emitter, MeshParticles, ParticlesMaterial } from "./v2/fiber"
import { makeShake, wobble } from "./v2/vanilla"

export const ComposableFiber = () => {
  return (
    <MeshParticles modules={[makeShake("x", 10, 5), wobble]}>
      <dodecahedronGeometry />
      <ParticlesMaterial baseMaterial={MeshStandardMaterial} />

      <Emitter />
    </MeshParticles>
  )
}
