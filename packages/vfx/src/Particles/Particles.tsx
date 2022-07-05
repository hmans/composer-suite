import { InstancedMeshProps } from "@react-three/fiber"
import React, { forwardRef, ReactNode, useRef } from "react"
import mergeRefs from "react-merge-refs"
import { InstancedMesh } from "three"

export type ParticlesProps = InstancedMeshProps & {
  children?: ReactNode
  maxParticles?: number
  safetySize?: number
}

export type Particles = InstancedMesh

export const Particles = forwardRef<Particles, ParticlesProps>(
  (
    { maxParticles = 1_000, safetySize = 100, children, geometry, ...props },
    ref
  ) => {
    const imesh = useRef<Particles>(null!)

    return (
      <instancedMesh
        ref={mergeRefs([imesh, ref])}
        args={[geometry, undefined, maxParticles + safetySize]}
        {...props}
      >
        {children}
      </instancedMesh>
    )
  }
)
