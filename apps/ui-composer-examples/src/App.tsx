import { Animate, useAnimationFrame } from "@hmans/things"
import { Environment, OrbitControls, Sky } from "@react-three/drei"
import { MutableRefObject, Suspense, useRef } from "react"
import { Canvas, DefaultRenderPipeline } from "render-composer"
import { Group } from "three"
import * as UI from "ui-composer"

const MeshPanel = ({ mesh }: { mesh: MutableRefObject<Group> }) => {
  const posX = useRef<HTMLInputElement>(null!)
  const posY = useRef<HTMLInputElement>(null!)
  const posZ = useRef<HTMLInputElement>(null!)

  const rotX = useRef<HTMLInputElement>(null!)
  const rotY = useRef<HTMLInputElement>(null!)
  const rotZ = useRef<HTMLInputElement>(null!)

  useAnimationFrame(() => {
    if (!mesh.current) return

    posX.current.value = mesh.current.position.x.toFixed(3)
    posY.current.value = mesh.current.position.y.toFixed(3)
    posZ.current.value = mesh.current.position.z.toFixed(3)

    rotX.current.value = mesh.current.rotation.x.toFixed(3)
    rotY.current.value = mesh.current.rotation.y.toFixed(3)
    rotZ.current.value = mesh.current.rotation.z.toFixed(3)
  })

  return (
    <UI.Panel>
      <UI.Heading>Mesh Playground</UI.Heading>
      <p>Just playing around with some two-way binding stuff.</p>

      <UI.Control>
        <UI.Label>Position</UI.Label>
        <UI.HorizontalGroup align={"center"} gap>
          X
          <UI.Input ref={posX} type="number" />
          Y
          <UI.Input ref={posY} type="number" />
          Z
          <UI.Input ref={posZ} type="number" />
        </UI.HorizontalGroup>
      </UI.Control>

      <UI.Control>
        <UI.Label>Rotation</UI.Label>
        <UI.HorizontalGroup align={"center"} gap>
          X
          <UI.Input ref={rotX} type="number" />
          Y
          <UI.Input ref={rotY} type="number" />
          Z
          <UI.Input ref={rotZ} type="number" />
        </UI.HorizontalGroup>
      </UI.Control>
    </UI.Panel>
  )
}

const App = () => {
  const mesh = useRef<Group>(null!)

  return (
    <UI.Root>
      <UI.HorizontalGroup>
        <div style={{ flex: 2 }}>
          <Canvas>
            <DefaultRenderPipeline>
              <Suspense>
                <Environment preset="sunset" />
                <Sky />
                <OrbitControls />

                <Animate
                  ref={mesh}
                  fun={(mesh, dt) =>
                    (mesh.rotation.x = mesh.rotation.y += 2 * dt)
                  }
                >
                  <mesh>
                    <dodecahedronGeometry />
                    <meshStandardMaterial color="hotpink" />
                  </mesh>
                </Animate>
              </Suspense>
            </DefaultRenderPipeline>
          </Canvas>
        </div>

        <UI.HorizontalResizer />

        <UI.VerticalGroup css={{ flex: 1 }}>
          <MeshPanel mesh={mesh} />
          <UI.Panel>
            <UI.Heading>Welcome!</UI.Heading>
            <p>
              This is a panel. It displays things. Amazing! Many curious,
              interesting things, that hopefully will make building editor UIs
              really useful. (This is just a slightly longer paragraph to see
              how it renders.)
            </p>
            <p>Like text.</p>
            <p>Or even more text.</p>
          </UI.Panel>

          <UI.Panel>
            <UI.Heading>Buttons</UI.Heading>
            <p>Buttonnnnssss, they're amazing!</p>

            <UI.VerticalGroup>
              <UI.Button>Click me</UI.Button>
              <UI.Button>Or click this one</UI.Button>
              <UI.HorizontalGroup gap>
                <UI.Button>Left</UI.Button>
                <UI.Button>Right</UI.Button>
              </UI.HorizontalGroup>
            </UI.VerticalGroup>
          </UI.Panel>

          <UI.Panel>
            <UI.Heading>Inputs</UI.Heading>
            <p>We should try some inputs. Inputs are really cool.</p>

            <UI.Control>
              <UI.Label>Text</UI.Label>
              <UI.Input type="text" spellCheck="false" />
            </UI.Control>

            <UI.Control>
              <UI.Label>Number</UI.Label>
              <UI.Input type="number" />
            </UI.Control>

            <UI.Control>
              <UI.Label>Range</UI.Label>
              <UI.Input type="range" />
            </UI.Control>

            <UI.Control>
              <UI.Label>Vector</UI.Label>

              <UI.HorizontalGroup align={"center"} gap>
                X
                <UI.Input type="number" />
                Y
                <UI.Input type="number" />
                Z
                <UI.Input type="number" />
              </UI.HorizontalGroup>
            </UI.Control>
          </UI.Panel>
        </UI.VerticalGroup>
      </UI.HorizontalGroup>
    </UI.Root>
  )
}

export default App
