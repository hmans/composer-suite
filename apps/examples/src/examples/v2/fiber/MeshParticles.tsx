import { Node } from "@react-three/fiber"
import { createContext, forwardRef, useState } from "react"
import { MeshParticles as MeshParticlesImpl } from "../vanilla/MeshParticles"
import mergeRefs from "react-merge-refs"
import { useConstant } from "./util/useConstant"

export type MeshParticleProps = Node<
  MeshParticlesImpl,
  typeof MeshParticlesImpl
>

const ParticlesContext = createContext<MeshParticlesImpl>(null!)

export const MeshParticles = forwardRef<MeshParticlesImpl, MeshParticleProps>(
  ({ ...props }, ref) => {
    const instance = useConstant(() => new MeshParticlesImpl())

    return <primitive object={instance} {...props} ref={ref} />
  }
)
