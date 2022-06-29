import { useMemo, useRef } from "react"
import { Compiler, ShaderNode, Variable } from "shadenfreude"
import { RootNode } from "shadenfreude/src/ShaderNode"
import { MeshStandardMaterial } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"

type ModularShaderMaterialProps = Omit<iCSMProps, "ref">

class FloatNode extends ShaderNode<"float"> {
  name = "Float Value"

  inputs = {
    float: this.float()
  }

  outputs = {
    value: this.float(this.inputs.float)
  }
}

class Root extends RootNode {
  name = "Root"

  inputs = {
    offset: this.float()
  }

  vertex = { body: "csm_Position.x += inputs_offset;" }
}

function useShader() {
  return useMemo(() => {
    const float = new FloatNode()
    float.inputs.float.set(5)

    const root = new Root()
    root.inputs.offset.set(float.outputs.value)

    return new Compiler(root).compile()
  }, [])
}

function MyMaterial({ children, ...props }: ModularShaderMaterialProps) {
  const { ...shaderProps } = useShader()
  const material = useRef<CustomShaderMaterialImpl>(null!)

  console.log(shaderProps.vertexShader)
  // console.log(shaderProps.fragmentShader)

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
