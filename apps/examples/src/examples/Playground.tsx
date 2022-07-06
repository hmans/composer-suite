import { useMemo } from "react"
import { compileShader, variable } from "shadenfreude"
import { Color, MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"

export default function Playground() {
  const shader = useMemo(() => {
    const color = variable("vec3", new Color("hotpink"))

    const root = variable("float", 1)
    root.dependencies.push(color)
    root.fragmentBody = `csm_DiffuseColor = vec4(${color.name}, 1.0);`

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
