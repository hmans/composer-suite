import { expr, Float, snippet } from "shadenfreude"
import { DoubleSide, MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import { useShader } from "./useShader"

const snip = snippet(
  (name) => `float ${name}(float a, float b) { return a + b; }`
)

export default function Playground() {
  const shader = useShader(() => {
    const a = Float(1)
    const b = Float(2)

    return Float(expr`${snip}(${a}, ${b})`, {
      vertexHeader: [snip],
      fragmentHeader: [snip]
    })
  }, [])

  console.log(shader.vertexShader)
  // console.log(shader.fragmentShader)

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
