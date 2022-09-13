import { Animate } from "@hmans/r3f-animate"
import { Environment, Loader, OrbitControls } from "@react-three/drei"
import { Suspense, useLayoutEffect, useRef } from "react"
import {
  RenderCanvas,
  RenderPipeline,
  useRenderPipeline
} from "render-composer"
import {
  Color,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  SphereGeometry
} from "three"

const rotate = (o: Object3D, dt: number) => {
  o.rotation.x += dt * 0.7
  o.rotation.y += dt * 0.5
}

function App() {
  return (
    <>
      <Loader />

      <RenderCanvas>
        <RenderPipeline vignette bloom antiAliasing godRays>
          <Suspense>
            <color attach="background" args={["#264653"]} />
            <Environment preset="sunset" />

            <directionalLight position={[30, 10, 10]} intensity={1.5} />

            <Sun />

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
        </RenderPipeline>
      </RenderCanvas>
    </>
  )
}

const Sun = () => {
  const { sun } = useRenderPipeline()

  useLayoutEffect(() => {
    console.log(sun)
    sun.position.set(40, 10, -100)
  }, [])

  return null
}

export default App
