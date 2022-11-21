import "r3f-stage/styles.css"
import { Application } from "r3f-stage"
import * as UI from "@hmans/scene-ui"

export const App = () => {
  return (
    <Application>
      <UI.Rect width={10} height={5} debug>
        <UI.Rect
          width={8}
          height={2}
          anchorY={0}
          pivotY={0}
          anchorX={0}
          pivotX={1}
        >
          {/* <UI.Button
            label="Test"
            onPointerDown={(e) => {
              e.stopPropagation()
              alert("Hello!")
            }}
          /> */}
        </UI.Rect>
      </UI.Rect>
    </Application>
  )
}
