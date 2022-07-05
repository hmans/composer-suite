import { useControls } from "leva"
import { useRef } from "react"
import {
  addNodes,
  BlendNode,
  ColorNode,
  CustomShaderMaterialMasterNode,
  Factory,
  float,
  FresnelNode,
  MultiplyNode,
  multiplyNodes,
  ShaderNode,
  TimeNode,
  UniformNode,
  vec3,
  VertexPositionNode
} from "shadenfreude"
import { Color, MeshStandardMaterial, Vector3 } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"
import { useShader } from "./useShader"

export default function StacksExample() {
  const { speed, intensity, color, fresnelIntensity } = useControls(
    "Uniforms",
    {
      speed: { value: 1, min: 0, max: 2 },
      intensity: { value: 1, min: 0, max: 2 },
      color: "#3dd",
      fresnelIntensity: { value: 2, min: 0, max: 5 }
    }
  )

  const shader = useShader(() => {
    const speedUniform = UniformNode({ type: "float", name: "u_speed" })
    const intensityUniform = UniformNode({ type: "float", name: "u_intensity" })
    const colorUniform = UniformNode({ type: "vec3", name: "u_color" })
    const fresnelIntensityUniform = UniformNode({
      type: "float",
      name: "u_fresnelIntensity"
    })

    const root = CustomShaderMaterialMasterNode({
      position: VertexPositionNode(),

      diffuseColor: BlendNode({
        mode: "softlight",
        opacity: 1,
        a: colorUniform,
        b: multiplyNodes(
          multiplyNodes(new Color(2, 2, 2), fresnelIntensityUniform),
          FresnelNode()
        )
      })

      // diffuseColor: ShaderNode({
      //   name: "Color Stack",
      //   outputs: {
      //     value: vec3(colorUniform)
      //   },
      //   filters: [
      //     BlendNode({
      //       mode: "softlight",
      //       opacity: 1,
      //       a: new Vector3(),
      //       b: MultiplyNode({
      //         a: MultiplyNode({
      //           a: ColorNode({ a: new Color(2, 2, 2) }),
      //           b: fresnelIntensityUniform
      //         }),
      //         b: FresnelNode()
      //       })
      //     })
      //   ]
      // })
    })

    return root
  }, [])

  const material = useRef<CustomShaderMaterialImpl>(null!)

  const { uniforms, ...restShader } = shader

  // console.log(shader.vertexShader)
  // console.log(shader.fragmentShader)

  return (
    <group position-y={15}>
      <mesh>
        <sphereGeometry args={[8, 48, 48]} />

        <CustomShaderMaterial
          baseMaterial={MeshStandardMaterial}
          uniforms={{
            ...uniforms,
            u_speed: { value: speed },
            u_intensity: { value: intensity },
            u_color: { value: new Color(color) },
            u_fresnelIntensity: { value: fresnelIntensity }
          }}
          {...restShader}
          ref={material}
        />
      </mesh>
    </group>
  )
}
