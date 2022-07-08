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
    /* Put this into an NPM package, I dare you: */
    const Dissolve = (
      threshold: Float = 0.5,
      speed: Float = 1,
      edgeColor: Vec3 = new Color(0, 10, 8)
    ) => {
      const noise = Simplex3DNoise(Multiply(VertexPosition, speed))

      return {
        color: Multiply(
          edgeColor,
          Smoothstep(Subtract(threshold, 0.2), threshold, noise)
        ),

        alpha: Step(noise, threshold)
      }
    }

    /* Use the thing: */
    const dissolve = Dissolve(Multiply(Sin(Time), 1.15), 0.3)

    const root = CustomShaderMaterialMaster({
      diffuseColor: Add(new Color("#666"), dissolve.color),
      alpha: dissolve.alpha
    })

    return compileShader(root)
  }, [])

  useFrame((_, dt) => update(dt))

  console.log(shader.vertexShader)
  console.log(shader.fragmentShader)

  return (
    <group position-y={15}>
      <mesh>
        <icosahedronGeometry args={[12, 8]} />

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
