import { InstancedMeshProps } from "@react-three/fiber"
import React, { forwardRef, ReactNode, useRef } from "react"
import mergeRefs from "react-merge-refs"
import { InstancedMesh, Matrix4, Vector3 } from "three"
import { ParticlesContext } from "../ParticlesContext"
import { useMeshParticles } from "./useMeshParticles"

export const tmpScale = new Vector3()
export const tmpMatrix4 = new Matrix4()

export type MeshParticlesProps = InstancedMeshProps & {
  children?: ReactNode
  maxParticles?: number
  safetySize?: number
}

export const MeshParticles = forwardRef<InstancedMesh, MeshParticlesProps>(
  (
    { maxParticles = 1_000, safetySize = 100, children, geometry, ...props },
    ref
  ) => {
    const imesh = useRef<InstancedMesh>(null!)

    const { setup, spawnParticle } = useMeshParticles(maxParticles, safetySize)

    return (
      <instancedMesh
        ref={mergeRefs([imesh, ref, setup])}
        args={[geometry, undefined, maxParticles + safetySize]}
        {...props}
      >
        <ParticlesContext.Provider value={{ spawnParticle }}>
          {children}
        </ParticlesContext.Provider>
      </instancedMesh>
    )
  }
)
