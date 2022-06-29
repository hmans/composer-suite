import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import { Compiler, ShaderNode } from "shadenfreude"
import { RootNode } from "shadenfreude/src/ShaderNode"
import { MeshStandardMaterial } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"

type ModularShaderMaterialProps = Omit<iCSMProps, "ref">

class TimeNode extends ShaderNode<"float"> {
  name = "Time Node"

  outputs = {
    value: this.float("u_time"),

    /** Sine of the times */
    sin: this.float("sin(u_time)"),

    /** Cosine of the times */
    cos: this.float("cos(u_time)")
  }

  vertex = {
    header: `uniform float u_time;`
  }

  fragment = {
    header: `uniform float u_time;`
  }
}

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
    const time = new TimeNode()
    const root = new Root()

    root.inputs.offset.set(time.outputs.cos)

    return new Compiler(root).compile()
  }, [])
}

function MyMaterial({ children, ...props }: ModularShaderMaterialProps) {
  const { update, ...shaderProps } = useShader()
  const material = useRef<CustomShaderMaterialImpl>(null!)

  console.log(shaderProps.vertexShader)
  // console.log(shaderProps.fragmentShader)

  useFrame((_, dt) => update(dt))

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
