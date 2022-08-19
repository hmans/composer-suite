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
  Remap,
  Smoothstep,
  Texture2D,
  Time,
  UniformUnit,
  Unit,
  vec2,
  Vec3,
  vec3,
  VertexPosition
} from "shader-composer"
import { useUniformUnit } from "shader-composer-r3f"
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

const LavaColors = {
  white: new Color("white"),
  yellow: new Color("yellow"),
  red: new Color("red"),
  black: new Color("black")
}

const Lava: ModuleFactory<LavaProps> = ({
  offset = vec3(0, 0, 0),
  scale = 1,
  octaves = 5,
  power = 1,
  color = (heat) =>
    pipe(
      Vec3(LavaColors.white),
      (v) => Lerp(v, LavaColors.yellow, Smoothstep(0.4, 0.6, heat))
      // (v) => Lerp(v, LavaColors.red, Smoothstep(0.3, 0.6, heat)),
      // (v) => Lerp(v, LavaColors.black, Smoothstep(0.6, 1, heat))
    )
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

import textureUrl from "./textures/explosion.png"

export default function FireballExample() {
  const texture = useTexture(textureUrl)
  const sampler = useUniformUnit("sampler2D", texture)

  return (
    <group position-y={1.5}>
      <directionalLight intensity={1} position={[20, 10, 10]} />
      <mesh>
        <icosahedronGeometry args={[1, 8]} />

        <VFXMaterial baseMaterial={MeshStandardMaterial}>
          <VFX.Module
            module={DistortSurface({ amplitude: 0.1, frequency: 0.7 })}
          />

          <VFX.Module
            module={Lava({
              offset: Mul(vec3(0.1, 0.2, 0.5), Time()),
              scale: 0.4,
              octaves: 5,
              color: (heat) => Texture2D(sampler, vec2(0, heat)).color
            })}
          />
        </VFXMaterial>
      </mesh>
    </group>
  )
}
