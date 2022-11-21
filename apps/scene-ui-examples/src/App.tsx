import "r3f-stage/styles.css"
import { Application } from "r3f-stage"

export const App = () => {
  return (
    <Application>
      <mesh>
        <icosahedronGeometry />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </Application>
  )
}
