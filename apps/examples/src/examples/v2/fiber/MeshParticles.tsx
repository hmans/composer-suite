import { Node, useFrame } from "@react-three/fiber"
import { forwardRef, useEffect } from "react"
import { ShaderModule } from "../vanilla"
import { MeshParticles as MeshParticlesImpl } from "../vanilla/MeshParticles"
import { ParticlesContext } from "./context"
import { useConstant } from "./util/useConstant"

export type MeshParticleProps = Node<
  MeshParticlesImpl,
  typeof MeshParticlesImpl
> & {
  modules?: ShaderModule[]
}

export const MeshParticles = forwardRef<MeshParticlesImpl, MeshParticleProps>(
  ({ children, modules = [], ...props }, ref) => {
    const instance = useConstant(() => new MeshParticlesImpl())

    useEffect(() => {
      instance.configureParticles(modules)
    }, [])

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
