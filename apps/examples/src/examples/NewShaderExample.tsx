import { useFrame } from "@react-three/fiber"
import { MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import { combineShaders, compileShader, createShader, Uniform } from "three-vfx"
import { layers } from "three-vfx"

export const NewShaderExample = () => {
  const colorShader = createShader({
    fragmentMain: `csm_DiffuseColor = vec4(1.0, 0.5, 0.0, 1.0);`
  })

  const wobblePositionShader = createShader({
    vertexMain: `csm_Position.x += sin(u_time * 5.0) * 2.0;`
  })

  const wobbleScaleShader = createShader({
    vertexMain: `csm_Position *= 1.0 + sin(u_time * 3.0) * 0.3;`
  })

  const material = compileShader(
    combineShaders([
      layers.timeShader(),
      colorShader,
      wobbleScaleShader,
      wobblePositionShader
    ])
  )

  useFrame(material.update)

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
