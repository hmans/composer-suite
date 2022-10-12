import { styled } from "../styles"
import React from "react"

export const HorizontalResizer = () => {
  const [dragging, setDragging] = React.useState(false)

  const handleMouseDown = React.useCallback(() => {
    setDragging(true)
  }, [])

  const handleMouseUp = React.useCallback(() => {
    setDragging(false)
  }, [])

  return (
    <HorizontalResizerDiv
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    />
  )
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
