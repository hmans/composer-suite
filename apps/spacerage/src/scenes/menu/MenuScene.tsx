import { useFrame } from "@react-three/fiber"
import { flow } from "fp-ts/lib/function"
import { createPressInteraction, useInput } from "input-composer"
import { composable, modules } from "material-composer-r3f"
import { Suspense, useCallback } from "react"
import { bitmask, Layers } from "render-composer"
import { Vec3 } from "shader-composer"
import { Color } from "three"
import { store } from "../../common/PostProcessing"
import { Skybox } from "../../common/Skybox"
import { useCapture } from "../../lib/useCapture"
import { startGame } from "../../state"
import { MenuDroneSFX } from "./sfx/MenuDroneSFX"
import { AsteroidBelt } from "./vfx/AsteroidBelt"
import { Dust } from "./vfx/Dust"
import { Nebula } from "./vfx/Nebula"

const MenuScene = () => {
  const input = useInput()

  const processInput = useCallback(
    flow(
      () => input().keyboard.key("Space"),
      createPressInteraction(startGame)
    ),
    [input]
  )

  useFrame(() => {
    processInput()
  })

  return (
    <Suspense>
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

        <MenuDroneSFX />
      </group>
    </Suspense>
  )
}

export default MenuScene
