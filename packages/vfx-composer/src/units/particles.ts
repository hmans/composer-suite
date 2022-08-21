import { Input, SplitVector2, Sub, Div } from "shader-composer"

export type ParticleUnits = ReturnType<typeof createParticleUnits>

export const createParticleUnits = (
  lifetime: Input<"vec2">,
  time: Input<"float">
) => {
  const [StartTime, EndTime] = SplitVector2(lifetime)
  const MaxAge = Sub(EndTime, StartTime)
  const Age = Sub(time, StartTime)
  const Progress = Div(Age, MaxAge)

  return {
    Age,
    MaxAge,
    StartTime,
    EndTime,
    Progress
  }
}
