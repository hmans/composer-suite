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
    const dissolve = Dissolve(Sin(Time), 0.3)

    const root = CustomShaderMaterialMaster({
      diffuseColor: Add(new Color("#88c"), dissolve.color),
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
        <icosahedronGeometry args={[8, 64]} />

        <CustomShaderMaterial
          baseMaterial={MeshStandardMaterial}
          {...shader}
          transparent
          side={DoubleSide}
          alphaTest={0.8}
        />
      </mesh>
    </group>
  )
}
