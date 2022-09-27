import { Div, GlobalTime, Sub, Vec2 } from "shader-composer"
import { Vector2 } from "three"
import { ParticleAttribute } from "./ParticleAttribute"

export type ParticleUnits = ReturnType<typeof createParticleLifetime>

export const createParticleLifetime = () => {
  const attribute = ParticleAttribute(new Vector2())
  const { x: startTime, y: endTime } = Vec2(attribute)
  const time = GlobalTime
  const age = Sub(time, startTime)
  const maxAge = Sub(endTime, startTime)

  return {
    /** The time uniform used by the particle system. */
    time,

    /** Sets the current value of the lifetime attribute. The value will be read
    by the particle system once the particle is spawned. */
    setLifetime: (duration: number, offset: number = 0) =>
      attribute.value.set(time.value + offset, time.value + offset + duration),

    /** The absolute age, in seconds, of the particle. */
    age,

    /** The maximum age, in seconds, of the particle. */
    maxAge,

    /** The absolute time value at which the particle's life span begins. */
    startTime,

    /** The absolute time value at which the particle's life span ends. */
    endTime,

    /** The individual particle's progress (from 0 to 1) across its life span. */
    progress: Div(age, maxAge)
  }
}
