import { Div, GlobalTime, Input, Sub, Vec2 } from "shader-composer"
import { Vector2 } from "three"
import { ParticleAttribute } from "./ParticleAttribute"

export type ParticleUnits = ReturnType<typeof createParticleLifetime>

export const createParticleLifetime = () => {
  const lifetime = ParticleAttribute(new Vector2())
  const time = GlobalTime

  const { x: startTime, y: endTime } = Vec2(lifetime)

  const maxAge = Sub(endTime, startTime)
  const age = Sub(time, startTime)
  const progress = Div(age, maxAge)

  const setLifetime = (duration: number, offset: number = 0) =>
    lifetime.value.set(time.value + offset, time.value + offset + duration)

  return {
    setLifetime,
    lifetime,
    time,
    age,
    maxAge,
    startTime,
    endTime,
    progress
  }
}
