import { PerspectiveCamera, Text } from "@react-three/drei"
import { Composable, Modules } from "material-composer-r3f"
import { GlobalTime } from "shader-composer"
import { Color } from "three"
import { ScenePass } from "../../lib/ScenePass"

export const HUD = () => {
  return (
    <>
      <ScenePass>
        <PerspectiveCamera position={[0, 0, 20]} makeDefault />

        <Text
          color={new Color("hotpink").multiplyScalar(10)}
          fontSize={2}
          position={[-3, 7, 0]}
          rotation={[0, 0.8, 0.3]}
        >
          723.389.150
          <Composable.meshBasicMaterial
            attach="material"
            color={new Color("hotpink").multiplyScalar(3)}
            depthTest={false}
          >
            <Modules.SurfaceWobble offset={GlobalTime} amplitude={0.2} />
          </Composable.meshBasicMaterial>
        </Text>
      </ScenePass>

      {/* <RC.EffectPass>
              <RC.SelectiveBloomEffect intensity={4} luminanceThreshold={1} />
            </RC.EffectPass> */}
    </>
  )
}
