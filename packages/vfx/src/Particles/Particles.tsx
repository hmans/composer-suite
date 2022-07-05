import { InstancedMeshProps } from "@react-three/fiber"
import React, { forwardRef, ReactNode, useLayoutEffect, useRef } from "react"
import mergeRefs from "react-merge-refs"
import { InstancedMesh, Matrix4 } from "three"

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

    useLayoutEffect(() => {
      /* Spawn a single particle */
      imesh.current.setMatrixAt(0, new Matrix4())
      imesh.current.count = 1
    }, [])

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
