import "r3f-stage/styles.css"
import { Application } from "r3f-stage"
import * as UI from "@hmans/scene-ui"
import * as RC from "render-composer"

export const App = () => {
  return (
    <Application>
      <UI.Rect width={10} height={5} debug>
        <UI.Rect width={8} height={1} anchorY={0}>
          <UI.Button
            label="Test"
            onPointerDown={(e) => {
              e.stopPropagation()
              alert("Hello!")
            }}
          />
        </UI.Rect>
      </UI.Rect>
    </Application>
  )
}
