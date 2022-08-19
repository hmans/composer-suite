import {
  Add,
  Input,
  Lerp,
  Mul,
  NormalizePlusMinusOne,
  OneMinus,
  pipe,
  Pow,
  Time,
  Unit,
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
  time?: Input<"float">
  scale?: Input<"float">
  octaves?: number
  power?: Input<"float">
  color?: (heat: Input<"float">) => Unit<"vec3">
}

const Lava: ModuleFactory<LavaProps> = ({
  time = Time(),
  scale = 1,
  octaves = 5,
  power = 1,
  color = (heat) => Lerp(new Color("black"), new Color("white"), heat)
}) => (state) => ({
  ...state,
  color: pipe(
    time,
    /* Modify the original vertex position using offset based on time. */
    (v) => vec3(Mul(v, 0.1), Mul(v, 0.3), Mul(v, 0.5)),
    (v) => Add(VertexPosition, v),

    /* Apply the user-provided turbulence scale. */
    (v) => Mul(v, scale),

    /* Calculate the turbulence. */
    (v) => Turbulence3D(v, octaves),
    (v) => NormalizePlusMinusOne(v),
    (v) => Pow(v, power),
    (v) => OneMinus(v),

    /* Apply color */
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
              scale: 0.5,
              octaves: 5
            })}
          />
        </VFXMaterial>
      </mesh>
    </group>
  )
}
