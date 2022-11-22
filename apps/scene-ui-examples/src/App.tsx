import "r3f-stage/styles.css"
import { Application } from "r3f-stage"
import * as UI from "@hmans/scene-ui"

export const App = () => {
  return (
    <Application>
      <UI.Rect width={8} height={4} debug>
        <UI.Rect offset={[0.25, 0.25, 0.25, 0.25]}>
          <UI.Rect offset={[0.25, 0, 0.25, 0.25]}></UI.Rect>
        </UI.Rect>
      </UI.Rect>
    </Application>
  )
}
