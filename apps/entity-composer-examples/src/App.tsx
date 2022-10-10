import { Environment, OrbitControls } from "@react-three/drei"
import { Suspense } from "react"
import * as RC from "render-composer"
import "./App.css"
import { ECS } from "./state"

function App() {
  return (
    <RC.Canvas>
      <RC.RenderPipeline>
        <Suspense>
          <Environment preset="sunset" />
          <OrbitControls />

          <ECS.Entity>
            <ECS.Property name="health" value={100} />

            <mesh>
              <icosahedronGeometry />
              <meshStandardMaterial color="red" />
            </mesh>
          </ECS.Entity>
        </Suspense>
      </RC.RenderPipeline>
    </RC.Canvas>
  )
}

export default App
