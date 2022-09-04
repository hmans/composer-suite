import { Environment, OrbitControls, Sky } from "@react-three/drei"
import { RenderCanvas, RenderPipeline } from "render-composer"
import { HorizontalGroup } from "./HorizontalGroup"
import { collapseChildren, styled } from "./styles"
import { VerticalGroup } from "./VerticalGroup"

const UIRoot = styled("div", {
  backgroundColor: "#111",
  width: "100%",
  height: "100%",
  display: "flex",
  userSelect: "none"
})

const Panel = styled("div", collapseChildren, {
  backgroundColor: "$panelBackground",
  color: "$panelText",
  textShadow: "rgba(0, 0, 0, 0.2) 1px 2px 1px",
  padding: "1rem"
})

const Heading = styled("h3", {
  font: "inherit",
  fontWeight: "bold",
  textShadow: "rgba(0, 0, 0, 0.5) 2px 2px 1px",
  color: "$headings",
  margin: "1.5rem 0 0.5rem 0"
})

const Input = styled("input", {
  font: "inherit",
  color: "inherit",
  backgroundColor: "inherit",
  border: "0",
  background: "#222",
  padding: "5px 8px",
  outline: "none",
  caretColor: "hotpink",
  borderRadius: "5px",
  boxShadow:
    "inset 1px 1px 2px 0 rgba(0, 0, 0, 0.5), inset -1px -1px 2px 0 rgba(255, 255, 255, 0.2)",
  "&::selection": {
    backgroundColor: "hotpink",
    color: "white"
  },
  width: "100%"
})

const Button = styled("button", {
  font: "inherit",
  border: "0",
  backgroundColor: "$panelText",
  color: "$panelBackground",
  padding: "0.3rem 0.75rem",
  borderRadius: "5px",
  boxShadow:
    "2px 2px 2px 0 rgba(0, 0, 0, 0.5), inset 2px 2px 10px 0 rgba(255, 255, 255, 0.8)",
  outline: "none",
  cursor: "pointer",
  width: "100%",

  transition: "background-color 0.1s ease-out",

  "&:hover": {
    backgroundColor: "#ddd"
  }
})

const ControlGroup = styled("table", { borderSpacing: 0, width: "100%" })

const ControlRow = styled("tr")

const ControlLabel = styled("td", { paddingRight: "1rem" })

const Control = styled("td")

const App = () => (
  <UIRoot>
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
          <HorizontalGroup>
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
              <HorizontalGroup align={"center"}>
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
  </UIRoot>
)

export default App
