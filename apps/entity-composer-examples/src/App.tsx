import { Environment, OrbitControls } from "@react-three/drei"
import { useBucket } from "entity-composer/react"
import { between, plusMinus } from "randomish"
import { Suspense, useLayoutEffect } from "react"
import * as RC from "render-composer"
import "./App.css"
import { ECS, withJSX, world } from "./state"
import { Systems } from "./Systems"

function App() {
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
  useLayoutEffect(() => {
    /* Create a few entities */
    for (let i = 0; i < 10; i++) {
      world.add({
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
      console.log("removing entities", world.entities.length)
      while (world.entities.length > 0) {
        world.remove(world.entities[0])
      }

      console.log("After deletion:", world.entities.length)
    }
  }, [])

  const bucket = useBucket(withJSX)
  console.log("rendering entities:", bucket.entities.length)

  return (
    <>
      {bucket.entities.map((entity, i) => (
        <ECS.MemoizedEntity key={Math.random()} entity={entity}>
          <ECS.Property name="health" value={between(100, 200)} />
          {entity.jsx}
        </ECS.MemoizedEntity>
      ))}
    </>
  )
}

export default App
