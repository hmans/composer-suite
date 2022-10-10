import { Environment, OrbitControls } from "@react-three/drei"
import { Suspense, useEffect } from "react"
import * as RC from "render-composer"
import "./App.css"
import { ECS, world } from "./state"
import { Systems } from "./Systems"

function App() {
  useEffect(() => {
    /* Create a few entities */
    for (let i = 0; i < 10; i++) {
      world.write({
        health: 100,
        jsx: (
          <ECS.Property name="transform">
            <mesh>
              <icosahedronGeometry />
              <meshStandardMaterial color="red" />
            </mesh>
          </ECS.Property>
        )
      })
    }

    return () => {
      for (let i = world.entities.length - 1; i >= 0; i--) {
        world.remove(world.entities[i])
      }
    }
  }, [])

  return (
    <RC.Canvas>
      <RC.RenderPipeline>
        <Suspense>
          <Environment preset="sunset" />
          <OrbitControls />
          <Systems />
        </Suspense>
      </RC.RenderPipeline>
    </RC.Canvas>
  )
}

const RenderEntities = () => {
  return (
    <>
      {world.entities.map((entity) => (
        <ECS.Entity entity={entity}>{entity.jsx}</ECS.Entity>
      ))}
    </>
  )
}

export default App
