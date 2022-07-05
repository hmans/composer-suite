import { useFrame } from "@react-three/fiber"
import { useLayoutEffect, useMemo, useRef } from "react"
import {
  AddNode,
  compileShader,
  CustomShaderMaterialMasterNode,
  IShaderNode,
  MultiplyNode,
  ShaderNode,
  vec3,
  VertexPositionNode
} from "shadenfreude"
import { Color, Matrix4, MeshStandardMaterial, Vector3 } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import { Particles } from "three-vfx"

const useShader = (fac: () => IShaderNode) => {
  const [shader, update] = useMemo(() => compileShader(fac()), [])
  useFrame((_, dt) => update(dt))
  return shader
}

export default function ShadenfreudeParticles() {
  const imesh = useRef<Particles>(null!)

  const shader = useShader(() => {
    const diffuseColor = ShaderNode({
      name: "Color Stack",
      inputs: { a: vec3(new Color("#555")) },
      outputs: { value: vec3("inputs.a") },
      filters: []
    })

    const position = ShaderNode({
      name: "Position Stack",
      inputs: { a: vec3(VertexPositionNode()) },
      outputs: { value: vec3("inputs.a") },
      filters: []
    })

    return CustomShaderMaterialMasterNode({
      diffuseColor,
      position
    })
  })

  useLayoutEffect(() => {
    /* Spawn a single particle */
    imesh.current.setMatrixAt(0, new Matrix4())
    imesh.current.count = 1
  }, [])

  return (
    <group position-y={15}>
      <Particles ref={imesh}>
        <sphereGeometry />
        <CustomShaderMaterial baseMaterial={MeshStandardMaterial} {...shader} />
      </Particles>
    </group>
  )
}
