import { useFrame } from "@react-three/fiber"
import { useMemo } from "react"
import { unstable_batchedUpdates } from "react-dom"
import {
  bool,
  compileShader,
  float,
  GLSLType,
  Value,
  variable,
  Variable,
  vec2,
  vec3,
  vec4
} from "shadenfreude"
import { type } from "shadenfreude/src/glslType"
import { Color, GLSLVersion, MeshStandardMaterial, Vector3 } from "three"
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

const add = Addition
const subtract = Subtraction
const divide = Division
const multiply = Multiplication

const sin = (x: Value<"float">) => float("sin(x)", { inputs: { x } })
const cos = (x: Value<"float">) => float("cos(x)", { inputs: { x } })

const SplitVector3 = (vector: Value<"vec3">) => ({
  x: float("vector.x", { inputs: { vector } }),
  y: float("vector.y", { inputs: { vector } }),
  z: float("vector.z", { inputs: { vector } })
})

const JoinVector3 = (x: Value<"float">, y: Value<"float">, z: Value<"float">) =>
  vec3("vec3(x, y, z)", {
    inputs: { x, y, z }
  })

type JoinReturnType<X, Y, Z, W> = [X, Y, Z, W] extends [
  Value<"float">,
  Value<"float">,
  Value<"float">,
  Value<"float">
]
  ? Variable<"vec4">
  : [X, Y, Z] extends [Value<"float">, Value<"float">, Value<"float">]
  ? Variable<"vec3">
  : Variable<"vec2">

const join = <
  X extends Value<"float">,
  Y extends Value<"float">,
  Z extends Value<"float"> | undefined,
  W extends Value<"float"> | undefined
>(
  x: X,
  y: Y,
  z?: Z,
  w?: W
) => {
  if (w !== undefined) {
    return vec4("vec4(x, y, z, w)", {
      inputs: { x, y, z, w }
    }) as JoinReturnType<X, Y, Z, W>
  }

  if (z !== undefined) {
    return vec3("vec3(x, y, z)", { inputs: { x, y, z } }) as JoinReturnType<
      X,
      Y,
      Z,
      W
    >
  }

  return vec2("vec2(x, y)", { inputs: { x, y } }) as JoinReturnType<X, Y, Z, W>
}

function isValue(v: any): v is Value {
  return v !== undefined
}

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

    const { x } = SplitVector3(baseColor)
    const time = Time()
    const color = join(sin(time), cos(time), sin(multiply(time, 2)))
    console.log(color)
    const root = CSMMaster(color)

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
