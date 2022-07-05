import { useFrame } from "@react-three/fiber"
import { useLayoutEffect, useMemo, useRef } from "react"
import {
  compileShader,
  CustomShaderMaterialMasterNode,
  IShaderNode,
  ShaderNode,
  vec3
} from "shadenfreude"
import { Color, Matrix4, MeshStandardMaterial } from "three"
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
      inputs: {
        a: vec3(new Color("hotpink"))
      },
      outputs: {
        value: vec3("inputs.a")
      }
    })

    return CustomShaderMaterialMasterNode({
      diffuseColor
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
