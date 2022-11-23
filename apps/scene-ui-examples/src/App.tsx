import "r3f-stage/styles.css"
import { Application } from "r3f-stage"
import * as UI from "@hmans/scene-ui"

export const App = () => {
  return (
    <Application>
      <UI.Canvas width={6} height={4} debug>
        <UI.Rect anchor={[0, 0, 0, 0]} margin={[0.5, 1, 0.5, 1]}>
          <UI.Rect anchor={[1, 0.5, 0, 0.5]} margin={[-1, 1.5, 0.1, 1.5]} />
        </UI.Rect>
      </UI.Canvas>
    </Application>
  )
}
