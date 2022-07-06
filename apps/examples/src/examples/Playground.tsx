import { useMemo, useRef } from "react"
import { compileShader, variable } from "shadenfreude"
import { ShaderMaterial } from "three"

export default function Playground() {
  const shader = useMemo(() => {
    const root = variable("float", 1)
    return compileShader(root)
  }, [])

  const material = useRef<ShaderMaterial>(null!)

  console.log(shader.vertexShader)
  console.log(shader.fragmentShader)

  return (
    <group position-y={15}>
      <mesh>
        <sphereGeometry args={[8, 32, 32]} />

        <shaderMaterial ref={material} {...shader} />

        {/* <CustomShaderMaterial
          baseMaterial={MeshStandardMaterial}
          {...shaderProps}
          ref={material}
        /> */}
      </mesh>
    </group>
  )
}
