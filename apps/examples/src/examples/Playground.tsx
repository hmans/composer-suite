import { useFrame } from "@react-three/fiber"
import { useMemo } from "react"
import {
  assignment,
  bool,
  compileShader,
  Join,
  Value,
  vec3,
  VertexPosition
} from "shadenfreude"
import { Color, MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"

type CSMMasterProps = {
  position?: Value<"vec3">
  diffuseColor?: Value<"vec3">
}

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
      position: VertexPosition,
      diffuseColor: new Color(1, 1, 1) //Multiply(baseColor, Add(1, Multiply(Sin(Time), 0.5)))
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
