import "r3f-stage/styles.css"
import { Application } from "r3f-stage"
import * as UI from "@hmans/scene-ui"
import { Anchor } from "@hmans/scene-ui"

export const App = () => {
  return (
    <Application>
      <UI.Canvas width={6} height={4} debug>
        <UI.Rect margin={0.25}>
          <UI.Rect anchor={Anchor.BottomCenter} margin={[-1, 1.5, 0.25, 1.5]} />
        </UI.Rect>
      </UI.Canvas>
    </Application>
  )
}
