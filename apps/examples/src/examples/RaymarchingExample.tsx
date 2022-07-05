import { useRef } from "react"
import { Factory, ShaderMaterialMasterNode, vec3 } from "shadenfreude"
import { ShaderMaterial } from "three"
import { useShader } from "./useShader"

const RaymarchingNode = Factory(() => ({
  name: "Raymarching Example",

  outputs: {
    value: vec3()
  },

  fragment: {
    body: /*glsl*/ `

    // vec2 screenPos = (2.0 * gl_FragCoord.xy - resolution) / resolution.y;

    outputs.value = vec3(1.0, 0.5, 0.2);
    `
  }
}))

export default function RaymarchingExample() {
  const shaderProps = useShader(() => {
    return ShaderMaterialMasterNode({
      color: RaymarchingNode()
    })
  })
  const material = useRef<ShaderMaterial>(null!)

  console.log(shaderProps.vertexShader)
  console.log(shaderProps.fragmentShader)

  return (
    <group position-y={15}>
      <mesh>
        <planeGeometry args={[30, 20]} />
        <shaderMaterial ref={material} {...shaderProps} />
      </mesh>
    </group>
  )
}
