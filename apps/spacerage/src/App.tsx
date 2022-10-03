import { PerspectiveCamera } from "@react-three/drei"
import * as AC from "audio-composer"
import { AudioListener } from "audio-composer"
import { Perf } from "r3f-perf"
import { lazy, Suspense } from "react"
import * as RC from "render-composer"
import { PostProcessing } from "./common/PostProcessing"
import { Stage } from "./configuration"
import { StartScreen } from "./lib/StartScreen"
import { useCapture } from "./lib/useCapture"
import GameplayScene from "./scenes/gameplay/GameplayScene"
import MenuScene from "./scenes/menu/MenuScene"
import { GameState, store } from "./state"

// const MenuScene = lazy(() => import("./scenes/menu/MenuScene"))
// const GameplayScene = lazy(() => import("./scenes/gameplay/GameplayScene"))

export const App = () => (
  <StartScreen>
    <RC.Canvas dpr={1}>
      <RC.RenderPipeline updatePriority={Stage.Render}>
        <AC.AudioContext>
          <AC.Compressor>
            {/* <AC.Reverb seconds={2} decay={5}> */}
            <PostProcessing />
            <Suspense>
              <PerspectiveCamera
                position={[0, 0, 20]}
                rotation-y={-0.8}
                makeDefault
                ref={useCapture(store, "camera")}
              >
                <AudioListener />
              </PerspectiveCamera>

              <GameState.Match state="menu">
                <Suspense>
                  <MenuScene />
                </Suspense>
              </GameState.Match>

              <GameState.Match state="gameplay">
                <Suspense>
                  <GameplayScene />
                </Suspense>
              </GameState.Match>

              <Perf matrixUpdate />
            </Suspense>
            {/* </AC.Reverb> */}
          </AC.Compressor>
        </AC.AudioContext>
      </RC.RenderPipeline>
    </RC.Canvas>
  </StartScreen>
)
