import { useMemo } from "react"
import { Mesh, MeshStandardMaterial, SphereGeometry } from "three"
import CustomShaderMaterial from "three-custom-shader-material/vanilla"

export const Composable = () => {
  const effect = useMemo(() => {
    const geometry = new SphereGeometry()

    const material = new CustomShaderMaterial({
      baseMaterial: new MeshStandardMaterial({ color: "white" })
    })

    const mesh = new Mesh(geometry, material)

    return mesh
  }, [])

  return <primitive object={effect} />
}
