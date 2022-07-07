import { useFrame } from "@react-three/fiber"
import { useMemo } from "react"
import {
  Add,
  compileShader,
  CustomShaderMaterialMaster,
  Float,
  Fresnel,
  Join,
  Mix,
  Multiply,
  Normalize,
  Pipe,
  Sin,
  Time,
  Vec3,
  VertexPosition
} from "shadenfreude"
import { Color, MeshStandardMaterial, Vector3 } from "three"
import CustomShaderMaterial from "three-custom-shader-material"

const StupidNoise = (x: Float) => Float("rand(floor(x))", { inputs: { x } })

export default function Playground() {
  const { update, ...shader } = useMemo(() => {
    const baseColor = Vec3(new Color("#8cf"))

    const Wobble = (frequency: Float, amplitude: Float) =>
      Multiply(Sin(Multiply(Time, frequency)), amplitude)

    const WobbleMove = Join(Wobble(0.2, 5), Wobble(0.15, 3), Wobble(0.28, 5))

    const WobbleScale = Add(
      Join(Wobble(0.8, 0.3), Wobble(0.5, 0.7), Wobble(0.7, 0.3)),
      new Vector3(1, 1, 1)
    )

    const fresnel = Fresnel({ intensity: 1.2 })

    const root = CustomShaderMaterialMaster({
      position: Pipe(
        VertexPosition,
        ($) => Multiply($, WobbleScale),
        ($) => Add($, WobbleMove)
      ),

      diffuseColor: Pipe(
        VertexPosition,
        ($) => Normalize($),
        ($) => Mix($, new Color("hotpink"), 0.5),
        ($) => Add($, Multiply(new Color("white"), fresnel))
      ),

      alpha: 1 //fresnel
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
        <CustomShaderMaterial
          baseMaterial={MeshStandardMaterial}
          {...shader}
          transparent
        />
      </mesh>
    </group>
  )
}
