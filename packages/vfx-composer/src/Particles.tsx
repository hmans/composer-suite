import { InstancedMeshProps } from "@react-three/fiber"
import React, { forwardRef, useRef, useImperativeHandle } from "react"
import { InstancedMesh } from "three"

export type ParticlesProps = InstancedMeshProps

export type Particles = {
  mesh: InstancedMesh
}

export const Particles = forwardRef<Particles, ParticlesProps>((props, ref) => {
  const mesh = useRef<InstancedMesh>(null!)

  useImperativeHandle(ref, () => ({
    mesh: mesh.current
  }))

  return <instancedMesh {...props} ref={mesh} />
})
