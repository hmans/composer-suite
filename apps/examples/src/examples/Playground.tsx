import { useFrame } from "@react-three/fiber"
import { useMemo } from "react"
import { MeshStandardMaterial } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"
import { compileShader } from "./shadenfreude/compilers"
import { float, node, plug, variable, vec3 } from "./shadenfreude/factories"
import { masterNode, timeNode } from "./shadenfreude/nodes"
import { GLSLType, Variable } from "./shadenfreude/types"

type ModularShaderMaterialProps = Omit<iCSMProps, "ref">

const colorValueNode = () =>
  node({
    name: "Color Value",
    outputs: {
      color: vec3("vec3(1.0, 0.5, 1.0)")
    }
  })

type Operator = "*" | "/" | "+" | "-"

const operator = (
  type: GLSLType,
  operator: Operator,
  inputs: { a: Variable; b: Variable }
) =>
  node({
    name: `Perform ${operator} on ${type}`,
    inputs: {
      a: variable(type, inputs.a),
      b: variable(type, inputs.b)
    },
    outputs: {
      result: variable(type)
    },
    vertex: {
      body: `result = a ${operator} b;`
    },
    fragment: {
      body: `result = a ${operator} b;`
    }
  })

function useShader() {
  return useMemo(() => {
    const { time } = timeNode().outputs

    const wobble = node({
      name: "Wobble",
      inputs: { time: float() },
      outputs: { offset: vec3() },
      vertex: { body: `offset.x = sin(time * 2.5) * 5.0;` }
    })

    const originalPosition = node({
      name: "Original Position",
      outputs: { position: vec3() },
      vertex: {
        body: "position = csm_Position;"
      }
    })

    plug(time).into(wobble.inputs.time)

    const root = masterNode({
      diffuseColor: colorValueNode().outputs.color,

      position: operator("vec3", "+", {
        a: originalPosition.outputs.position,
        b: wobble.outputs.offset
      }).outputs.result
    })

    return compileShader(root)
  }, [])
}

function MyMaterial({ children, ...props }: ModularShaderMaterialProps) {
  const { update, ...shaderProps } = useShader()

  console.log(shaderProps.vertexShader)
  // console.log(shaderProps.fragmentShader)

  useFrame(update)

  return <CustomShaderMaterial {...props} {...shaderProps} />
}

export default function Playground() {
  return (
    <group position-y={15}>
      <mesh>
        <sphereGeometry args={[7]} />

        <MyMaterial
          color="red"
          baseMaterial={MeshStandardMaterial}
        ></MyMaterial>
      </mesh>
    </group>
  )
}
