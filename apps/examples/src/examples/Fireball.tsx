import { Add, Input, Mul, pipe, Time } from "shader-composer"
import { PSRDNoise3D } from "shader-composer-toybox"
import { MeshStandardMaterial } from "three"
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

export default function FireballExample() {
  return (
    <group position-y={1.5}>
      <mesh>
        <icosahedronGeometry args={[1, 8]} />

        <VFXMaterial baseMaterial={MeshStandardMaterial}>
          <VFX.Module
            module={DistortSurface({ amplitude: 0.1, frequency: 0.7 })}
          />
        </VFXMaterial>
      </mesh>
    </group>
  )
}
