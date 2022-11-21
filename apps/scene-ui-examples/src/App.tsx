import "r3f-stage/styles.css"
import { Application } from "r3f-stage"
import * as UI from "@hmans/scene-ui"

export const App = () => {
  return (
    <Application>
      <UI.Rect width={5} height={5} debug>
        <UI.Rect
          width={3}
          height={3}
          pivotX={1.1}
          pivotY={1.1}
          anchorX={1}
          anchorY={1}
        ></UI.Rect>
      </UI.Rect>
    </Application>
  )
}
