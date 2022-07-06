import { useMemo } from "react"
import { compileShader, float, Variable, variable, vec3 } from "shadenfreude"
import { glslRepresentation } from "shadenfreude/src/compilers"
import { Color, MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"

const master = (color: Variable<"vec3">) =>
  float(1, {
    inputs: { color },
    fragmentBody: `csm_DiffuseColor = vec4(color, 1.0);`
  })

export default function Playground() {
  const shader = useMemo(() => {
    const baseColor = vec3(new Color("hotpink"))

    return compileShader(master(baseColor))
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
