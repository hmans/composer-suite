import { Node } from "@react-three/fiber"
import { forwardRef } from "react"
import { MeshParticles as MeshParticlesImpl } from "../vanilla/MeshParticles"

export type MeshParticleProps = Node<
  MeshParticlesImpl,
  typeof MeshParticlesImpl
>

export const MeshParticles = forwardRef<MeshParticlesImpl, MeshParticleProps>(
  (props, ref) => {
    return <meshParticles {...props} ref={ref} />
  }
)
