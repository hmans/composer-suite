import { Node, useFrame } from "@react-three/fiber"
import { forwardRef, useEffect, useMemo } from "react"
import { ShaderModule } from "../vanilla"
import { MeshParticles as MeshParticlesImpl } from "../vanilla/MeshParticles"
import { ParticlesContext } from "./context"

export type MeshParticleProps = Node<
  MeshParticlesImpl,
  typeof MeshParticlesImpl
> & {
  modules?: ShaderModule[]
}

export const MeshParticles = forwardRef<MeshParticlesImpl, MeshParticleProps>(
  ({ children, modules = [], ...props }, ref) => {
    const instance = useMemo(() => {
      console.log("new MeshParticles")
      return new MeshParticlesImpl()
    }, [modules])

    useEffect(() => {
      instance.configureParticles(modules)
    }, [modules, instance])

    /* Advance time uniform every frame */
    useFrame((_, dt) => {
      instance.material.uniforms.u_time.value += dt
    })

    /* Dispose on unmount */
    useEffect(() => () => instance.dispose(), [])

    return (
      <primitive object={instance} {...props} ref={ref}>
        <ParticlesContext.Provider value={instance}>
          {children}
        </ParticlesContext.Provider>
      </primitive>
    )
  }
)
