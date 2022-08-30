import { Animate } from "@hmans/things"
import { CameraShake, Float, useTexture } from "@react-three/drei"
import { GroupProps } from "@react-three/fiber"
import { composable, Layer, modules } from "material-composer-r3f"
import { memo } from "react"
import {
  Abs,
  Add,
  GLSLType,
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
      <group position-y={1.5}>
        <TestAura />
      </group>
      {/* <CameraShake /> */}
      {/* <Comet position={[-1, 1, 0]} /> */}
    </group>
  )
}

const TestAura = () => {
  const streamTexture = useTexture(streamTextureUrl)
  streamTexture.wrapS = streamTexture.wrapT = RepeatWrapping

  const time = Time()
  const streamSampler = useUniformUnit("sampler2D", streamTexture)

  const heat = Texture2D(
    streamSampler,
    TilingUV(UV, vec2(3, 1), vec2(0, Inverted(Add(time, UV.x))))
  )

  return (
    <mesh scale-y={1.5} castShadow>
      <sphereGeometry args={[1, 32, 16]} />

      <composable.MeshBasicMaterial transparent side={DoubleSide}>
        <modules.Gradient
          stops={[
            [new Color("#d62828").multiplyScalar(1.5), 0],
            [new Color("#fb8b24").multiplyScalar(2), 0.5],
            [new Color("#fb8b24").multiplyScalar(2), 0.9],
            [new Color("#f8f9fa").multiplyScalar(8), 1]
          ]}
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
        <FireShield />
        {/* <OuterShield /> */}
        {/* <OutestShield /> */}
      </Float>
    </group>
  </group>
)

const Rock = () => (
  <Animate fun={(g, dt) => (g.rotation.x = g.rotation.y += 2 * dt)}>
    <mesh>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#222" />
    </mesh>
  </Animate>
)

const FireShield = memo(() => {
  const time = Time()

  const mask = pipe(
    VertexPosition,
    (v) => vec3(Add(v.x, Mul(time, 1)), v.y, v.z),
    PSRDNoise3D,
    NormalizePlusMinusOne,
    (v) => Smoothstep(VertexPosition.x, VertexPosition.x, v)
  )

  const heat = pipe(
    VertexPosition,
    (v) => vec3(Sub(Mul(v.x, 0.1), Mul(time, 4)), v.y, v.z),
    PSRDNoise3D,
    NormalizePlusMinusOne,
    (v) => Smoothstep(0.5, 0.7, v)
  )

  return (
    <mesh scale={[2, 1.3, 1.3]} position-x={0.7}>
      <sphereGeometry />
      <composable.MeshStandardMaterial transparent depthWrite={false}>
        {/* <modules.Color color={vec3(heat, heat, heat)} /> */}
        <modules.Gradient
          stops={[
            [new Color("yellow"), 0],
            [new Color("#e63946"), 0.7]
          ]}
          position={heat}
        />
        <modules.Alpha alpha={Mul(heat, mask)} />
      </composable.MeshStandardMaterial>
    </mesh>
  )
})

const OutestShield = () => (
  <mesh scale={[2, 1.5, 1.5]} position-x={0.6}>
    <sphereGeometry />
    <meshStandardMaterial
      color="blue"
      opacity={0.1}
      side={DoubleSide}
      transparent
      depthWrite={false}
    />
  </mesh>
)

const OuterShield = () => (
  <mesh scale={[2, 1.3, 1.3]} position-x={0.7}>
    <sphereGeometry />
    <meshStandardMaterial
      color="red"
      opacity={0.1}
      side={DoubleSide}
      transparent
      depthWrite={false}
    />
  </mesh>
)
