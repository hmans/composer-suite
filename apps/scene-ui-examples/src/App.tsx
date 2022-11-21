import "r3f-stage/styles.css"
import { Application } from "r3f-stage"
import * as UI from "@hmans/scene-ui"

export const App = () => {
  return (
    <Application>
      <mesh>
        <icosahedronGeometry />
        <meshStandardMaterial color="hotpink" />
      </mesh>

      <UI.Rect width={10} height={5} debug></UI.Rect>
    </Application>
  )
}
