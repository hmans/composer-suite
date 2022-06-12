import { Node } from "@react-three/fiber"
import { createContext, forwardRef, useEffect } from "react"
import { MeshParticles as MeshParticlesImpl } from "../vanilla/MeshParticles"
import { useConstant } from "./util/useConstant"

export type MeshParticleProps = Node<
  MeshParticlesImpl,
  typeof MeshParticlesImpl
>

const ParticlesContext = createContext<MeshParticlesImpl>(null!)

export const MeshParticles = forwardRef<MeshParticlesImpl, MeshParticleProps>(
  ({ children, ...props }, ref) => {
    const instance = useConstant(() => new MeshParticlesImpl())

    useEffect(
      () => () => {
        instance.dispose()
      },
      []
    )

    return (
      <primitive object={instance} {...props} ref={ref}>
        <ParticlesContext.Provider value={instance}>
          {children}
        </ParticlesContext.Provider>
      </primitive>
    )
  }
)
