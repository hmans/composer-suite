import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import { Compiler, GLSLType, ShaderNode, Variable } from "shadenfreude"
import { RootNode } from "shadenfreude/src/ShaderNode"
import { MeshStandardMaterial, Uniform } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"

type ModularShaderMaterialProps = Omit<iCSMProps, "ref">

class UniformNode<T extends GLSLType> extends ShaderNode<{
  type: T
  name: string
}> {
  outputs = {
    value: this.variable(this.opts.type)
  }

  vertex = {
    header: `uniform ${this.opts.type} ${this.opts.name};`
  }

  fragment = {
    header: `uniform ${this.opts.type} ${this.opts.name};`
  }
}

class TimeNode extends ShaderNode {
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

class Vector3Node extends ShaderNode {
  name = "Vector3 Value"

  inputs = {
    vector: this.vec3()
  }

  outputs = {
    value: this.vec3(this.inputs.vector)
  }
}

class FloatNode extends ShaderNode {
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
    const vector3 = new Vector3Node()
    const u_time = new UniformNode({}, { type: "float", name: "u_fooooo" })

    const time = new TimeNode()
    const root = new Root()

    root.inputs.offset.set(u_time)

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
