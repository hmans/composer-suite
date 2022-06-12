import { extend, Node, useFrame } from "@react-three/fiber"
import { useEffect, useMemo } from "react"
import { MeshStandardMaterial, Object3D, SphereGeometry } from "three"
import {
  makeShake,
  MeshParticles,
  ParticlesMaterial,
  wobble
} from "./v2/vanilla"

const tmpObj = new Object3D()

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
    /* Spawn a single particle */
    tmpObj.position.set(0, 0, 0)
    tmpObj.quaternion.set(0, 0, 0, 1)
    tmpObj.scale.setScalar(1)

    mesh.setMatrixAt(0, tmpObj.matrix)
    mesh.count = 1
  }, [mesh])

  return <primitive object={mesh} />
}

extend({ MeshParticles, ParticlesMaterial })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshParticles: Node<MeshParticles, typeof MeshParticles>
      particlesMaterial: Node<ParticlesMaterial, typeof ParticlesMaterial>
    }
  }
}

export const ComposableFiber = () => {
  return (
    <meshParticles>
      <sphereGeometry />
      <particlesMaterial args={[{ baseMaterial: MeshStandardMaterial }]} />
    </meshParticles>
  )
}
