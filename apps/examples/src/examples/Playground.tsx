import { useMemo } from "react"
import {
  bool,
  compileShader,
  type,
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
    title: "Master",
    inputs: { color },
    fragmentBody: `csm_DiffuseColor = vec4(color, 1.0);`
  })

const add = <T extends GLSLType>(a: Value<T>, b: Value<T>) =>
  variable(type(a), "a + b", {
    title: `Addition (${type(a)} + ${type(b)}`,
    inputs: { a, b }
  })

const subtract = <T extends GLSLType>(a: Value<T>, b: Value<T>) =>
  variable(type(a), "a - b", {
    title: `Subtraction (${type(a)} - ${type(b)}`,
    inputs: { a, b }
  })

const divide = <T extends GLSLType>(a: Value<T>, b: Value<T>) =>
  variable(type(a), "a / b", {
    title: `Division (${type(a)} / ${type(b)}`,
    inputs: { a, b }
  })

const multiply = <T extends GLSLType>(a: Value<T>, b: Value<T>) =>
  variable(type(a), "a * b", {
    title: `Multiplication (${type(a)} * ${type(b)}`,
    inputs: { a, b }
  })

export default function Playground() {
  const shader = useMemo(() => {
    const baseColor = vec3(new Color("hotpink"))

    return compileShader(master(add(baseColor, new Color("white"))))
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
