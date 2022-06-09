import { FC, useEffect } from "react"
import { SpawnSetup, useParticles } from "./MeshParticles"
import { getValue, ValueFactory } from "./ValueFactory"

export type EmitterProps = {
  count?: ValueFactory<number>
  setup?: SpawnSetup
}

export const Emitter: FC<EmitterProps> = ({ count = 0, setup }) => {
  const { spawnParticle } = useParticles()

  useEffect(() => {
    spawnParticle(getValue(count), setup)
  }, [])

  return null
}
