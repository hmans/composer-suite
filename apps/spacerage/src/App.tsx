import { Loader, PerspectiveCamera } from "@react-three/drei"
import { Suspense } from "react"
import * as RC from "render-composer"
import { PostProcessing } from "./common/PostProcessing"
import { useCapture } from "./lib/useCapture"
import { GameplayScene } from "./scenes/gameplay/GameplayScene"
import { MenuScene } from "./scenes/menu/MenuScene"
import { GameState, store } from "./state"

export const App = () => (
  <>
    <Loader />

    <RC.Canvas dpr={1}>
      <RC.RenderPipeline>
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
        </Suspense>
      </RC.RenderPipeline>
    </RC.Canvas>
  </>
)
