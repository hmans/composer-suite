import { ModuleFactory } from "material-composer"
import {
  composable,
  MaterialModules,
  moduleComponent,
  modules,
  SurfaceWobble
} from "material-composer-r3f"
import { Heat, HeatOptions } from "material-composer/units"
import { Description } from "r3f-stage"
import { GlobalTime, Gradient, Mul, Vec3 } from "shader-composer"
import * as THREE from "three"

export type LavaProps = HeatOptions

export const LavaModule: ModuleFactory<LavaProps> = (props) => (state) => ({
  ...state,
  color: Gradient(
    Heat(state.position, props),
    [new THREE.Color("#03071E"), 0],
    [new THREE.Color("#03071E"), 0.1],
    [new THREE.Color("#DC2F02"), 0.5],
    [new THREE.Color("#E85D04"), 0.6],
    [new THREE.Color("#FFBA08").multiplyScalar(2), 0.65],
    [new THREE.Color("white").multiplyScalar(2), 0.97],
    [new THREE.Color("white").multiplyScalar(2), 0.99],
    [new THREE.Color("white").multiplyScalar(2), 1]
  )
})

export const Lava = moduleComponent(LavaModule)

export default function FireballExample() {
  const time = GlobalTime

  return (
    <group position-y={1.5}>
      <directionalLight intensity={0.8} position={[20, 10, 10]} />

      <mesh castShadow>
        <icosahedronGeometry args={[1, 8]} />

        <meshStandardMaterial autoShadow>
          <MaterialModules>
            <SurfaceWobble offset={Mul(time, 0.4)} amplitude={0.1} />

            <Lava
              offset={Mul(Vec3([0.1, 0.2, 0.5]), time)}
              scale={0.3}
              octaves={5}
              power={1}
            />
          </MaterialModules>
        </meshStandardMaterial>
      </mesh>

      <Description>
        Example combining the <strong>DistortSurface</strong> module with a
        custom module implementing a lava effect. The mesh also uses a
        <strong>custom depth material</strong> to allow shadows to follow the
        surface distortion.
      </Description>
    </group>
  )
}
