import { collapseChildren, styled } from "../styles"

export * from "./BooleanControl"
export * from "./Button"
export * from "./Heading"
export * from "./HorizontalGroup"
export * from "./HorizontalResizer"
export * from "./Input"
export * from "./Root"
export * from "./VerticalGroup"

export const Panel = styled("div", collapseChildren, {
  backgroundColor: "$panelBackground",
  borderRadius: 5,

  color: "$panelText",
  textShadow: "rgba(0, 0, 0, 0.2) 1px 2px 1px",
  padding: "1rem"
})

export const Control = styled("div", {
  display: "flex",
  alignItems: "center",
  height: "2rem"
})

export const Label = styled("div", {
  flex: "0 0 30%"
})
