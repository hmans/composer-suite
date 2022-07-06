import { useFrame } from "@react-three/fiber"
import { useMemo } from "react"
import {
  Add,
  compileShader,
  Cos,
  CustomShaderMaterialMaster,
  Join,
  Multiply,
  Sin,
  Time,
  vec3,
  VertexPosition
} from "shadenfreude"
import { Color, MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"

export default function Playground() {
  const { update, ...shader } = useMemo(() => {
    const baseColor = vec3(new Color("hotpink"))

    const Wobble = (frequency: number, amplitude: number) =>
      Multiply(Sin(Multiply(Time, frequency)), amplitude)

    const WobbleMove = Join(Wobble(2, 5), Wobble(1.5, 3), Wobble(0.8, 3))

    const WobbleScale = Join(
      Add(Wobble(3, 0.3), 1),
      Add(Wobble(3, 0.4), 1),
      Add(Wobble(1, 0.3), 1)
    )

    const root = CustomShaderMaterialMaster({
      position: Add(WobbleMove, Multiply(VertexPosition, WobbleScale)),
      diffuseColor: Multiply(baseColor, Add(1, Multiply(Sin(Time), 0.5)))
    })

    return compileShader(root)
  }, [])

  useFrame((_, dt) => update(dt))

  console.log(shader.vertexShader)
  console.log(shader.fragmentShader)

  return (
    <group position-y={15}>
      <mesh>
        <sphereGeometry args={[8, 32, 32]} />
        <CustomShaderMaterial baseMaterial={MeshStandardMaterial} {...shader} />
      </mesh>
    </group>
  )
}
