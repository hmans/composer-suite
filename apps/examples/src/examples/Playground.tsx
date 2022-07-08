import { useFrame } from "@react-three/fiber"
import { useMemo } from "react"
import {
  Add,
  compileShader,
  CustomShaderMaterialMaster,
  Float,
  Multiply,
  Simplex3DNoise,
  Sin,
  Smoothstep,
  Step,
  Subtract,
  Time,
  Vec3,
  VertexPosition
} from "shadenfreude"
import { Color, DoubleSide, MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"

export default function Playground() {
  const [shader, update] = useMemo(() => {
    /* Define a base color: */
    const baseColor = Vec3(new Color("#88c"))

    /* Now let's calculate a noise value based on the vertex position: */
    const noise = Simplex3DNoise(Multiply(VertexPosition, 0.3))

    /* We will be animating the threshold over time: */
    const threshold = Sin(Time)

    /* Here's a small function that will calculate alpha: */
    const DissolveAlpha = (noise: Float, threshold: Float) =>
      Step(noise, threshold)

    /* This function will return a cool edge color based on the dissolve: */
    const DissolveBorder = (
      noise: Float,
      threshold: Float,
      edgeColor: Vec3 = new Color(0, 10, 8)
    ) =>
      Multiply(
        edgeColor,
        Smoothstep(Subtract(threshold, 0.2), Add(threshold, 0.2), noise)
      )

    /* Now let's glue everything together: */
    const root = CustomShaderMaterialMaster({
      diffuseColor: Add(baseColor, DissolveBorder(noise, threshold)),
      alpha: DissolveAlpha(noise, threshold)
    })

    return compileShader(root)
  }, [])

  useFrame((_, dt) => update(dt))

  console.log(shader.vertexShader)
  console.log(shader.fragmentShader)

  return (
    <group position-y={15}>
      <mesh>
        <icosahedronGeometry args={[8, 64]} />

        <CustomShaderMaterial
          baseMaterial={MeshStandardMaterial}
          {...shader}
          transparent
          side={DoubleSide}
        />
      </mesh>
    </group>
  )
}
