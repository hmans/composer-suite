import { useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useControls } from "leva"
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
  Uniform,
  Value,
  Vec2,
  Vec3,
  Vec4,
  VertexPosition
} from "shadenfreude"
import { Color, DoubleSide, MeshStandardMaterial } from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import textureUrl from "./textures/hexgrid.jpeg"

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

const SampleTexture = (t: Value<"sampler2D">, xy: Vec2) =>
  Vec4("texture2D(t, xy)", { inputs: { t, xy } })

export default function Playground() {
  const texture = useTexture(textureUrl)

  const { u_threshold } = useControls("Uniforms", {
    u_threshold: { value: 0, min: -1, max: 1 }
  })

  const [{ uniforms, ...shader }, update] = useMemo(() => {
    console.log("compiling shader")

    const parameters = {
      threshold: Uniform("float", "u_threshold"),
      texture: Uniform("sampler2D", "u_texture")
    }

    /* Use the thing: */
    const dissolve = Dissolve(parameters.threshold, 0.3)

    const root = CustomShaderMaterialMaster({
      diffuseColor: Add(new Color("#666"), dissolve.color),
      alpha: dissolve.alpha
    })

    return compileShader(root)
  }, [])

  useFrame((_, dt) => update(dt))

  // console.log(shader.vertexShader)
  // console.log(shader.fragmentShader)

  return (
    <group position-y={15}>
      <mesh>
        <icosahedronGeometry args={[12, 8]} />

        <CustomShaderMaterial
          baseMaterial={MeshStandardMaterial}
          uniforms={{
            u_threshold: { value: u_threshold },
            u_texture: { value: texture },
            ...uniforms
          }}
          {...shader}
          transparent
          side={DoubleSide}
        />
      </mesh>
    </group>
  )
}
