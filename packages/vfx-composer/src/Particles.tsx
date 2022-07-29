import { InstancedMeshProps } from "@react-three/fiber"
import React, {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef
} from "react"
import {
  CustomShaderMaterialMaster,
  Input,
  VertexPosition
} from "shader-composer"
import { InstancedMesh, Material } from "three"
import CustomShaderMaterial from "three-custom-shader-material/vanilla"
import { LifetimeModule, modularPipe, Module } from "./modules"
import { SpawnOptions, useParticles } from "./useParticles"

export type ParticleInputs = {
  position?: Input<"vec3">
  color?: Input<"vec3">
  alpha?: Input<"float">
}

export type ParticlesProps = InstancedMeshProps & {
  maxParticles?: number
  inputs: ParticleInputs
}

export type Particles = {
  mesh: InstancedMesh
  spawn: (count?: number, opts?: SpawnOptions) => void
}

export const Particles = forwardRef<Particles, ParticlesProps>(
  ({ maxParticles = 1000, inputs, children, ...props }, ref) => {
    const imesh = useRef<InstancedMesh>(null!)

    const master = useMemo(
      () =>
        CustomShaderMaterialMaster({
          position: inputs.position,
          diffuseColor: inputs.color,
          alpha: inputs.alpha
        }),
      [inputs]
    )

    const { spawn, shader } = useParticles(imesh, master)

    /* Patch material */
    useLayoutEffect(() => {
      if (!imesh.current) return

      const material = imesh.current.material as Material

      const csm = new CustomShaderMaterial({
        ...shader,
        baseMaterial: material
      })

      imesh.current.material = csm

      return () => {
        imesh.current.material = material
        csm.dispose()
      }
    }, [shader])

    useImperativeHandle(ref, () => ({
      mesh: imesh.current!,
      spawn
    }))

    return (
      <instancedMesh
        ref={imesh}
        args={[undefined, undefined, maxParticles]}
        {...props}
      >
        {children}
      </instancedMesh>
    )
  }
)
