import { InstancedMeshProps } from "@react-three/fiber"
import React, {
  createContext,
  forwardRef,
  useContext,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef
} from "react"
import { CustomShaderMaterialMaster, VertexPosition } from "shader-composer"
import { Color, InstancedMesh, Material } from "three"
import CustomShaderMaterial from "three-custom-shader-material/vanilla"
import { ModulePipe, pipeModules } from "../modules"
import { SpawnOptions, useParticles } from "./useParticles"

export type ParticleModules = {
  position?: ModulePipe<"vec3">
  color?: ModulePipe<"vec3">
  alpha?: ModulePipe<"float">
}

export type ParticlesProps = InstancedMeshProps & {
  maxParticles?: number
  modules: ParticleModules
}

export type ParticlesAPI = {
  spawn: (count?: number, opts?: SpawnOptions) => void
}

export type Particles = {
  mesh: InstancedMesh
} & ParticlesAPI

const ParticlesAPIContext = createContext<ParticlesAPI>(null!)

export const useParticlesAPI = () => useContext(ParticlesAPIContext)

export const Particles = forwardRef<Particles, ParticlesProps>(
  ({ maxParticles = 1000, modules, children, ...props }, ref) => {
    /* Reference to the InstancedMesh we're about to create */
    const imesh = useRef<InstancedMesh>(null!)

    /* Create the Shader Composer master, using the modules provided. */
    const master = useMemo(
      () =>
        CustomShaderMaterialMaster({
          position: modules.position
            ? pipeModules(VertexPosition, ...modules.position)
            : undefined,

          diffuseColor: modules.color
            ? pipeModules(new Color("red"), ...modules.color)
            : undefined,

          alpha: modules.alpha ? pipeModules(1, ...modules.alpha) : undefined
        }),
      [modules]
    )

    /* Initialize particles. */
    const { spawn, shader } = useParticles(imesh, master)

    /* Patch material. */
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
        <ParticlesAPIContext.Provider value={{ spawn }}>
          {children}
        </ParticlesAPIContext.Provider>
      </instancedMesh>
    )
  }
)
