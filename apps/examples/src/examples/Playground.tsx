import { useMemo } from "react"
import {
  bool,
  compileShader,
  glslType,
  GLSLType,
  Value,
  variable,
  Variable,
  vec3
} from "shadenfreude"
import { Color, MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"

const master = (color: Variable<"vec3">) =>
  bool(true, {
    inputs: { color: add(color, new Color("white")) },
    fragmentBody: `csm_DiffuseColor = vec4(color, 1.0);`
  })

const add = <T extends GLSLType>(a: Value<T>, b: Value<T>) =>
  variable(glslType(a), "a + b", { inputs: { a, b } })

export default function Playground() {
  const shader = useMemo(() => {
    const baseColor = vec3(new Color("hotpink"))

    return compileShader(master(baseColor))
  }, [])

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
