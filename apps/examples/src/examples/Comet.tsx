import { Animate } from "@hmans/things"
import { CameraShake, Float, useTexture } from "@react-three/drei"
import { GroupProps, MeshProps } from "@react-three/fiber"
import { composable, Layer, modules } from "material-composer-r3f"
import { memo } from "react"
import {
  Abs,
  Add,
  GLSLType,
  GradientStops,
  Input,
  Mul,
  NormalizePlusMinusOne,
  OneMinus,
  pipe,
  Saturate,
  Sin,
  Smoothstep,
  Sub,
  Texture2D,
  TilingUV,
  Time,
  type,
  Unit,
  UV,
  vec2,
  vec3,
  VertexPosition
} from "shader-composer"
import { useUniformUnit } from "shader-composer-r3f"
import { PSRDNoise3D } from "shader-composer-toybox"
import { Color, DoubleSide, RepeatWrapping } from "three"
import streamTextureUrl from "./textures/stream.png"

const Inverted = <T extends GLSLType>(v: Input<T>) =>
  Unit(type(v), Mul(v, -1), { name: "Inverted Value" })

export default function CometExample() {
  return (
    <group>
      <group position-y={1.5}>{/* <TestAura /> */}</group>
      <CameraShake />
      <Comet position={[-1, 1.5, 0]} />
    </group>
  )
}

const TestAura = () => (
  <Aura
    scale-y={1}
    castShadow
    gradient={[
      [new Color("#d62828").multiplyScalar(1.5), 0],
      [new Color("#fb8b24").multiplyScalar(2), 0.5],
      [new Color("#fb8b24").multiplyScalar(2), 0.9],
      [new Color("#f8f9fa").multiplyScalar(8), 1]
    ]}
    tiling={vec2(3, 0.5)}
    offset={vec2(0, Inverted(Add(Time(), UV.x)))}
  />
)

const Aura = ({
  gradient,
  tiling = vec2(3, 1),
  offset = vec2(0, 0),
  ...props
}: {
  gradient: GradientStops<"vec3">
  tiling?: Input<"vec2">
  offset?: Input<"vec2">
} & MeshProps) => {
  /* Load texture */
  const streamTexture = useTexture(streamTextureUrl)
  streamTexture.wrapS = streamTexture.wrapT = RepeatWrapping

  /* Create sampler2D uniform */
  const streamSampler = useUniformUnit("sampler2D", streamTexture)

  /* Sample texture */
  const heat = Texture2D(streamSampler, TilingUV(UV, tiling, offset))

  return (
    <mesh {...props}>
      <sphereGeometry args={[1, 32, 16]} />

      <composable.MeshBasicMaterial
        transparent
        side={DoubleSide}
        depthWrite={false}
      >
        <modules.Gradient
          stops={gradient}
          start={0}
          stop={1}
          position={heat.alpha}
        />
        <modules.Alpha alpha={heat.alpha} />
      </composable.MeshBasicMaterial>
    </mesh>
  )
}

const Comet = (props: GroupProps) => (
  <group {...props}>
    <group rotation-z={Math.PI / 5}>
      <Float>
        <Rock />

        <Aura
          scale={[1.2, 2, 1.2]}
          position-y={0.8}
          gradient={[
            [new Color("#d62828").multiplyScalar(1.5), 0],
            [new Color("#fb8b24").multiplyScalar(2), 0.5],
            [new Color("#fb8b24").multiplyScalar(2), 0.9],
            [new Color("#f8f9fa").multiplyScalar(8), 1]
          ]}
          tiling={vec2(3, 0.5)}
          offset={vec2(0, Inverted(Add(Time(), UV.x)))}
        />

        <Aura
          scale={[1.6, 1.8, 1.6]}
          position-y={0.5}
          gradient={[
            [new Color("#7209b7").multiplyScalar(1.5), 0],
            [new Color("#b5179e").multiplyScalar(2), 0.5],
            [new Color("#b5179e").multiplyScalar(2), 0.9],
            [new Color("#f72585").multiplyScalar(8), 1]
          ]}
          tiling={vec2(3, 0.5)}
          offset={vec2(0, Inverted(Add(Time(), UV.x)))}
        />
      </Float>
    </group>
  </group>
)

const Rock = () => (
  <Animate fun={(g, dt) => (g.rotation.x = g.rotation.y += 2 * dt)}>
    <mesh>
      <icosahedronGeometry args={[1, 0]} />
      <composable.MeshStandardMaterial color="#222" />
    </mesh>
  </Animate>
)
