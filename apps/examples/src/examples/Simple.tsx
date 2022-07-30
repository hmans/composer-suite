import { Color, Vector3 } from "three"
import { ParticleAttribute } from "vfx-composer/units"

export const Simple = () => {
  const variables = {
    velocity: ParticleAttribute("vec3", () => new Vector3()),
    color: ParticleAttribute("vec3", () => new Color())
  }

  return null
}
