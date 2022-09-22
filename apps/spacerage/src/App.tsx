import { Loader } from "@react-three/drei"
import { Suspense } from "react"
import * as RC from "render-composer"
import { PostProcessing } from "./common/PostProcessing"
import { GameplayScene } from "./scenes/gameplay/GameplayScene"
import { MenuScene } from "./scenes/menu/MenuScene"
import { GameState } from "./state"

export const App = () => (
  <>
    <Loader />

    <RC.Canvas dpr={1}>
      <RC.RenderPipeline>
        <PostProcessing />
        <Suspense>
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
