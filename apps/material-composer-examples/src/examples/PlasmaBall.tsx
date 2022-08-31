import { ModuleFactory } from "material-composer"
import { composable, modules } from "material-composer-r3f"
import { moduleComponent } from "material-composer-r3f/src/reactor"
import { Heat, HeatOptions } from "material-composer/units"
import { Cos, Gradient, Mul, OneMinus, Smoothstep, Time } from "shader-composer"
import { Color, DoubleSide } from "three"

export type PlasmaProps = HeatOptions

export const PlasmaModule: ModuleFactory<PlasmaProps> = ({
  offset,
  scale = 0.5,
  octaves = 3,
  power = 1
}) => (state) => {
  const heat = OneMinus(Heat(state.position, { offset, scale, octaves, power }))
  const alpha = Smoothstep(0.7, 0.9, heat)

  return {
    ...state,
    alpha,
    color: Gradient(
      heat,
      [new Color("#457b9d"), 0.85],
      [new Color("#a2d2ff"), 0.95],
      [new Color("white").multiplyScalar(3), 0.975]
    )
  }
}

export const Plasma = moduleComponent(PlasmaModule)

export default function PlasmaBallExample() {
  const time = Time()

  return (
    <group position-y={1.5}>
      <directionalLight intensity={0.8} position={[20, 10, 10]} />

      <mesh>
        <icosahedronGeometry args={[1, 8]} />

        <composable.meshStandardMaterial transparent side={DoubleSide}>
          <modules.SurfaceWobble
            offset={Mul(time, 0.5)}
            amplitude={Mul(Cos(time), 0.2)}
          />
          <Plasma offset={Mul(time, 0.3)} />
        </composable.meshStandardMaterial>
      </mesh>
    </group>
  )
}
