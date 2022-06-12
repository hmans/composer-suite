import { Node, useFrame } from "@react-three/fiber"
import { forwardRef, useEffect, useMemo, useRef, useState } from "react"
import { ShaderModule } from "../vanilla"
import { MeshParticles as MeshParticlesImpl } from "../vanilla/MeshParticles"
import { ParticlesContext } from "./context"
import mergeRefs from "react-merge-refs"

export type MeshParticleProps = Node<
  MeshParticlesImpl,
  typeof MeshParticlesImpl
> & {
  modules?: ShaderModule[]
}

export const MeshParticles = forwardRef<MeshParticlesImpl, MeshParticleProps>(
  ({ children, modules = [], ...props }, ref) => {
    const [instance, setInstance] = useState<MeshParticlesImpl | null>(null)

    useEffect(() => {
      instance?.configureParticles(modules)
    }, [modules, instance])

    /* Advance time uniform every frame */
    useFrame((_, dt) => {
      if (!instance) return
      instance.material.uniforms.u_time.value += dt
    })

    return (
      <meshParticles {...props} ref={mergeRefs([ref, setInstance])}>
        {instance && (
          <ParticlesContext.Provider value={instance}>
            {children}
          </ParticlesContext.Provider>
        )}
      </meshParticles>
    )
  }
)
