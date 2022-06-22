import CustomShaderMaterial from "three-custom-shader-material"
import { MeshStandardMaterial } from "three"
import { combineShaders, compileShader, createShader } from "three-vfx"

export const NewShaderExample = () => {
  const colorShader = createShader({
    fragmentMain: `csm_DiffuseColor = vec4(1.0, 0.5, 0.0, 1.0);`
  })

  const wobbleShader = createShader({
    vertexMain: `csm_Position.x += 10.0;`
  })

  const blahShader = createShader({
    vertexMain: `csm_Position.y += 3.0;`
  })

  const material = compileShader(
    combineShaders(colorShader, wobbleShader, blahShader)
  )

  return (
    <group position-y={15}>
      <mesh>
        <sphereGeometry args={[8]} />
        <CustomShaderMaterial
          baseMaterial={MeshStandardMaterial}
          color="hotpink"
          {...material}
        />
      </mesh>
    </group>
  )
}
