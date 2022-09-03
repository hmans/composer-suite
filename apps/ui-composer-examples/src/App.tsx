import { styled, globalCss } from "@stitches/react"

const globalStyles = globalCss({
  body: { margin: 0, padding: 0 }
})

const Box = styled("div", {
  backgroundColor: "gainsboro",
  borderRadius: "9999px",
  fontSize: "13px",
  padding: "10px 15px",
  "&:hover": {
    backgroundColor: "lightgray"
  }
})

function UIRoot({ children }: { children?: React.ReactNode }) {
  globalStyles()
  return <div>{children}</div>
}

function App() {
  return (
    <UIRoot>
      <Box>Yooo</Box>
    </UIRoot>
  )
}

export default App
