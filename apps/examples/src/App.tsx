import { Application } from "r3f-stage"
import "r3f-stage/styles.css"
import { Simple } from "./examples/Simple"
import { PerspectiveCamera } from "@react-three/drei"

export default () => (
  <Application>
    <PerspectiveCamera position={[0, 5, 30]} makeDefault />
    <Simple />
  </Application>
)
