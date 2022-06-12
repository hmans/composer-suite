import { useFrame } from "@react-three/fiber"
import { useEffect, useMemo } from "react"
import {
  InstancedMesh,
  MeshStandardMaterial,
  Object3D,
  SphereGeometry
} from "three"
import CustomShaderMaterial from "three-custom-shader-material/vanilla"
import { iCSMParams } from "three-custom-shader-material/types"

const tmpObj = new Object3D()

class ParticlesMaterial extends CustomShaderMaterial {
  constructor(opts: iCSMParams) {
    super(opts)
    this.update(this.generateShaders())
  }

  generateShaders() {
    const vertexShader = /*glsl*/ `
      uniform float u_time;

      void main() {
        csm_Position.y += u_time;
      }
    `

    const fragmentShader = /*glsl*/ `
    `

    const uniforms = {
      u_time: { value: 0 }
    }

    return { vertexShader, fragmentShader, uniforms }
  }
}

export const Composable = () => {
  const material = useMemo(
    () =>
      new ParticlesMaterial({
        baseMaterial: new MeshStandardMaterial({ color: "white" })
      }),
    []
  )

  const mesh = useMemo(() => {
    const geometry = new SphereGeometry()

    /* Mesh */
    const mesh = new InstancedMesh(geometry, material, 1100)

    return mesh
  }, [])

  /* Animate */
  useFrame((_, dt) => {
    material.uniforms.u_time.value += dt
  })

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
