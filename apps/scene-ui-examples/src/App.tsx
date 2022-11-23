import "r3f-stage/styles.css"
import { Application } from "r3f-stage"
import * as UI from "@hmans/scene-ui"

export const App = () => {
  return (
    <Application>
      <UI.Canvas width={6} height={4} debug>
        <UI.Rect anchor={[0.1, 0.1, 0.9, 0.9]} offset={[0, 0, 0, 0]}>
          <UI.Rect anchor={[0.5, 1, 0.5, 1]} offset={[-0.5, -0.4, 0.5, -0.1]} />
        </UI.Rect>
      </UI.Canvas>
    </Application>
  )
}
