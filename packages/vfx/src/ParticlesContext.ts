import { createContext, useContext } from "react"
import { Color, Object3D, Quaternion, Vector3 } from "three"

export const components = {
  position: new Vector3(),
  quaternion: new Quaternion(),
  velocity: new Vector3(),
  acceleration: new Vector3(),
  delay: 0,
  lifetime: 1,
  scale: [new Vector3(), new Vector3()],
  color: [new Color(), new Color()],
  alpha: [1, 0]
}

export type SpawnOptions = typeof components

export type SpawnSetup = (options: SpawnOptions, index: number) => void

export type ParticlesAPI = {
  spawnParticle: (count: number, setup?: SpawnSetup, origin?: Object3D) => void
}

export const ParticlesContext = createContext<ParticlesAPI>(null!)

export const useParticles = () => useContext(ParticlesContext)
