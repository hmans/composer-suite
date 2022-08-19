import { useTexture } from "@react-three/drei"
import {
  Add,
  Input,
  Lerp,
  Mul,
  NormalizePlusMinusOne,
  OneMinus,
  pipe,
  Pow,
  Texture2D,
  Time,
  UniformUnit,
  Unit,
  vec2,
  Vec3,
  vec3,
  VertexPosition
} from "shader-composer"
import { PSRDNoise3D, Turbulence3D } from "shader-composer-toybox"
import { Color, MeshStandardMaterial } from "three"
import { VFX, VFXMaterial } from "vfx-composer-r3f"
import { ModuleFactory } from "vfx-composer/modules"

type DistortSurfaceProps = {
  time?: Input<"float">
  frequency?: Input<"float">
  amplitude?: Input<"float">
}

const DistortSurface: ModuleFactory<DistortSurfaceProps> = ({
  time = Time(),
  frequency = 1,
  amplitude = 1
}) => (state) => {
  const displacement = pipe(
    state.position,
    (v) => Add(v, Mul(time, frequency)),
    (v) => PSRDNoise3D(v),
    (v) => Mul(v, amplitude)
  )

  const position = pipe(
    displacement,
    (v) => Mul(state.normal, v),
    (v) => Add(state.position, v)
  )

  return { ...state, position }
}

type LavaProps = {
  offset?: Input<"vec3">
  scale?: Input<"float">
  octaves?: number
  power?: Input<"float">
  color?: (heat: Input<"float">) => Unit<"vec3">
}

const Lava: ModuleFactory<LavaProps> = ({
  offset = vec3(0, 0, 0),
  scale = 1,
  octaves = 5,
  power = 1,
  color = (heat) => Lerp(new Color("black"), new Color("white"), heat)
}) => (state) => ({
  ...state,
  color: pipe(
    VertexPosition,
    (v) => Add(v, offset),
    (v) => Mul(v, scale),
    (v) => Turbulence3D(v, octaves),
    (v) => NormalizePlusMinusOne(v),
    (v) => OneMinus(v),
    (v) => Pow(v, power),
    (v) => color(v)
  )
})

export default function FireballExample() {
  return (
    <group position-y={1.5}>
      <mesh>
        <icosahedronGeometry args={[1, 8]} />

        <VFXMaterial baseMaterial={MeshStandardMaterial}>
          <VFX.Module
            module={DistortSurface({
              amplitude: 0.1,
              frequency: 0.7
            })}
          />

          <VFX.Module
            module={Lava({
              offset: Mul(vec3(0.1, 0.2, 0.5), Time()),
              scale: 0.4,
              octaves: 5
            })}
          />
        </VFXMaterial>
      </mesh>
    </group>
  )
}
