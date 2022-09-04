import { Animate, useAnimationFrame } from "@hmans/things"
import { Environment, OrbitControls, Sky } from "@react-three/drei"
import { MutableRefObject, useRef } from "react"
import { RenderCanvas, RenderPipeline } from "render-composer"
import { Group } from "three"
import { Button } from "./Button"
import { Heading } from "./Heading"
import { HorizontalGroup } from "./HorizontalGroup"
import { HorizontalResizer } from "./HorizontalResizer"
import { Input } from "./Input"
import { Root } from "./Root"
import { collapseChildren, styled } from "./styles"
import { VerticalGroup } from "./VerticalGroup"

const Panel = styled("div", collapseChildren, {
  backgroundColor: "$panelBackground",
  color: "$panelText",
  textShadow: "rgba(0, 0, 0, 0.2) 1px 2px 1px",
  padding: "1rem"
})

const ControlGroup = styled("table", { borderSpacing: 0, width: "100%" })

const ControlRow = styled("tr")

const ControlLabel = styled("td", { paddingRight: "1rem" })

const Control = styled("td")

const MeshPanel = ({ mesh }: { mesh: MutableRefObject<Group> }) => {
  const rotX = useRef<HTMLInputElement>(null!)
  const rotY = useRef<HTMLInputElement>(null!)
  const rotZ = useRef<HTMLInputElement>(null!)

  useAnimationFrame(() => {
    if (!mesh.current) return

    rotX.current.value = mesh.current.rotation.x.toFixed(3)
    rotY.current.value = mesh.current.rotation.y.toFixed(3)
    rotZ.current.value = mesh.current.rotation.z.toFixed(3)
  })

  return (
    <Panel>
      <Heading>Mesh Playground</Heading>
      <p>Just playing around with some two-way binding stuff.</p>

      <ControlGroup>
        <ControlRow>
          <ControlLabel>Rotation:</ControlLabel>
          <Control>
            <HorizontalGroup align={"center"} gap>
              X
              <Input ref={rotX} type="number" />
              Y
              <Input ref={rotY} type="number" />
              Z
              <Input ref={rotZ} type="number" />
            </HorizontalGroup>
          </Control>
        </ControlRow>
      </ControlGroup>
    </Panel>
  )
}

const App = () => {
  const mesh = useRef<Group>(null!)

  return (
    <Root>
      <HorizontalGroup>
        <RenderCanvas>
          <RenderPipeline bloom antiAliasing vignette>
            <Environment preset="sunset" />
            <Sky />
            <OrbitControls />

            <Animate
              ref={mesh}
              fun={(mesh, dt) => (mesh.rotation.x = mesh.rotation.y += 2 * dt)}
            >
              <mesh>
                <dodecahedronGeometry />
                <meshStandardMaterial color="hotpink" />
              </mesh>
            </Animate>
          </RenderPipeline>
        </RenderCanvas>

        <HorizontalResizer />

        <VerticalGroup css={{ width: 600 }}>
          <MeshPanel mesh={mesh} />
          <Panel>
            <Heading>Welcome!</Heading>
            <p>
              This is a panel. It displays things. Amazing! Many curious,
              interesting things, that hopefully will make building editor UIs
              really useful. (This is just a slightly longer paragraph to see
              how it renders.)
            </p>
            <p>Like text.</p>
            <p>Or even more text.</p>
          </Panel>

          <Panel>
            <Heading>Buttons</Heading>
            <p>Buttonnnnssss, they're amazing!</p>

            <VerticalGroup>
              <Button>Click me</Button>
              <Button>Or click this one</Button>
              <HorizontalGroup gap>
                <Button>Left</Button>
                <Button>Right</Button>
              </HorizontalGroup>
            </VerticalGroup>
          </Panel>

          <Panel>
            <Heading>Inputs</Heading>
            <p>We should try some inputs. Inputs are really cool.</p>

            <ControlGroup>
              <ControlRow>
                <ControlLabel>Text:</ControlLabel>
                <Control>
                  <Input type="text" spellCheck="false" />
                </Control>
              </ControlRow>

              <ControlRow>
                <ControlLabel>Number:</ControlLabel>
                <Control>
                  <Input type="number" />
                </Control>
              </ControlRow>

              <ControlRow>
                <ControlLabel>Range:</ControlLabel>
                <Control>
                  <Input type="range" />
                </Control>
              </ControlRow>

              <ControlRow>
                <ControlLabel>Vector:</ControlLabel>
                <Control>
                  <HorizontalGroup align={"center"} gap>
                    X
                    <Input type="number" />
                    Y
                    <Input type="number" />
                    Z
                    <Input type="number" />
                  </HorizontalGroup>
                </Control>
              </ControlRow>
            </ControlGroup>
          </Panel>
        </VerticalGroup>
      </HorizontalGroup>
    </Root>
  )
}

export default App
