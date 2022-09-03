import { globalCss, styled } from "@stitches/react"

/* Palette: https://coolors.co/palette/22223b-4a4e69-9a8c98-c9ada7-f2e9e4 */

const globalStyles = globalCss({
  body: {
    margin: 0,
    padding: 0,
    height: "100%",
    width: "100%",
    overflow: "hidden"
  },
  "div#root": {
    width: "100vw",
    height: "100vh"
  }
})

globalStyles()

const Box = styled("div", {
  backgroundColor: "gainsboro",
  borderRadius: "9999px",
  fontSize: "13px",
  padding: "10px 15px",

  "&:hover": {
    backgroundColor: "lightgray"
  }
})

const UIRoot = styled("div", {
  backgroundColor: "#22223B",
  width: "100%",
  height: "100%"
})

const App = () => (
  <UIRoot>
    <Box>Yooo</Box>
  </UIRoot>
)

export default App
