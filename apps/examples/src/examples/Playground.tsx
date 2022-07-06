import { useFrame } from "@react-three/fiber"
import { useMemo } from "react"
import {
  Add,
  assignment,
  bool,
  compileShader,
  Join,
  Multiply,
  Sin,
  Time,
  Value,
  Variable,
  Varying,
  vec3
} from "shadenfreude"
import { Color, MeshStandardMaterial, Vector3 } from "three"
import CustomShaderMaterial from "three-custom-shader-material"

type CSMMasterProps = {
  position?: Value<"vec3">
  diffuseColor?: Value<"vec3">
}

const VertexPosition = Varying("vec3", vec3("position", { only: "vertex" }))

console.log(VertexPosition)

const CSMMaster = (inputs: CSMMasterProps) =>
  bool(true, {
    title: "Master",
    inputs,
    vertexBody: assignment("csm_Position", "position"),
    fragmentBody: assignment("csm_DiffuseColor", "vec4(diffuseColor, 1.0)")
  })

export default function Playground() {
  const { update, ...shader } = useMemo(() => {
    const baseColor = vec3(new Color("hotpink"))

    const v2 = Join(1, 1)
    const v3 = Join(1, 1, 1)
    const v4 = Join(1, 1, 1, 1)

    const root = CSMMaster({
      position: VertexPosition
      // diffuseColor: Multiply(baseColor, Add(1, Multiply(Sin(Time), 0.5)))
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
