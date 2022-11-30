import { glsl, Snippet } from "@shader-composer/core"

export const taylorInvSqrt = Snippet(
  (name) => glsl`
    vec4 ${name}(vec4 r)
    {
      return 1.79284291400159 - 0.85373472095314 * r;
    }
  `
)
