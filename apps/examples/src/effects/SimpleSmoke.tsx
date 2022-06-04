import { MeshParticles, ParticlesMaterial, useMeshParticles } from "@hmans/vfx"
import { Object3DProps, useFrame } from "@react-three/fiber"
import { FC, useRef } from "react"

type EmitterProps = {
  delay?: number
  count?: number
}

const Emitter: FC<EmitterProps> = ({ count = 1, delay = 0 }) => {
  const timeRemaining = useRef(delay)

  const { spawnParticle } = useMeshParticles()

  useFrame((_, dt) => {
    if (timeRemaining.current >= 0) {
      timeRemaining.current -= dt

      if (timeRemaining.current <= 0) {
        spawnParticle(count)
      }
    }
  })

  return null
}

export default (props: Object3DProps) => {
  return (
    <object3D {...props} scale={0.2}>
      <MeshParticles>
        <ParticlesMaterial color="white" />
        <sphereBufferGeometry args={[1, 8, 8]} />

        <Emitter count={5} />
        <Emitter count={30} delay={0.3} />
      </MeshParticles>
    </object3D>
  )
}
