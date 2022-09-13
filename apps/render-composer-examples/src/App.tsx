import { Animate } from "@hmans/r3f-animate"
import { Environment, Loader, OrbitControls } from "@react-three/drei"
import { Suspense, useRef } from "react"
import { RenderCanvas, RenderPipeline } from "render-composer"
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
  const sun = new Mesh(
    new SphereGeometry(1),
    new MeshBasicMaterial({
      color: new Color(0xffffff),
      fog: false
    })
  )

  sun.position.z = -100
  sun.scale.setScalar(10)

  return (
    <>
      <Loader />

      <RenderCanvas>
        <RenderPipeline
          // vignette
          // bloom
          antiAliasing
          godRays={{ lightSource: sun }}
        >
          <Suspense>
            <color attach="background" args={["#264653"]} />
            <Environment preset="sunset" />

            <primitive object={sun} />

            <directionalLight position={[30, 10, 10]} intensity={1.5} />

            {/* The "sun" */}
            {/* <mesh position={[40, 10, -100]} scale={15} ref={sun}>
              <sphereGeometry />
              <meshStandardMaterial
                color={new Color("white").multiplyScalar(3)}
              />
            </mesh> */}

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

export default App
