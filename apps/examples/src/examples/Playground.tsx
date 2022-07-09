import { Expression, Float } from "shadenfreude"
import { glslRepresentation } from "shadenfreude/src/glslRepresentation"
import { DoubleSide, MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import { useShader } from "./useShader"

const zip = (a: TemplateStringsArray | any[], b: any[]) =>
  a.map((k, i) => [k, b[i]])

const expr = (strings: TemplateStringsArray, ...values: any[]): Expression => ({
  _: "Expression",

  values,

  render: () =>
    zip(strings, values.map(glslRepresentation))
      .flat()
      .join("")
})

export default function Playground() {
  const shader = useShader(() => {
    const a = Float(1)
    const b = Float(2)

    return Float(expr`${a} + ${b}`)
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
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
    </group>
  )
}
