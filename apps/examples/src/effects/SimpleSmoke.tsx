import { MeshParticles, MeshParticlesRef, ParticlesMaterial } from "@hmans/vfx"
import { Object3DProps } from "@react-three/fiber"
import { useEffect, useRef } from "react"

export default (props: Object3DProps) => {
  const particles = useRef<MeshParticlesRef>(null!)

  useEffect(() => {
    particles.current.spawnParticle(10)
  })

  return (
    <object3D {...props} scale={0.2}>
      <MeshParticles ref={particles}>
        <ParticlesMaterial color="white" />
        <sphereBufferGeometry args={[1, 8, 8]} />
      </MeshParticles>
    </object3D>
  )
}
