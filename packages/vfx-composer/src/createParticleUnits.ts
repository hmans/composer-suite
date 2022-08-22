import { Div, Input, SplitVector2, Sub } from "shader-composer"

export type ParticleUnits = ReturnType<typeof createParticleUnits>

export const createParticleUnits = (
  lifetime: Input<"vec2">,
  time: Input<"float">
) => {
  const [startTime, endTime] = SplitVector2(lifetime)
  const maxAge = Sub(endTime, startTime)
  const age = Sub(time, startTime)
  const progress = Div(age, maxAge)

  return {
    age,
    maxAge,
    startTime,
    endTime,
    progress
  }
}
