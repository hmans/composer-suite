import { extend, GroupProps, Node } from "@react-three/fiber"
import { forwardRef } from "react"
import { Group } from "three"
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

export const VisualEffect = forwardRef<Group, GroupProps>((props, ref) => (
  <group {...props} ref={ref} />
))
