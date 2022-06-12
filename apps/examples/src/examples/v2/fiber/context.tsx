import { createContext, useContext } from "react"
import { MeshParticles as MeshParticlesImpl } from "../vanilla/MeshParticles"

export const ParticlesContext = createContext<MeshParticlesImpl>(null!)

export const useParticles = () => useContext(ParticlesContext)
