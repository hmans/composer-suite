import { MutableRefObject, useEffect, useRef } from "react"
import {
  CustomShaderMaterialMaster,
  Vec3,
  VertexPosition
} from "shader-composer"
import { useShader } from "shader-composer-r3f"
import { Color, InstancedMesh, Matrix4, MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"

const useParticles = (imesh: MutableRefObject<InstancedMesh>) => {
  const spawn = () => {
    if (!imesh.current) return
    imesh.current.setMatrixAt(0, new Matrix4())
    imesh.current.count = 1
    imesh.current.instanceMatrix.needsUpdate = true
  }

  const color = Vec3(new Color("hotpink"))

  const position = VertexPosition

  return { spawn, color, position }
}

export default function Playground() {
  const imesh = useRef<InstancedMesh>(null!)

  const { spawn, color, position } = useParticles(imesh)

  const shader = useShader(() => {
    return CustomShaderMaterialMaster({
      diffuseColor: color,
      position
    })
  })

  useEffect(() => {
    spawn()
  }, [])

  return (
    <instancedMesh
      ref={imesh}
      args={[undefined, undefined, 1000]}
      position-y={2}
    >
      <boxGeometry />
      <CustomShaderMaterial
        baseMaterial={MeshStandardMaterial}
        color="hotpink"
        {...shader}
      />
    </instancedMesh>
  )
}
