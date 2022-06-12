import { useRef } from "react"
import { MeshStandardMaterial } from "three"
import { Emitter, MeshParticles, ParticlesMaterial } from "./v2/fiber"
import {
  makeShake,
  MeshParticles as MeshParticlesImpl,
  wobble
} from "./v2/vanilla"

export const ComposableFiber = () => {
  const ref = useRef<MeshParticlesImpl>(null!)

  return (
    <MeshParticles ref={ref} modules={[wobble, makeShake("x", 10, 5)]}>
      <sphereGeometry />
      <ParticlesMaterial baseMaterial={MeshStandardMaterial} />

      <Emitter />
    </MeshParticles>
  )
}
