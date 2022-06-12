import { useEffect, useMemo } from "react"
import {
  InstancedMesh,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  SphereGeometry
} from "three"
import CustomShaderMaterial from "three-custom-shader-material/vanilla"

const tmpObj = new Object3D()

export const Composable = () => {
  const mesh = useMemo(() => {
    /* Geometry */
    const geometry = new SphereGeometry()

    /* Material */
    const material = new CustomShaderMaterial({
      baseMaterial: new MeshStandardMaterial({ color: "white" })
    })

    /* Mesh */
    const mesh = new InstancedMesh(geometry, material, 1100)

    return mesh
  }, [])

  useEffect(() => {
    /* Spawn a single particle */
    tmpObj.position.set(0, 0, 0)
    tmpObj.quaternion.set(0, 0, 0, 1)
    tmpObj.scale.setScalar(1)

    mesh.setMatrixAt(0, tmpObj.matrix)
    mesh.count = 1
  }, [mesh])

  return <primitive object={mesh} />
}
