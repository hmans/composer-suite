import { InstancedMeshProps } from "@react-three/fiber"
import React, {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef
} from "react"
import { CustomShaderMaterialMaster } from "shader-composer"
import { InstancedMesh, Material } from "three"
import CustomShaderMaterial from "three-custom-shader-material/vanilla"
import { LifetimeModule, modularPipe, Module } from "./modules"
import { SpawnOptions, useParticles } from "./useParticles"

export type ParticlesProps = InstancedMeshProps & {
  maxParticles?: number
  modules?: Module[]
}

export type Particles = {
  mesh: InstancedMesh
  spawn: (count?: number, opts?: SpawnOptions) => void
}

export const Particles = forwardRef<Particles, ParticlesProps>(
  ({ maxParticles = 1000, modules = [], children, ...props }, ref) => {
    const imesh = useRef<InstancedMesh>(null!)

    const variables = useMemo(() => modularPipe(LifetimeModule(), ...modules), [
      modules
    ])

    const master = useMemo(
      () =>
        CustomShaderMaterialMaster({
          position: variables.position,
          diffuseColor: variables.color,
          alpha: variables.alpha
        }),
      [variables]
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
