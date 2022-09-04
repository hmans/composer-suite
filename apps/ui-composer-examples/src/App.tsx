import { Environment, OrbitControls, Sky } from "@react-three/drei"
import { RenderCanvas, RenderPipeline } from "render-composer"
import { Button } from "./Button"
import { Heading } from "./Heading"
import { HorizontalGroup } from "./HorizontalGroup"
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

const App = () => (
  <Root>
    <HorizontalGroup>
      <RenderCanvas>
        <RenderPipeline bloom antiAliasing vignette>
          <Environment preset="sunset" />
          <Sky />
          {/* <directionalLight position={[40, 10, 0]} intensity={1.8} /> */}
          <mesh>
            <dodecahedronGeometry />
            <meshStandardMaterial color="hotpink" />
          </mesh>
          <OrbitControls />
        </RenderPipeline>
      </RenderCanvas>

      <Panel css={{ width: 400 }}>
        <Heading>Welcome!</Heading>
        <p>
          This is a panel. It displays things. Amazing! Many curious,
          interesting things, that hopefully will make building editor UIs
          really useful. (This is just a slightly longer paragraph to see how it
          renders.)
        </p>
        <p>Like text.</p>
        <p>Or even more text.</p>

        <Heading>Buttons</Heading>
        <p>Buttonnnnssss, they're amazing!</p>

        <VerticalGroup>
          <Button>Click me</Button>
          <Button>Or click this one</Button>
          <Button>How about this one?</Button>
          <HorizontalGroup gap>
            <Button>Left</Button>
            <Button>Right</Button>
          </HorizontalGroup>
        </VerticalGroup>

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
    </HorizontalGroup>
  </Root>
)

export default App
