import { useRef } from "react"
import {
  AddNode,
  ColorNode,
  ShaderMaterialMasterNode,
  ShaderNode,
  vec3
} from "shadenfreude"
import { Color, ShaderMaterial, Vector3 } from "three"
import { useShader } from "./useShader"

export default function RaymarchingExample() {
  const shaderProps = useShader(() => {
    const colorA = ColorNode({ a: new Color("#f33") })
    const colorB = ColorNode({ a: new Color(0, 1, 0) })

    const l = AddNode({
      a: new Vector3(),
      b: colorB
    })

    const colorStack = ShaderNode({
      name: "Color Stack",
      inputs: {
        color: vec3(colorA)
      },
      outputs: {
        value: vec3("inputs.color")
      },
      filters: [l]
    })

    return ShaderMaterialMasterNode({
      color: colorStack
    })
  })
  const material = useRef<ShaderMaterial>(null!)

  console.log(shaderProps.vertexShader)
  console.log(shaderProps.fragmentShader)

  return (
    <group position-y={15}>
      <mesh>
        <sphereGeometry args={[8, 32, 32]} />

        <shaderMaterial ref={material} {...shaderProps} />

        {/* <CustomShaderMaterial
          baseMaterial={MeshStandardMaterial}
          {...shaderProps}
          ref={material}
        /> */}
      </mesh>
    </group>
  )
}
