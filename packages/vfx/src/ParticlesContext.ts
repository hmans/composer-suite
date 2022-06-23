import { createContext, useContext } from "react"
import { Object3D } from "three"

export type SpawnSetup = (options: any, index: number) => void

export type ParticlesAPI = {
  spawnParticle: (count: number, setup?: SpawnSetup, origin?: Object3D) => void
}

export const ParticlesContext = createContext<ParticlesAPI>(null!)

export const useParticles = () => useContext(ParticlesContext)
