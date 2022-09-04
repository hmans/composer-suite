import { styled } from "./styles"

export const HorizontalResizer = () => {
  return <HorizontalResizerDiv />
}

const HorizontalResizerDiv = styled("div", {
  backgroundColor: "#000",
  transition: "background-color 0.15s",
  width: 5,
  cursor: "col-resize",
  "&:hover": {
    backgroundColor: "hotpink"
  }
})
