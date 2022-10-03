import { Div, GlobalTime, Input, Sub, Vec2 } from "shader-composer"
import { Vector2 } from "three"
import { InstancedParticles } from "./InstancedParticles"
import { ParticleAttribute } from "./ParticleAttribute"

export type ParticleLifetime = ReturnType<typeof createParticleLifetime>

export const createParticleLifetime = () => {
  const lifetime = ParticleAttribute(new Vector2())

  const api = createParticleLifetimeAPI(lifetime)

  return {
    ...api,

    /** Sets the current value of the lifetime attribute. The value will be read
    by the particle system once the particle is spawned. */
    write: (mesh: InstancedParticles, duration: number, offset: number = 0) =>
      lifetime.write(mesh, (l) =>
        l.set(api.time.value + offset, api.time.value + offset + duration)
      )
  }
}

export const createParticleLifetimeAPI = (lifetime: Input<"vec2">) => {
  const { x: startTime, y: endTime } = Vec2(lifetime)
  const time = GlobalTime
  const age = Sub(time, startTime)
  const maxAge = Sub(endTime, startTime)

  return {
    /** The time uniform used by the particle system. */
    time,

    /** The absolute time value at which the particle's life span begins. */
    startTime,

    /** The absolute time value at which the particle's life span ends. */
    endTime,

    /** The absolute age, in seconds, of the particle. */
    age,

    /** The maximum age, in seconds, of the particle. */
    maxAge,

    /** The individual particle's progress (from 0 to 1) across its life span. */
    progress: Div(age, maxAge)
  }
}
