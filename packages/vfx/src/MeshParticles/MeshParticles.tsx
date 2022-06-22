import { InstancedMeshProps } from "@react-three/fiber"
import React, { forwardRef, ReactNode } from "react"
import mergeRefs from "react-merge-refs"
import { ParticlesContext } from "../ParticlesContext"
import { useMeshParticles, type MeshParticles as MeshParticlesType } from "./useMeshParticles"

export type MeshParticlesProps = InstancedMeshProps & {
  children?: ReactNode
  maxParticles?: number
  safetySize?: number
}

export const MeshParticles = forwardRef<MeshParticlesType, MeshParticlesProps>(
  (
    { maxParticles = 1_000, safetySize = 100, children, geometry, ...props },
    ref
  ) => {
    const [imesh, api] = useMeshParticles(maxParticles, safetySize)

    return (
      <instancedMesh
        ref={mergeRefs([imesh, ref])}
        args={[geometry, undefined, maxParticles + safetySize]}
        {...props}
      >
        <ParticlesContext.Provider value={api}>
          {children}
        </ParticlesContext.Provider>
      </instancedMesh>
    )
  }
)
