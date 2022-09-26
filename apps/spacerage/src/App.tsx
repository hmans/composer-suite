import { Loader, PerspectiveCamera } from "@react-three/drei"
import { Suspense } from "react"
import * as RC from "render-composer"
import { PostProcessing } from "./common/PostProcessing"
import { Stage } from "./configuration"
import { useCapture } from "./lib/useCapture"
import { GameplayScene } from "./scenes/gameplay/GameplayScene"
import { MenuScene } from "./scenes/menu/MenuScene"
import { GameState, store } from "./state"
import { Perf } from "r3f-perf"

export const App = () => (
  <>
    <Loader />

    <RC.Canvas dpr={1}>
      <RC.RenderPipeline updatePriority={Stage.Render}>
        <PostProcessing />
        <Suspense>
          <PerspectiveCamera
            position={[0, 0, 20]}
            rotation-y={-0.8}
            makeDefault
            ref={useCapture(store, "camera")}
          />

          <GameState.Match state="menu">
            <MenuScene />
          </GameState.Match>

          <GameState.Match state="gameplay">
            <GameplayScene />
          </GameState.Match>

          <Perf matrixUpdate />
        </Suspense>
      </RC.RenderPipeline>
    </RC.Canvas>
  </>
)
