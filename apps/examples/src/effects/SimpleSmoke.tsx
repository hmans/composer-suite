import {
  MeshParticles,
  MeshParticlesAPI,
  ParticlesMaterial,
  useMeshParticles
} from "@hmans/vfx"
import { Object3DProps } from "@react-three/fiber"
import { useEffect, useRef } from "react"

const Emitter = () => {
  const { spawnParticle } = useMeshParticles()

  useEffect(() => {
    spawnParticle(30)
  }, [])

  return null
}

export default (props: Object3DProps) => {
  return (
    <object3D {...props} scale={0.2}>
      <MeshParticles>
        <ParticlesMaterial color="white" />
        <sphereBufferGeometry args={[1, 8, 8]} />

        <Emitter />
      </MeshParticles>
    </object3D>
  )
}
