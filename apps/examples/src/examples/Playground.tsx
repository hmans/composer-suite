import { useFrame } from "@react-three/fiber"
import { useMemo } from "react"
import {
  compileShader,
  CustomShaderMaterialMaster,
  Fresnel,
  Join,
  Multiply,
  Sin,
  Time,
  vec3,
  VertexPosition
} from "shadenfreude"
import { Color, MeshStandardMaterial, Vector3 } from "three"
import CustomShaderMaterial from "three-custom-shader-material"

export default function Playground() {
  const { update, ...shader } = useMemo(() => {
    const baseColor = vec3(new Color("hotpink"))

    const Wobble = (frequency: number, amplitude: number) =>
      Sin(Time.Multiply(frequency)).Multiply(amplitude)

    // const Wobble1 = (frequency: number, amplitude: number) =>
    //   Sin(Time.Multiply(frequency)).Multiply(amplitude)

    // const Wobble2 = (frequency: number, amplitude: number) =>
    //   Multiply(Sin(Multiply(Time, frequency)), amplitude)

    const WobbleMove = Join(Wobble(0.2, 5), Wobble(0.15, 3), Wobble(0.28, 5))

    const WobbleScale = Join(
      Wobble(0.8, 0.3),
      Wobble(0.5, 0.7),
      Wobble(0.7, 0.3)
    ).Add(new Vector3(1, 1, 1))

    const root = CustomShaderMaterialMaster({
      position: VertexPosition.Multiply(WobbleScale).Add(WobbleMove),

      diffuseColor: baseColor.Add(Multiply(new Color("white"), Fresnel()))
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
