import "r3f-stage/styles.css"
import { Application } from "r3f-stage"
import * as UI from "@hmans/scene-ui"
import * as RC from "render-composer"

export const App = () => {
  return (
    <Application>
      <mesh>
        <icosahedronGeometry />
        <meshStandardMaterial color="hotpink" />
      </mesh>

      <RC.ScenePass>
        {/* This now lives in its own layer, with its own pointer events, etc. */}
        <UI.Rect width={10} height={5} debug>
          <UI.Button
            label="Test"
            onPointerDown={(e) => {
              e.stopPropagation()
              alert("Hello!")
            }}
          />
        </UI.Rect>
      </RC.ScenePass>
    </Application>
  )
}
