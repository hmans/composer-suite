import { Loader } from "@react-three/drei"
import { Suspense } from "react"
import * as RC from "render-composer"
import { PostProcessing } from "./common/PostProcessing"
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
        </Suspense>
      </RC.RenderPipeline>
    </RC.Canvas>
  </>
)
