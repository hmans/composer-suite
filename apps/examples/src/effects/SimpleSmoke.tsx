import {
  MeshParticles,
  MeshParticlesProps,
  ParticlesMaterial,
  useMeshParticles
} from "@hmans/vfx"
import { useFrame } from "@react-three/fiber"
import { FC, useRef } from "react"

type EmitterProps = {
  initialDelay?: number
  burstDelay?: number
  burstCount?: number
  spawnCount?: number
}

const Emitter: FC<EmitterProps> = ({
  spawnCount = 1,
  initialDelay = 0,
  burstCount = 1,
  burstDelay = 0
}) => {
  const cooldown = useRef(initialDelay)
  const burstsRemaining = useRef(burstCount - 1)

  const { spawnParticle } = useMeshParticles()

  useFrame((_, dt) => {
    if (cooldown.current >= 0) {
      cooldown.current -= dt

      /* If we've reached the end of the cooldown, spawn some particles */
      if (cooldown.current <= 0) {
        spawnParticle(spawnCount)

        /* If there are bursts left, reset the cooldown */
        if (burstsRemaining.current > 0) {
          cooldown.current += burstDelay
          burstsRemaining.current--
        }
      }
    }
  })

  return null
}

export default (props: MeshParticlesProps) => (
  <MeshParticles {...props} scale={0.2}>
    <ParticlesMaterial color="white" />
    <sphereBufferGeometry args={[1, 8, 8]} />

    <Emitter spawnCount={3} burstCount={10} burstDelay={0.025} />
  </MeshParticles>
)
