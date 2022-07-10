import { snippet } from "../../lib/concatenator3000"

export const taylorInvSqrt = snippet(
  (name) => `
    vec4 ${name}(vec4 r)
    {
      return 1.79284291400159 - 0.85373472095314 * r;
    }
  `
)
