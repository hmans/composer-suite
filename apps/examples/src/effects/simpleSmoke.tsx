import { Instancicles, InstanciclesRef, ParticlesMaterial } from "@hmans/vfx"
import { Object3DProps } from "@react-three/fiber"
import { useEffect, useRef } from "react"

export default (props: Object3DProps) => {
  const particles = useRef<InstanciclesRef>(null!)

  useEffect(() => {
    particles.current.spawnParticle(10)
  })

  return (
    <object3D {...props} scale={0.2}>
      <Instancicles ref={particles}>
        <ParticlesMaterial color="white" />
        <sphereBufferGeometry args={[1, 8, 8]} />
      </Instancicles>
    </object3D>
  )
}
