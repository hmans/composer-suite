import React from "react"
import { useFrame } from "@react-three/fiber"
import { FC, useRef } from "react"
import { SpawnSetup, useParticles } from "./MeshParticles"
import { getValue, ValueFactory } from "./ValueFactory"

export type EmitterProps = {
  initialParticles?: ValueFactory<number>
  initialDelay?: ValueFactory<number>
  burstDelay?: ValueFactory<number>
  burstCount?: ValueFactory<number>
  burstParticles?: ValueFactory<number>
  setup?: SpawnSetup
}

export const Emitter: FC<EmitterProps> = ({
  initialParticles = 0,
  burstParticles = 1,
  initialDelay = 0,
  burstCount = 0,
  burstDelay = 0,
  setup
}) => {
  const initialCooldown = useRef(getValue(initialDelay))
  const burstCooldown = useRef(getValue(burstDelay))
  const burstsRemaining = useRef(getValue(burstCount))

  const { spawnParticle } = useParticles()

  useFrame((_, dt) => {
    /* First of all, wait the initial cooldown */
    if (initialCooldown.current >= 0) {
      initialCooldown.current -= dt

      if (initialCooldown.current <= 0) {
        spawnParticle(getValue(initialParticles), setup)
      }

      return
    }

    /* Now we can deal with the remaining bursts */
    if (burstsRemaining.current > 0) {
      burstCooldown.current -= dt

      /* If we've reached the end of the cooldown, spawn some particles */
      if (burstCooldown.current <= 0) {
        spawnParticle(getValue(burstParticles), setup)

        /* If there are bursts left, reset the cooldown */
        if (burstsRemaining.current > 0) {
          burstCooldown.current += getValue(burstDelay)
          burstsRemaining.current--
        }
      }
    }
  })

  return null
}
