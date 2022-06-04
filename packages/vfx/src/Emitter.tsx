import { useFrame } from "@react-three/fiber"
import { FC, MutableRefObject, useRef } from "react"
import { ParticlesAPI, useParticles } from "./MeshParticles"

export type EmitterProps = {
  initialDelay?: number
  burstDelay?: number
  burstCount?: number
  spawnCount?: number
  effect?: MutableRefObject<ParticlesAPI>
}

export const Emitter: FC<EmitterProps> = ({
  spawnCount = 1,
  initialDelay = 0,
  burstCount = 1,
  burstDelay = 0,
  effect
}) => {
  const cooldown = useRef(initialDelay)
  const burstsRemaining = useRef(burstCount - 1)

  const context = effect ? null : useParticles()

  useFrame((_, dt) => {
    const { spawnParticle } = effect ? effect.current : context!

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
