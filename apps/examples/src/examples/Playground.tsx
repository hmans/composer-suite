import { MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import { makeParticles } from "vfx-composer"

const Effect = makeParticles()

export default function Playground() {
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
