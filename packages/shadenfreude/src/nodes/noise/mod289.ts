import { snippet } from "../../lib/concatenator3000"

export const mod289 = snippet(
  (name) => `
    vec3 ${name}(vec3 x)
    {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 ${name}(vec4 x)
    {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
  `
)
