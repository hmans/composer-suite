import { Instancicles, InstanciclesRef, ParticlesMaterial } from "@hmans/vfx"
import { FC, useEffect, useRef } from "react"
import ECS from "./ECS"

const Effect: FC = () => {
  const { spawn } = ECS.useEntity()
  const particles = useRef<InstanciclesRef>(null!)

  useEffect(() => {
    particles.current.spawnParticle(10)
  })

  return (
    <object3D {...spawn} scale={0.2}>
      <Instancicles ref={particles}>
        <ParticlesMaterial color="white" />
        <sphereBufferGeometry args={[1, 8, 8]} />
      </Instancicles>
    </object3D>
  )
}

export default () => (
  <ECS.ManagedEntities tag="isEffect">
    <Effect />
  </ECS.ManagedEntities>
)
