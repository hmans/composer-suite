import { snippet } from "../../lib/concatenator3000"
import { mod289 } from "./mod289"

export const permute = snippet(
  (name) => [
    `
    vec4 ${name}(vec4 x)
    {
      return ${mod289.name}(((x*34.0)+10.0)*x);
    }
  `
  ],
  [mod289]
)
