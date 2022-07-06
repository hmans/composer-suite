import { useMemo } from "react"
import {
  bool,
  compileShader,
  GLSLType,
  Value,
  variable,
  Variable,
  vec3
} from "shadenfreude"
import { type } from "shadenfreude/src/glslType"
import { Color, MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"

const CSMMaster = (diffuseColor: Variable<"vec3">) =>
  bool(true, {
    title: "Master",
    inputs: { diffuseColor },
    fragmentBody: `csm_DiffuseColor = vec4(diffuseColor, 1.0);`
  })

const Addition = <T extends GLSLType>(a: Value<T>, b: Value<T>) =>
  variable(type(a), "a + b", {
    title: `Addition (${type(a)} + ${type(b)}`,
    inputs: { a, b }
  })

const Subtraction = <T extends GLSLType>(a: Value<T>, b: Value<T>) =>
  variable(type(a), "a - b", {
    title: `Subtraction (${type(a)} - ${type(b)}`,
    inputs: { a, b }
  })

const Division = <T extends GLSLType>(a: Value<T>, b: Value<T>) =>
  variable(type(a), "a / b", {
    title: `Division (${type(a)} / ${type(b)}`,
    inputs: { a, b }
  })

const Multiplication = <T extends GLSLType>(a: Value<T>, b: Value<T>) =>
  variable(type(a), "a * b", {
    title: `Multiplication (${type(a)} * ${type(b)}`,
    inputs: { a, b }
  })

export default function Playground() {
  const shader = useMemo(() => {
    const baseColor = vec3(new Color("hotpink"))

    const root = CSMMaster(Addition(baseColor, new Color("white")))

    return compileShader(root)
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
