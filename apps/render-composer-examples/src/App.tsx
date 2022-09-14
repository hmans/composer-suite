import { Animate } from "@hmans/r3f-animate"
import { Environment, Loader } from "@react-three/drei"
import { Suspense, useState } from "react"
import * as RC from "render-composer"
import { Mesh, Object3D } from "three"

const rotate = (o: Object3D, dt: number) => {
  o.rotation.x += dt * 0.7
  o.rotation.y += dt * 0.5
}

function App() {
  const [sun, setSun] = useState<Mesh | null>(null!)

  return (
    <>
      <Loader />

      <RC.Canvas>
        <RC.RenderPipeline>
          <RC.EffectPass>
            <RC.SelectiveBloomEffect />
            <RC.SMAAEffect />
            {sun && <RC.GodRaysEffect lightSource={sun} />}
            <RC.VignetteEffect />
          </RC.EffectPass>

          <Suspense>
            <color attach="background" args={["#264653"]} />
            <Environment preset="sunset" />

            <mesh position={[0, 0, -10]} ref={setSun}>
              <sphereGeometry />
              <meshBasicMaterial color="#f5ebe0" />
            </mesh>

            <directionalLight position={[30, 10, 10]} intensity={1.5} />

            {/* <Sun /> */}

            <Animate
              fun={(o, _, { clock }) => {
                o.position.x = Math.sin(clock.getElapsedTime() * 0.7) * 2
                o.position.y = Math.sin(clock.getElapsedTime() * 1.1)
                o.position.z = Math.cos(clock.getElapsedTime() * 0.5)
              }}
            >
              <Animate fun={rotate}>
                <mesh>
                  <icosahedronGeometry />
                  <meshStandardMaterial
                    color="#E9C46A"
                    metalness={0.5}
                    roughness={0.5}
                  />
                </mesh>
              </Animate>
            </Animate>
          </Suspense>
        </RC.RenderPipeline>
      </RC.Canvas>
    </>
  )
}

export default App
