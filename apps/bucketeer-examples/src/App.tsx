import { OrbitControls } from "@react-three/drei"
import { id } from "bucketeer"
import { useBucket } from "bucketeer/react"
import { between, plusMinus } from "randomish"
import { Suspense, useLayoutEffect } from "react"
import * as RC from "render-composer"
import "./App.css"
import { ECS, withJSX, world } from "./state"
import { Systems } from "./Systems"

function App() {
  useThings()

  return (
    <RC.Canvas>
      <RC.RenderPipeline>
        <Suspense>
          <ambientLight intensity={0.5} />
          <directionalLight position={[40, 30, 10]} intensity={0.7} />

          <ECS.Entity health={100} />

          <OrbitControls />
          <Systems />
          <RenderThings />
        </Suspense>
      </RC.RenderPipeline>
    </RC.Canvas>
  )
}

const useThings = () => {
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

    return () => world.clear()
  }, [])
}

const RenderThings = () => {
  const bucket = useBucket(withJSX)

  return (
    <>
      {bucket.entities.map((entity) => (
        <ECS.ExistingEntity key={id(entity)} entity={entity}>
          <ECS.Property name="health" value={between(100, 200)} />
          {entity.jsx}
        </ECS.ExistingEntity>
      ))}
    </>
  )
}

export default App
