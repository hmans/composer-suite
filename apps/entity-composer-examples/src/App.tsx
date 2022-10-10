import { Environment, OrbitControls } from "@react-three/drei"
import { useBucket } from "entity-composer/react"
import { plusMinus } from "randomish"
import { Suspense, useEffect } from "react"
import * as RC from "render-composer"
import "./App.css"
import { ECS, withTransform, world } from "./state"
import { Systems } from "./Systems"

function App() {
  useEffect(() => {
    /* Create a few entities */
    for (let i = 0; i < 10; i++) {
      world.write({
        health: 100,
        jsx: (
          <ECS.Property name="transform">
            <mesh position={[plusMinus(4), plusMinus(4), plusMinus(2)]}>
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
          <RenderEntities />
        </Suspense>
      </RC.RenderPipeline>
    </RC.Canvas>
  )
}

const RenderEntities = () => {
  const { entities } = useBucket(world)

  return (
    <>
      {entities.map((entity, i) => (
        <ECS.Entity key={i} entity={entity}>
          {entity.jsx}
        </ECS.Entity>
      ))}
    </>
  )
}

export default App
