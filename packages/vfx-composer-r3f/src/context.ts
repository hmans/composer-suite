import { World } from "miniplex"
import { createContext, useContext } from "react"
import { InstancedParticles } from "vfx-composer"
import { Entity } from "./InstancedParticles"

export const createParticlesContext = () =>
  createContext<{
    particles: InstancedParticles
    ecs: World<Entity>
  }>(null!)

export type ParticlesContext = ReturnType<typeof createParticlesContext>

export const DefaultContext = createParticlesContext()

export const useParticlesContext = () => useContext(DefaultContext)
