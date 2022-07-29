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

export type ParticleInputs = {
  position?: ModulePipe<"vec3">
  color?: ModulePipe<"vec3">
  alpha?: ModulePipe<"float">
}

export type ParticlesProps = InstancedMeshProps & {
  maxParticles?: number
  inputs: ParticleInputs
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
  ({ maxParticles = 1000, inputs, children, ...props }, ref) => {
    /* Reference to the InstancedMesh we're about to create */
    const imesh = useRef<InstancedMesh>(null!)

    /* Create the Shader Composer master, using the inputs provided. */
    const master = useMemo(
      () =>
        CustomShaderMaterialMaster({
          position: inputs.position
            ? pipeModules(VertexPosition, ...inputs.position)
            : undefined,

          diffuseColor: inputs.color
            ? pipeModules(new Color("red"), ...inputs.color)
            : undefined,

          alpha: inputs.alpha ? pipeModules(1, ...inputs.alpha) : undefined
        }),
      [inputs]
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
