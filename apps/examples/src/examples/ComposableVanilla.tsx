import { useFrame } from "@react-three/fiber"
import { useEffect, useMemo } from "react"
import { MeshStandardMaterial, SphereGeometry } from "three"
import "./v2/fiber"
import {
  makeShake,
  MeshParticles,
  ParticlesMaterial,
  wobble
} from "./v2/vanilla"

export const ComposableVanilla = () => {
  /* Create mesh, using vanilla imperative code */
  const mesh = useMemo(() => {
    const material = new ParticlesMaterial({
      baseMaterial: new MeshStandardMaterial({ color: "white" })
    })
    const geometry = new SphereGeometry()
    const mesh = new MeshParticles(geometry, material, 1100)

    mesh.configureParticles([wobble, makeShake("x", 6, 8)])

    return mesh
  }, [])

  /* Animate */
  useFrame((_, dt) => {
    mesh.material.uniforms.u_time.value += dt
  })

  useEffect(() => {
    mesh.spawnParticle()
  }, [mesh])

  useEffect(
    () => () => {
      mesh.material.dispose()
      mesh.geometry.dispose()
      mesh.dispose()
    },
    []
  )

  return <primitive object={mesh} />
}
