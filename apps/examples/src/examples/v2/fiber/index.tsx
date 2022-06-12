import { extend, Node } from "@react-three/fiber"
import { forwardRef } from "react"
import { MeshParticles as MeshParticlesImpl } from "../vanilla/MeshParticles"
import { ParticlesMaterial as ParticlesMaterialImpl } from "../vanilla/ParticlesMaterial"

export type MeshParticleProps = Node<
  MeshParticlesImpl,
  typeof MeshParticlesImpl
>

export const MeshParticles = forwardRef<MeshParticlesImpl, MeshParticleProps>(
  (props, ref) => <meshParticles_ ref={ref} {...props} />
)

export type ParticleMaterialProps = Node<
  ParticlesMaterialImpl,
  typeof ParticlesMaterialImpl
>

export const ParticlesMaterial = forwardRef<
  ParticlesMaterialImpl,
  ParticleMaterialProps
>((props, ref) => <particlesMaterial_ ref={ref} {...props} attach="material" />)

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshParticles_: MeshParticleProps
      particlesMaterial_: ParticleMaterialProps
    }
  }
}

extend({
  MeshParticles_: MeshParticlesImpl,
  ParticlesMaterial_: ParticlesMaterialImpl
})
