import { PerspectiveCamera } from "@react-three/drei"
import { composable, modules } from "material-composer-r3f"
import { bitmask, Layers } from "render-composer"
import { Vec3 } from "shader-composer"
import { Color } from "three"
import { Skybox } from "../../common/Skybox"
import { store } from "../../PostProcessing"
import { useCapture } from "../../lib/useCapture"
import { AsteroidBelt } from "./vfx/AsteroidBelt"
import { Dust } from "./vfx/Dust"
import { Nebula } from "./vfx/Nebula"

export const MenuScene = () => {
  return (
    <group>
      <ambientLight
        intensity={0.1}
        layers-mask={bitmask(Layers.Default, Layers.TransparentFX)}
      />
      <directionalLight
        position={[30, 0, -30]}
        intensity={2}
        layers-mask={bitmask(Layers.Default, Layers.TransparentFX)}
      />

      <PerspectiveCamera position={[0, 0, 20]} rotation-y={-0.8} makeDefault />

      <Dust />
      <Skybox />

      {/* "Sun" */}
      <mesh ref={useCapture(store, "sun")} position={[275, 10, -200]}>
        <sphereGeometry args={[40]} />
        <meshBasicMaterial color={new Color("#fff").multiplyScalar(1)} />
      </mesh>

      <group position={[30, 0, -30]} rotation={[0.6, 0, -0.2]}>
        <Nebula
          dimensions={Vec3([30, 10, 30])}
          amount={20}
          opacity={0.3}
          rotationSpeed={0.05}
          maxSize={30}
          minSize={10}
          color={new Color("#fff").multiplyScalar(20)}
        />

        <mesh scale={9}>
          <sphereGeometry args={[1, 32, 32]} />

          <composable.meshStandardMaterial
            color="brown"
            metalness={0.5}
            roughness={0.6}
          >
            <modules.Color color={new Color("#754")} />
          </composable.meshStandardMaterial>
        </mesh>

        <AsteroidBelt />
      </group>
    </group>
  )
}
