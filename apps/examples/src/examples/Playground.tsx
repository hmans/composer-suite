import { useEffect } from "react"
import { MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import { makeParticles } from "vfx-composer"

const Effect = makeParticles()

export default function Playground() {
  useEffect(() => {
    Effect.spawn()
  }, [])

  return (
    <Effect.Root position-y={2}>
      <boxGeometry />
      <CustomShaderMaterial
        baseMaterial={MeshStandardMaterial}
        color="hotpink"
      />
    </Effect.Root>
  )
}
