import { useMemo, useRef } from "react"
import { Compiler, ShaderNode, Variable } from "shadenfreude"
import { MeshStandardMaterial } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"

type ModularShaderMaterialProps = Omit<iCSMProps, "ref">

class FloatNode extends ShaderNode<"float"> {
  inputs = {
    float: new Variable("float")
  }

  outputs = {
    value: new Variable("float", this.inputs.float.value)
  }
}

class Dummy extends ShaderNode<"float"> {
  outputs = {
    value: new Variable("float")
  }

  inputs = {
    offset: new Variable("float")
  }

  vertex = { body: "csm_Position.x += 12.0;" }
}

function useShader() {
  return useMemo(() => {
    const float = new FloatNode()
    float.inputs.float.set(5)

    const dummy = new Dummy()
    dummy.inputs.offset.set(float.outputs.value)

    return new Compiler(dummy).compile()
  }, [])
}

function MyMaterial({ children, ...props }: ModularShaderMaterialProps) {
  const { ...shaderProps } = useShader()
  const material = useRef<CustomShaderMaterialImpl>(null!)

  console.log(shaderProps.vertexShader)
  console.log(shaderProps.fragmentShader)

  // useFrame(update)

  return <CustomShaderMaterial {...props} {...shaderProps} ref={material} />
}

export default function Playground() {
  return (
    <group position-y={15}>
      <mesh>
        <sphereGeometry args={[8, 32, 32]} />

        <MyMaterial baseMaterial={MeshStandardMaterial}></MyMaterial>
      </mesh>
    </group>
  )
}
