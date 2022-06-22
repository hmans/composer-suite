import CustomShaderMaterial from "three-custom-shader-material"
import { MeshStandardMaterial } from "three"
import { combineShaders, compileShader, createShader, Uniform } from "three-vfx"
import { useFrame } from "@react-three/fiber"

export const NewShaderExample = () => {
  const timeUniform: Uniform = { type: "float", value: 0 }

  const timeShader = createShader({
    uniforms: { u_time: timeUniform },
    update: (_, dt) => (timeUniform.value += dt)
  })

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
    combineShaders(
      timeShader,
      colorShader,
      wobbleScaleShader,
      wobblePositionShader
    )
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
