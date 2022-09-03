import { globalCss, css, styled } from "@stitches/react"

/* Palette: https://coolors.co/palette/22223b-4a4e69-9a8c98-c9ada7-f2e9e4 */

const collapseChildren = css({
  "*:first-child": { marginTop: 0 },
  "*:last-child": { marginBottom: 0 }
})

const globalStyles = globalCss({
  body: {
    margin: 0,
    padding: 0,
    height: "100%",
    width: "100%",
    overflow: "hidden",
    font: "15px/1.5 Inter, sans-serif"
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

const Panel = styled("div", collapseChildren, {
  backgroundColor: "#333",
  color: "#dcc",
  textShadow: "rgba(0, 0, 0, 0.5) 1px 2px 1px",
  padding: "0.8rem"
})

const Text = styled("p", {
  margin: "0.75rem 0"
})

const Heading = styled("h3", {
  font: "inherit",
  fontWeight: "bold",
  textShadow: "rgba(0, 0, 0, 0.5) 2px 2px 1px",
  color: "#F2E9E4",
  margin: "1.5rem 0 0.5rem 0"
})

const App = () => (
  <UIRoot>
    <Panel css={{ width: 360 }}>
      <Heading>Welcome!</Heading>
      <Text>
        This is a panel. It displays things. Amazing! Many curious, interesting
        things, that hopefully will make building editor UIs really useful.
        (This is just a slightly longer paragraph to see how it renders.)
      </Text>
      <Text>Like text.</Text>
      <Text>Or even more text.</Text>
      <Heading>Inputs!</Heading>
      <Text>We should try an input. Inputs are really cool.</Text>
    </Panel>
  </UIRoot>
)

export default App
