import { useFrame } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import { MeshStandardMaterial } from "three"
import { VisualEffect } from "three-vfx"
import { MeshParticles } from "./v2/fiber"
import { MeshParticles as MeshParticlesImpl, wobble } from "./v2/vanilla"

export const ComposableFiber = () => {
  const ref = useRef<MeshParticlesImpl>(null!)

  useEffect(() => {
    console.log(ref.current)
    ref.current.spawnParticle()
    ref.current.configureParticles([wobble])
  }, [])

  useFrame((_, dt) => {
    ref.current.material.uniforms.u_time.value += dt
  })

  return (
    <VisualEffect>
      <MeshParticles ref={ref}>
        <sphereGeometry />
        <particlesMaterial
          args={[{ baseMaterial: MeshStandardMaterial }]}
          attach="material"
        />
      </MeshParticles>
    </VisualEffect>
  )
}
