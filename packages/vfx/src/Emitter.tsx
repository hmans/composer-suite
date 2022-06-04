import { useFrame } from "@react-three/fiber"
import { FC, useRef } from "react"
import { SpawnSetup, useParticles } from "./MeshParticles"
import { getValue, ValueFactory } from "./ValueFactory"

export type EmitterProps = {
  initialDelay?: ValueFactory<number>
  burstDelay?: ValueFactory<number>
  burstCount?: ValueFactory<number>
  spawnCount?: ValueFactory<number>
  setup?: SpawnSetup
}

export const Emitter: FC<EmitterProps> = ({
  spawnCount = 1,
  initialDelay = 0,
  burstCount = 1,
  burstDelay = 0,
  setup
}) => {
  const cooldown = useRef(getValue(initialDelay))
  const burstsRemaining = useRef(getValue(burstCount) - 1)

  const { spawnParticle } = useParticles()

  useFrame((_, dt) => {
    if (cooldown.current >= 0) {
      cooldown.current -= dt

      /* If we've reached the end of the cooldown, spawn some particles */
      if (cooldown.current <= 0) {
        spawnParticle(getValue(spawnCount), setup)

        /* If there are bursts left, reset the cooldown */
        if (burstsRemaining.current > 0) {
          cooldown.current += getValue(burstDelay)
          burstsRemaining.current--
        }
      }
    }
  })

  return null
}
