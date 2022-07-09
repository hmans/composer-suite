import { useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useControls } from "leva"
import { useEffect, useMemo } from "react"
import {
  Add,
  Bool,
  compileShader,
  CustomShaderMaterialMaster,
  Dissolve,
  Divide,
  Float,
  Join,
  Multiply,
  Pipe,
  Resolution,
  Sampler2D,
  Split,
  Subtract,
  Time,
  Uniform,
  UV,
  Value,
  Vec2,
  Vec3,
  Vec4
} from "shadenfreude"
import {
  Color,
  DoubleSide,
  MeshStandardMaterial,
  RepeatWrapping,
  Vector2
} from "three"
import CustomShaderMaterial from "three-custom-shader-material"
import textureUrl from "./textures/hexgrid.jpeg"

const SampleTexture = (name: string, t: Bool, xy: Vec2) =>
  Vec4(`texture2D(${name}, xy)`, { inputs: { t, xy } })

export default function Playground() {
  const texture = useTexture(textureUrl)
  texture.wrapS = RepeatWrapping
  texture.wrapT = RepeatWrapping

  const controls = useControls("Uniforms", {
    visibility: { value: 0.5, min: 0, max: 1 },
    edgeThickness: { value: 0.1, min: 0, max: 0.5 }
  })

  const [{ uniforms, ...shader }, update] = useMemo(() => {
    console.log("compiling shader")

    const parameters = {
      visibility: Uniform("float", "u_visibility"),
      edgeThickness: Uniform("float", "u_edgeThickness"),
      texture: Sampler2D("u_texture")
    }

    /* Use the thing: */
    const dissolve = Dissolve(
      parameters.visibility,
      0.3,
      parameters.edgeThickness
    )

    const map = SampleTexture(
      "u_texture",
      parameters.texture,
      Subtract(Multiply(UV, new Vector2(4, 2)), Join(Multiply(Time, 0.03), 0))
    )

    const splitMap = Split(map)

    const mapDiffuse = Join(splitMap[0], splitMap[1], splitMap[2])

    const root = CustomShaderMaterialMaster({
      diffuseColor: Pipe(
        Vec3(new Color("#4cf")),
        ($) => Multiply($, mapDiffuse),
        ($) => Add($, dissolve.color)
      ),
      alpha: dissolve.alpha
    })

    return compileShader(root)
  }, [])

  const myUniforms = useMemo(
    () => ({
      ...uniforms,
      u_visibility: { value: controls.visibility },
      u_edgeThickness: { value: controls.edgeThickness },
      u_texture: { value: texture }
    }),
    []
  )

  myUniforms.u_visibility.value = controls.visibility
  myUniforms.u_edgeThickness.value = controls.edgeThickness

  useFrame((_, dt) => update(dt))

  // console.log(shader.vertexShader)
  // console.log(shader.fragmentShader)

  return (
    <group position-y={15}>
      <mesh>
        <icosahedronGeometry args={[12, 8]} />

        <CustomShaderMaterial
          baseMaterial={MeshStandardMaterial}
          uniforms={myUniforms}
          {...shader}
          transparent
          side={DoubleSide}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
    </group>
  )
}
