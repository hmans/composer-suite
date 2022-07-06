import { useFrame } from "@react-three/fiber"
import { useMemo } from "react"
import {
  bool,
  compileShader,
  cos,
  float,
  join,
  multiply,
  sin,
  SplitVector3,
  Variable,
  vec3
} from "shadenfreude"
import { Color, MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"

const CSMMaster = (diffuseColor: Variable<"vec3">) =>
  bool(true, {
    title: "Master",
    inputs: { diffuseColor },
    fragmentBody: `csm_DiffuseColor = vec4(diffuseColor, 1.0);`
  })

const Time = () =>
  float("u_time", {
    title: "Time",
    vertexHeader: "uniform float u_time;",
    fragmentHeader: "uniform float u_time;"
  })

export default function Playground() {
  const { update, ...shader } = useMemo(() => {
    const baseColor = vec3(new Color("hotpink"))

    const v2 = join(1, 1)
    const v3 = join(1, 1, 1)
    const v4 = join(1, 1, 1, 1)

    const root = CSMMaster(baseColor)

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
