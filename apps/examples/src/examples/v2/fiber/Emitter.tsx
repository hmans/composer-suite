import { useEffect } from "react"
import { useParticles } from "./context"

export const Emitter = () => {
  const particles = useParticles()

  useEffect(() => {
    particles.spawnParticle()
  }, [])

  return null
}
