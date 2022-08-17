import { Application, Example } from "r3f-stage"
import "r3f-stage/styles.css"
import Simple from "./examples/Simple"

export default () => (
  <Application>
    <Example path="simple">
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </Example>
  </Application>
)
