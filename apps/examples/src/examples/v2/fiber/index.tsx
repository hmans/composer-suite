import { extend, Node } from "@react-three/fiber"
import { FC, ReactNode } from "react"
import { MeshParticles as MeshParticlesImpl } from "../vanilla/MeshParticles"

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshParticles_: Node<MeshParticlesImpl, typeof MeshParticlesImpl>
    }
  }
}

extend({ MeshParticles_: MeshParticlesImpl })

export const MeshParticles: FC<{ children?: ReactNode }> = () => {
  return <meshParticles_ args={[undefined, undefined, 1000]} />
}
