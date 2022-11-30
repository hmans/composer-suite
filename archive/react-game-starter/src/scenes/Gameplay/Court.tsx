import { GroupProps, MeshProps } from "@react-three/fiber"
import { pipe } from "fp-ts/function"
import { forwardRef } from "react"
import {
  Add,
  Mul,
  ShaderMaterialRoot,
  Time,
  vec2,
  vec3,
  VertexPosition
} from "shader-composer"
import { useShader } from "@shader-composer/r3f"
import { Grid2D } from "shader-composer-toybox"
import { Color, Mesh } from "three"
import { courtHeight, courtWidth, wallColor } from "./configuration"
import { setGameObject } from "./state"

const HorizontalWall = forwardRef<Mesh, MeshProps>((props, ref) => (
  <mesh {...props} ref={ref}>
    <boxGeometry args={[courtWidth, 0.1, 0.3]} />
    <meshStandardMaterial color={wallColor} />
  </mesh>
))

const VerticalWall = forwardRef<Mesh, MeshProps>((props, ref) => (
  <mesh {...props} ref={ref}>
    <boxGeometry args={[0.1, courtHeight, 0.3]} />
    <meshStandardMaterial color={wallColor} />
  </mesh>
))

const MiddleLine = () => (
  <mesh position-z={0.001}>
    <planeGeometry args={[0.3, courtHeight]} />
    <meshStandardMaterial color={wallColor} opacity={0.2} transparent />
  </mesh>
)

const Background = () => {
  const shader = useShader(() => {
    const a = pipe(
      Time(),
      (v) => vec3(Mul(v, 2), v, 0),
      (v) => Add(VertexPosition, v),
      ({ x, y }) => Grid2D(vec2(x, y), 1, 0.035)
    )

    return ShaderMaterialRoot({
      color: new Color("hotpink"),
      alpha: Add(0.03, Mul(a, 0.4))
    })
  }, [])

  return (
    <mesh>
      <planeGeometry args={[courtWidth, courtHeight]} />
      <shaderMaterial {...shader} transparent key={Math.random()} />
    </mesh>
  )
}

const Court = (props: GroupProps) => {
  return (
    <group {...props}>
      <HorizontalWall
        position-y={-courtHeight / 2}
        ref={setGameObject("lowerWall")}
      />
      <HorizontalWall
        position-y={+courtHeight / 2}
        ref={setGameObject("upperWall")}
      />
      <VerticalWall
        position-x={-(courtWidth / 2 - 0.05)}
        ref={setGameObject("leftWall")}
      />
      <VerticalWall
        position-x={+(courtWidth / 2 - 0.05)}
        ref={setGameObject("rightWall")}
      />
      <MiddleLine />
      <Background />
    </group>
  )
}

export default Court
