import { Environment, OrbitControls } from "@react-three/drei"
import { Suspense, useEffect } from "react"
import * as RC from "render-composer"
import "./App.css"
import { ECS, world } from "./state"

function App() {
  useEffect(() => {
    console.log(world.entities)
  })

  return (
    <RC.Canvas>
      <RC.RenderPipeline>
        <Suspense>
          <Environment preset="sunset" />
          <OrbitControls />

          <ECS.Entity>
            <ECS.Property name="health" value={100} />

            <ECS.Property name="transform">
              <mesh>
                <icosahedronGeometry />
                <meshStandardMaterial color="red" />
              </mesh>
            </ECS.Property>
          </ECS.Entity>
        </Suspense>
      </RC.RenderPipeline>
    </RC.Canvas>
  )
}

export default App
