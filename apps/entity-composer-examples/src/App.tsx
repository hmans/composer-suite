import { Environment, OrbitControls } from "@react-three/drei"
import { Suspense, useEffect } from "react"
import * as RC from "render-composer"
import "./App.css"
import { ECS, world } from "./state"
import { Systems } from "./Systems"

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
          <Systems />

          <ECS.Entity health={95}>
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
