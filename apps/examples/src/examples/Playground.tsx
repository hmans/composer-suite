import { expr, Float, snippet, Vec3 } from "shadenfreude"
import { Color, DoubleSide, MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import { useShader } from "./useShader"

export default function Playground() {
  const shader = useShader(() => {
    const add = snippet(
      (name) => `float ${name}(float a, float b) { return a + b; }`
    )

    const a = Float(1)
    const b = Float(2)

    const c = Vec3(new Color("hotpink"))

    // return Float(expr`${add}(${a}, ${b})`)

    return Float(expr`1.0 + 1.0`, {
      fragmentBody: [expr`csm_DiffuseColor = vec4(${a}, 0.5, 0.2, 1.0);`]
    })

    // const noise = Simplex3DNoise(VertexPosition)

    // return CustomShaderMaterialMaster({
    //   diffuseColor: new Color("hotpink"),
    //   alpha: noise
    // })
  }, [])

  // console.log(shader.vertexShader)
  console.log(shader.fragmentShader)

  return (
    <group position-y={15}>
      <mesh>
        <icosahedronGeometry args={[12, 8]} />

        <CustomShaderMaterial
          baseMaterial={MeshStandardMaterial}
          {...shader}
          transparent
          side={DoubleSide}
          metalness={0}
          roughness={0}
        />
      </mesh>
    </group>
  )
}
