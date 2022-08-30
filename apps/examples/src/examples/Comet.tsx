import { composable, Layer, modules } from "material-composer-r3f"
import { memo } from "react"
import {
  Add,
  Mul,
  NormalizePlusMinusOne,
  OneMinus,
  pipe,
  Smoothstep,
  Sub,
  Time,
  vec3,
  VertexPosition
} from "shader-composer"
import { PSRDNoise3D } from "shader-composer-toybox"
import { Color, DoubleSide } from "three"

export default function CometExample() {
  return (
    <group position-y={1.5}>
      <Rock />
      <FireShield />
      {/* <OuterShield /> */}
      {/* <OutestShield /> */}
    </group>
  )
}

const Rock = () => (
  <mesh>
    <icosahedronGeometry args={[1, 0]} />
    <meshStandardMaterial color="#222" />
  </mesh>
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
