import { extend, Node } from "@react-three/fiber"
import { MeshParticles as MeshParticlesImpl } from "../vanilla/MeshParticles"
import { ParticlesMaterial as ParticlesMaterialImpl } from "../vanilla/ParticlesMaterial"
import { MeshParticleProps } from "./MeshParticles"

export * from "./MeshParticles"

export type ParticleMaterialProps = Node<
  ParticlesMaterialImpl,
  typeof ParticlesMaterialImpl
>

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshParticles: MeshParticleProps
      particlesMaterial: ParticleMaterialProps
    }
  }
}

extend({
  MeshParticles: MeshParticlesImpl,
  ParticlesMaterial: ParticlesMaterialImpl
})
