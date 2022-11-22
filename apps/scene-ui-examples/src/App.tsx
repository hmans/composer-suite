import "r3f-stage/styles.css"
import { Application } from "r3f-stage"
import * as UI from "@hmans/scene-ui"

export const App = () => {
  return (
    <Application>
      <UI.Rect width={8} height={4} debug>
        <UI.Rect offset={[1, 1, 1, 1]}></UI.Rect>
      </UI.Rect>
    </Application>
  )
}
