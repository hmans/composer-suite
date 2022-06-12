import { useFrame } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import { MeshStandardMaterial } from "three"
import { VisualEffect } from "three-vfx"
import { MeshParticles, wobble } from "./v2/vanilla"

export const ComposableFiber = () => {
  const ref = useRef<MeshParticles>(null!)

  useEffect(() => {
    ref.current.configureParticles([wobble])
    ref.current.spawnParticle()
  }, [])

  useFrame((_, dt) => {
    ref.current.material.uniforms.u_time.value += dt
  })

  return (
    <VisualEffect>
      <meshParticles ref={ref}>
        <sphereGeometry />
        <particlesMaterial
          args={[{ baseMaterial: MeshStandardMaterial }]}
          attach="material"
        />
      </meshParticles>
    </VisualEffect>
  )
}
