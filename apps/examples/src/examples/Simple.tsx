import { useEffect } from "react"
import { compileShader, CustomShaderMaterialMaster } from "shader-composer"
import { Color, Vector3 } from "three"
import { makeParticles } from "vfx-composer/fiber"
import { ParticleAttribute } from "vfx-composer/units"

export const Simple = () => {
  const Effect = makeParticles()

  const variables = {
    velocity: ParticleAttribute("vec3", () => new Vector3()),
    color: ParticleAttribute("vec3", () => new Color())
  }

  useEffect(() => {
    Effect.spawn()
  }, [])

  return (
    <group>
      <Effect.Root>
        <boxGeometry />
        <meshStandardMaterial color="hotpink" />
      </Effect.Root>
    </group>
  )
}
