import { glsl, Snippet } from "@shader-composer/core"

export const mod289 = Snippet(
  (name) => glsl`
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
