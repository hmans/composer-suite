import "r3f-stage/styles.css"
import { Application } from "r3f-stage"
import * as UI from "@hmans/scene-ui"

export const App = () => {
  return (
    <Application>
      <UI.Canvas width={6} height={4} debug>
        <UI.Rect margin={[0.25, 0.25, 0.25, 0.25]}>
          <UI.Rect anchor={[1, 0.5, 0, 0.5]} margin={[-1, 1.5, 0.25, 1.5]} />
        </UI.Rect>
      </UI.Canvas>
    </Application>
  )
}
