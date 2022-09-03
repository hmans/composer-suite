import { globalCss, styled } from "@stitches/react"

/* Palette: https://coolors.co/palette/22223b-4a4e69-9a8c98-c9ada7-f2e9e4 */

const globalStyles = globalCss({
  body: {
    margin: 0,
    padding: 0,
    height: "100%",
    width: "100%",
    overflow: "hidden",
    font: "15px/1.3 Inter, sans-serif"
  },
  "div#root": {
    width: "100vw",
    height: "100vh"
  }
})

globalStyles()

const UIRoot = styled("div", {
  backgroundColor: "#111",
  width: "100%",
  height: "100%",
  display: "flex"
})

const Panel = styled("div", {
  backgroundColor: "#333",
  color: "#F2E9E4",
  textShadow: "rgba(0, 0, 0, 0.2) 0px 1px 1px",
  padding: "0.8rem"
})

const Text = styled("div", {
  margin: "0.5rem 0"
})

const App = () => (
  <UIRoot>
    <Panel>
      <Text>This is a panel. It displays things. Amazing!</Text>
      <Text>Like text.</Text>
      <Text>Or even more text.</Text>
    </Panel>
  </UIRoot>
)

export default App
