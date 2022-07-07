import { useFrame } from "@react-three/fiber"
import { useMemo } from "react"
import {
  Add,
  compileShader,
  CustomShaderMaterialMaster,
  Fresnel,
  GLSLType,
  Join,
  Multiply,
  Sin,
  Time,
  Value,
  Vec3,
  VertexPosition
} from "shadenfreude"
import { Color, MeshStandardMaterial, Vector3 } from "three"
import CustomShaderMaterial from "three-custom-shader-material"

const Pipe = <T extends GLSLType>(
  v: Value<T>,
  ...ops: ((v: Value<T>) => Value<T>)[]
) => ops.reduce((acc, op) => op(acc), v)

export default function Playground() {
  const { update, ...shader } = useMemo(() => {
    const baseColor = Vec3(new Color("#8cf"))

    const Wobble = (frequency: number, amplitude: number) =>
      Multiply(Sin(Multiply(Time, frequency)), amplitude)

    const WobbleMove = Join(Wobble(0.2, 5), Wobble(0.15, 3), Wobble(0.28, 5))

    const WobbleScale = Add(
      Join(Wobble(0.8, 0.3), Wobble(0.5, 0.7), Wobble(0.7, 0.3)),
      new Vector3(1, 1, 1)
    )

    const fresnel = Fresnel()

    const root = CustomShaderMaterialMaster({
      position: Pipe(
        VertexPosition,
        (v) => Multiply(v, WobbleScale),
        (v) => Add(v, WobbleMove)
      ),

      diffuseColor: Pipe(
        baseColor,
        (v) => Add(v, Multiply(new Color("white"), fresnel)),
        (v) => Multiply(v, 0.5)
      ),

      alpha: Pipe(fresnel)
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
