import { Suspense } from "react"
import { RenderCanvas, RenderPipeline } from "render-composer"
import { GameplayScene } from "./scenes/gameplay/GameplayScene"
import { FSM } from "./state"

export function App() {
  return (
    <RenderCanvas>
      <RenderPipeline bloom antiAliasing vignette>
        <Suspense>
          <FSM.Match state="gameplay">
            <GameplayScene />
          </FSM.Match>
        </Suspense>
      </RenderPipeline>
    </RenderCanvas>
  )
}
