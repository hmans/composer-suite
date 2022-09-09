import { RenderCanvas, RenderPipeline } from "render-composer"
import { GameplayScene } from "./scenes/gameplay/GameplayScene"

export function App() {
  return (
    <RenderCanvas>
      <RenderPipeline bloom antiAliasing vignette>
        <GameplayScene />
      </RenderPipeline>
    </RenderCanvas>
  )
}
