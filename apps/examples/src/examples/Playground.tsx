import { useEffect } from "react"
import { MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import { makeParticles } from "vfx-composer"
import { useShader } from "shader-composer-r3f"
import { CustomShaderMaterialMaster } from "shader-composer"

const Effect = makeParticles()

export default function Playground() {
  const shader = useShader(() => {
    return CustomShaderMaterialMaster({})
  })

  useEffect(() => {
    Effect.spawn()
  }, [])

  return (
    <Effect.Root position-y={2}>
      <boxGeometry />
      <CustomShaderMaterial
        baseMaterial={MeshStandardMaterial}
        color="hotpink"
        {...shader}
      />
    </Effect.Root>
  )
}
