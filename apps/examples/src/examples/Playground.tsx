import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import { Compiler, GLSLType, node, RootNode, ShaderNode } from "shadenfreude"
import { MeshStandardMaterial } from "three"
import CustomShaderMaterial, { iCSMProps } from "three-custom-shader-material"
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla"

type ModularShaderMaterialProps = Omit<iCSMProps, "ref">

class UniformNode<T extends GLSLType> extends ShaderNode<{
  type: T
  name: string
}> {
  name = "Uniform " + this.opts.name

  outputs = {
    value: this.variable(this.opts.type, this.opts.name)
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

  inputs = {
    uniform: this.float(
      new UniformNode({}, { name: "u_time", type: "float" }).outputs.value
    )
  }

  outputs = {
    /* The absolute time, in seconds */
    value: this.float("in_uniform"),

    /** Sine of the times */
    sin: this.float("sin(in_uniform)"),

    /** Cosine of the times */
    cos: this.float("cos(in_uniform)")
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

  vertex = { body: "csm_Position.x += in_offset;" }
}

function useShader() {
  return useMemo(() => {
    const float = new FloatNode()
    const vector3 = new Vector3Node()
    const u_time = new UniformNode({}, { type: "float", name: "u_fooooo" })

    const floaty = node(FloatNode, { float: 123 })

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
