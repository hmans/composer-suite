import "r3f-stage/styles.css"
import { Application } from "r3f-stage"
import * as UI from "@hmans/scene-ui"

export const App = () => {
  return (
    <Application>
      <UI.Canvas width={6} height={4} debug>
        <UI.Rect anchor={[0, 0, 0.5, 1]} offset={[0, 0, 0, 0]} />
      </UI.Canvas>
    </Application>
  )
}
