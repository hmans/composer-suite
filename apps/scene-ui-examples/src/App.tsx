import "r3f-stage/styles.css"
import { Application } from "r3f-stage"
import * as UI from "@hmans/scene-ui"

export const App = () => {
  return (
    <Application>
      <UI.Canvas width={6} height={4} debug>
        <UI.Rect anchor={[0, 0.2, 1, 1]} offset={[1, 1, 1, 1]} />
      </UI.Canvas>
    </Application>
  )
}
